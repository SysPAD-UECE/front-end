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
          <q-btn color="primary col-4" label="Ok" @click="getColumnsTable()" />
        </div>
      </q-card-section>
    </q-card-section>

    <q-card-section class="columns-table">
      <q-table :rows="columnsList" :columns="columns" row-key="column">
        <template v-slot:body-cell-anonymization="props">
          <q-select
            filled
            v-model="props.row.anonymizationTechinique"
            :options="anonymizationTechniquesList"
            @input="
              updateAnonymizationTechnique(
                props.row,
                props.row.anonymizationTechinique
              )
            "
          />
        </template>
      </q-table>
      <!-- <q-btn
        label="Imprimir dados atualizados"
        @click="imprimirDadosAtualizados()"
      /> -->
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
    imprimirDadosAtualizados() {
      this.columnsList.forEach((cliente) => {
        console.log(
          `Nome: ${cliente.sensitive_column_names} - Sorvete escolhido: ${cliente.anonymizationTechinique}`
        );
      });
    },
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
          console.log(this.tableList);
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
          console.log(JSON.stringify(response.data));
          const resp = response.data.items;
          this.anonymizationTechniquesList = resp.map((resp) => resp.name);
          console.log(JSON.stringify(this.anonymizationTechniquesList));
        })
        .catch((err) => {
          console.log(err.mesage);
        });
    },
    //ok
    getColumnsTable() {
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
          this.columnsList = resp.sensitive_column_names.map((column) => {
            return {
              sensitive_column_names: column,
              anonymizationTechinique: null,
            };
          });
          console.log(JSON.stringify(this.columnsList));
        })
        .catch((err) => {
          console.log(err.mesage);
        });
    },
    updateAnonymizationTechnique(column, anonymization) {
      column.anonymizationTechinique = anonymization;
      console.log(this.columnsList);
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
      columnsList: [],
    };
  },
  created() {
    this.selectedDatabaseId = this.$route.params.data;
    this.getTableList();
    this.getAnonymizationList();
  },
});
</script>
