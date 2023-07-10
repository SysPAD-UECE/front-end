<template>
  <q-card>
    <q-card-section class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/client/home" />
        <q-breadcrumbs-el
          label="Anonymization"
          icon="hotel_class"
          to="/client/anonymization"
        />
      </q-breadcrumbs>
    </q-card-section>

    <q-card-section>
      <div class="q-px-md">Select the table you want to anonymize</div>
      <q-card-section class="row justify-between">
        <q-select
          class="col q-pr-md"
          outlined
          v-model="tableSelect"
          :options="tableList"
          :dense="true"
          :options-dense="true"
        ></q-select>
        <div>
          <q-btn
            color="primary col-4"
            label="Ok"
            @click="getTableColumnsInfo()"
          />
        </div>
      </q-card-section>
    </q-card-section>

    <q-card-section class="columns-table">
      <q-table class="custom-table" :rows="dBColumnsInfo" :columns="columns" row-key="column">
        <template v-slot:body-cell-anonymization="props">
          <q-select
            v-model="props.row.anonymization"
            :options="anonymizationTechniquesName"
            @input="
              updateAnonymizationTechnique(
                props.row,
                props.row.anonymizationTechinique
              )
            "
          />
        </template>
      </q-table>
      <div class="q-mt-md row">
      <q-btn  label="Protect Data" color="primary" @click="this.recordAllColumns()"></q-btn>
    </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "src/boot/axios";
import { mapGetters } from "vuex";
import { Notify, Loading } from "quasar";
import { ref } from "vue";

export default defineComponent({
  name: "anonymitazation-table-picker",
  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  methods: {
    checkSelectedDatabase() {
      if (!this.selectedDatabaseId) {
        Notify.create({
          type: "negative",
          message: "You need to select a database to procced.",

          timeout: 5000,
              actions: [
                { label: 'OK', color: 'yellow', handler: () => { /* ... */ } }
              ]
        });
        this.$router.push("/client/anonymization/databases");
      } else {
        this.getTableList();
        this.getAnonymizationList();
      }
    },
    updateAnonymizationTechnique(column, anonymization) {
      column.anonymization = anonymization;
      console.log(this.dBColumnsInfo);
    },
    getTableList() {
      if (!this.getToken) return;
      Loading.show();
      api
        .get(`database/table_names/${this.selectedDatabaseId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          this.tableList = response.data.table_names;
          Loading.hide();
        })
    },
    getAnonymizationList() {
      if (!this.getToken) return;
      api
        .get("./anonymization_type", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          this.anonymizationTechniques = response.data;
          const resp = response.data.items;
          this.anonymizationTechniquesName = resp.map((resp) => resp.name);
        })
    },
    getTableColumnsInfo() {
      if (!this.getToken) return;
      Loading.show();
      api
        .get(
          `database/table_columns/${this.selectedDatabaseId}?table_name=${this.tableSelect}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.getToken}`,
            },
          }
        )
        .then((response) => {
          Loading.hide();
          this.dBColumnsInfo = response.data.table_columns;
          this.dBColumnsInfo.forEach((dic) => (dic["anonymization"] = null));
          this.columnNamesList = this.dBColumnsInfo.map((dic) => dic.name);
        })
    },
    async recordAllColumns() {
      try {

        let promises = [];
        for (var i = 1; i <= this.anonymizationTechniquesName.length; i++) {
          const item = this.anonymizationTechniques.items.find(
            (item) => item.id === i
          );
          var columnsToRecord = this.dBColumnsInfo
            .filter((d) => d.anonymization === item.name)
            .map((d) => d.name);
          promises.push(this.recordColumn(columnsToRecord, i));
        }

        const results = await Promise.allSettled(promises);

        results.forEach((result) => {
          if (result.status != "fulfilled") {
            throw new Error(
              "Async function error:  " + result.reason
            );
          }
        });

        const encryptResponse = await this.encryptRecordedData();
        const encryptError =
          encryptResponse.status !== 200
            ? encryptResponse.data
            : null;
        if (encryptError) {
          throw new Error(`${encryptError}`);
        }

        const anonymizeResponse = await this.anonymizeRecordedData();
        const anonymizeError =
          anonymizeResponse.status !== 200
            ? anonymizeResponse.data
            : null;

        if (anonymizeError) {
          throw new Error(`${anonymizeError}`);
        }

        Notify.create({
          type: "positive",
          message: "Your data is protected",
          timeout: 2000,
        });

      } catch (error) {
        Notify.create({
          type: 'negative',
          message: 'An error ocurred. Please try again later.',
          timeout: 2000
        })
      }
    },
    async recordColumn(columns, id) {
      const data = {
        database_id: parseInt(this.selectedDatabaseId),
        anonymization_type_id: id,
        table_name: this.tableSelect,
        columns: columns,
      };

      return new Promise((resolve, reject) => {
        api
          .post("/anonymization_record", data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.getToken}`,
            },
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async encryptRecordedData() {
      const data = {table_name: this.tableSelect}
      return new Promise((resolve, reject) => {
        api
          .post(
            `/encryption/database/${this.selectedDatabaseId}`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.getToken}`,
              },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async anonymizeRecordedData() {
      const data = {table_name: this.tableSelect}
      return new Promise((resolve, reject) => {
        api
          .post(
            `/anonymization/database/${this.selectedDatabaseId}`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.getToken}`,
              },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  data() {
    const columns = [
      {
        label: "Column",
        field: "name",
        name: "name",
        align: "left",
      },
      {
        label: "Data Type",
        field: "type",
        name: "type",
        align: "left",
      },
      {
        label: "Select Anonymization",
        field: "anonymization",
        name: "anonymization",
        align: "left",
        format: (value) => value,
      },
    ];
    return {
      selectedDatabaseId: "",
      tableList: [],
      tableSelect: ref(null),
      columns,
      dBColumnsInfo: [],
      rowsToAnonymize: [],
    };
  },
  created() {
    this.selectedDatabaseId = this.$route.params.data;
    this.checkSelectedDatabase();

  },
});
</script>
