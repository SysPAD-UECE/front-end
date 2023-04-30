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
            v-model="props.row.anonymizationTechinique"
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
      <q-btn label="recordAllColumns" @click="recordAllColumns()"></q-btn>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "src/boot/axios";
import { mapGetters } from "vuex";

import { ref } from "vue";

export default defineComponent({
  name: "anonymitazation-table-picker",

  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  methods: {
    updateAnonymizationTechnique(column, anonymization) {
      column.anonymizationTechinique = anonymization;
      console.log(this.dBColumnsInfo);
    },
    // imprimirDadosAtualizados() {
    //   this.dBColumnsInfo.forEach((cliente) => {
    //     console.log(
    //       `Nome: ${cliente.sensitive_column_names} - Sorvete escolhido: ${cliente.anonymizationTechinique}`
    //     );
    //   });
    // },
    //ok
    getTableList() {
      // console.log("getTableList");
      if (!this.getToken) return;
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
        })
        .catch((err) => {
          console.log(err.mesage);
        });
    },
    //ok
    getAnonymizationList() {
      // console.log("anonymizationList")
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
        .catch((err) => {
          console.log(err.mesage);
        });
    },

    getTableColumnsInfo() {
      if (!this.getToken) return;
      // console.log(
      //   "GET COLUMNS TABLE " + this.selectedDatabaseId + ", " + this.tableSelect
      // );
      api
        .get(
          `database/sensitive_columns/${this.selectedDatabaseId}?table_name=${this.tableSelect}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.getToken}`,
            },
          }
        )
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const resp = response.data;
          //vou precisar mudar isso
          this.dBColumnsInfo = resp.sensitive_column_names.map((column) => {
            return {
              sensitive_column_names: column,
              anonymizationTechinique: null,
            };
          });
          //isso mudar só pra add names
          this.columnNamesList = response.data.sensitive_column_names;
          console.log(JSON.stringify(this.dBColumnsInfo));
        })
        .catch((err) => {
          console.log(err.mesage);
        });
    },
    async recordAllColumns() {
      try {
        console.log("TESTE");
        let promises = [];
        for (var i = 1; i <= this.anonymizationTechniquesName.length; i++) {
          console.log(this.anonymizationTechniques);
          const item = this.anonymizationTechniques.items.find(
            (item) => item.id === i
          );
          console.log(item);

          const techniques = this.columnNamesList.filter(
            (col) => col.anonymizationTechinique === item.name
          );

          const columnsToRecord = techniques.map(
            (obj) => obj.sensitive_column_names
          );
          console.log(
            "anonymizacao: " + item.name + " colunas: " + columnsToRecord
          );
          promises.push(this.recordColumn(columnsToRecord, i));
          // await this.recordColumn(columnsToRecord, i);
        }
        // await Promise.allSettled(promises)
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

        // const encryptResponse = await this.encryptRecordedData();
        // const encryptError =
        //   encryptResponse.status !== 200 || encryptResponse.data.error
        //     ? "Erro ao encriptar dados!"
        //     : null;

        // if (encryptError) {
        //   throw new Error(`${encryptError}`);
        // }

        // const anonymizeResponse = await this.anonymizeRecordedData();
        // const anonymizeError =
        //   anonymizeResponse.status !== 200 || anonymizeResponse.data.error
        //     ? "Erro ao anonimizar dados!"
        //     : null;

        // if (anonymizeError) {
        //   throw new Error(`${anonymizeError}`);
        // }

        // console.log("Dados protegidos com sucesso!");
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
      return new Promise((resolve, reject) => {
        api
          .post(
            `/encryption/database/${this.selectedDatabaseId}`,
            this.tableSelect,
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
      return new Promise((resolve, reject) => {
        api
          .post(
            `/anonymization/database/${this.selectedDatabaseId}`,
            this.tableSelect,
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
        field: "sensitive_column_names",
        name: "sensitive_column_names",
        align: "left",
      },
      // {
      //   label: "Data Type",
      //   field: "column_types",
      //   name: "column_types",
      //   align: "left",
      // },
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
