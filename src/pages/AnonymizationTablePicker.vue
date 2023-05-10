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
          filled
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
      <q-table :rows="dBColumnsInfo" :columns="columns" row-key="column">
        <template v-slot:body-cell-anonymization="props">
          <q-select
            filled
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

      <q-btn label="Protect Data" color="primary" @click="this.recordAllColumns()"></q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "src/boot/axios";
import { mapGetters } from "vuex";
import { Notify, Dialog, Loading } from "quasar";
import { ref, toRaw } from "vue";

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
          message: "You need to select a database to procced",
          timeout: 2000,
        });
        this.$router.push("/client/anonymization/databases");
      }
    },
    updateAnonymizationTechnique(column, anonymization) {
      column.anonymization = anonymization;
      console.log(this.dBColumnsInfo);
    },
    //ok
    getTableList() {
      if (!this.getToken) return;
      Loading.show();
      this.checkSelectedDatabase();
      api
        .get(`database/table_names/${this.selectedDatabaseId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          this.tableList = response.data.table_names;
          console.log("table list " + this.tableList);
          Loading.hide();
        })
        .catch((err) => {
          console.log(err.mesage);
        });
    },
    //ok
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
          console.log(this.anonymizationTechniques);
          const resp = response.data.items;
          this.anonymizationTechniquesName = resp.map((resp) => resp.name);
        })
        .catch((err) => {
          console.log(err.mesage);
        });
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
          console.log("Get Columns: " + JSON.stringify(response.data));
          this.dBColumnsInfo = response.data.table_columns;
          this.dBColumnsInfo.forEach((dic) => (dic["anonymization"] = null));
          console.log(JSON.stringify(this.dBColumnsInfo));
          Loading.hide();
          this.columnNamesList = this.dBColumnsInfo.map((dic) => dic.name);
          console.log(this.columnNamesList);
        })
        .catch((err) => {
          console.log(err.mesage);
        });
    },

    async recordAllColumns() {
      try {
        Loading.show()
        console.log("TESTE");
        let promises = [];
        for (var i = 1; i <= this.anonymizationTechniquesName.length; i++) {
          console.log(
            "anonymization techniques" +
              JSON.stringify(this.anonymizationTechniques)
          );
          const item = this.anonymizationTechniques.items.find(
            (item) => item.id === i
          );
          console.log("item: " + item.name);

          console.log(this.dBColumnsInfo);

          var columnsToRecord = this.dBColumnsInfo
            .filter((d) => d.anonymization === item.name)
            .map((d) => d.name);


          // const columnsToRecord = techniques.map(
          //   (obj) => obj.sensitive_column_names
          // );

          console.log(
            "anonymizacao: " + item.name + " colunas: " + columnsToRecord
          );
          promises.push(this.recordColumn(columnsToRecord, i));
        }

        const results = await Promise.allSettled(promises);

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            console.log("Resultado da função assíncrona: ", result.value);
          } else {
            throw new Error(
              "Erro na execução da função assíncrona: " + result.reason
            );
          }
        });

        const encryptResponse = await this.encryptRecordedData();
        console.log("response"+ JSON.stringify(encryptResponse))
        const encryptError =
          encryptResponse.status !== 200
            ? encryptResponse.data
            : null;

        if (encryptError) {
          throw new Error(`${encryptError}`);
        }

        const anonymizeResponse = await this.anonymizeRecordedData();
        console.log("responde" + JSON.stringify(anonymizeResponse))
        const anonymizeError =
          anonymizeResponse.status !== 200
            ? anonymizeResponse.data
            : null;

        if (anonymizeError) {
          throw new Error(`${anonymizeError}`);
        }
        Loading.hide()
        Notify.create({
          type: "positive",
          message: "Your data is protected",
          timeout: 2000,
        });
        console.log("Dados protegidos com sucesso!");
      } catch (error) {
        console.error("Erro: ", error);
      }
    },
    async recordColumn(columns, id) {
      console.log("ADD ANONYMIZATION RECORD " + columns + "  " + id);
      const data = {
        database_id: parseInt(this.selectedDatabaseId),
        anonymization_type_id: id,
        table_name: this.tableSelect,
        columns: columns,
      };
      console.log(data);
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
      console.log("Encryptation method");
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
      console.log("Anonymization method");
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
    this.getTableList();
    this.getAnonymizationList();
  },
});
</script>
