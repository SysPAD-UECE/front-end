<template>
    <q-card class="q-pa-lg">
        <q-card-section>
        <div class="text-h6 text-grey-8">
          Columns
          <q-btn label="Protect Data" class="float-right text-capitalize shadow-3" color="primary" icon="key" @click="this.recordAllColumns()" :disable="!isAnonymizationSelected"/>
        </div>
        <div>
            <text-subtitle>Select a Anonymization type for each column and click on Protect Data button.</text-subtitle>
        </div>
      </q-card-section>
      <q-card-section>
      <q-table
        :rows="columnsList"
        :columns="columnsColumns"
        separator="none"
        :rows-per-page-options="[0]"
      >
      <template v-slot:body-cell-anonType="props">
          <q-select
            v-model="props.row.anonymization"
            :options="anonymizationTypeList"
            :dense="true"
            :options-dense="true"
          />
        </template>
      </q-table>
    </q-card-section>
      
    </q-card>
    <q-card><h5>anaonymization records </h5>
        <q-btn label="anonymization record"  @click="this.getAnonymizationRecord()" ></q-btn>
{{ this.anonymizationRecord }}
</q-card>
  </template>
  
  <script>
  const columnsColumns = [
    {
      label: "Name",
      field: "name",
      align: "left",
    },
    {
      label: "Data Type",
      field: "type",
      align: "left",
    },
    {
        label: "Anonymization Type",
      name: "anonType",
      align: "left",
    },
  ];
  import { defineComponent, ref } from "vue";
  import { api } from "src/boot/axios";
  import { mapGetters } from "vuex";
  import { Loading, Notify } from "quasar";
  
  
  export default defineComponent({
    name: "anonymitazation-table-picker",
    computed: {
      ...mapGetters("auth", ["getToken"]),
      //checking if there's some anonymization type selected to protect data 
      isAnonymizationSelected() {
      return this.columnsList.some(item => item.anonymization !== null);
    },
    },
    methods: {
        
      checkSelectedDatabase() {
        console.log("teste")
        console.log(this.databaseID)
        console.log(this.tableID)
        if (!this.databaseID || !this.tableID) {
          Notify.create({
            type: "negative",
            message: "You need to select a database to procced",
            timeout: 2000,
          });
          this.$router.push("/client/anonymization/databases");
        } else {
          this.getColumnsList()
          this.getAnonymizationList()
        }
      },
      getColumnsList(){
        if (!this.getToken) return;
      Loading.show();
      api
        .get(`database/${this.databaseID}/table/${this.tableID}/columns`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          Loading.hide();
          this.columnsList = response.data.table_columns;
          //add new property to columnsList to anonymization
            this.columnsList.forEach((dic) => (dic["anonymization"] = null));
            console.log("columns" + JSON.stringify(this.columnsList))
        }).catch(function (err) {
        Loading.hide()
      });
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
            const resp = response.data.items
            this.anonymizationTypeList = resp.map((resp) => resp.name)
            console.log(this.anonymizationTypeList)
        })
    },
    //get anonymization records to developmen version
        getAnonymizationRecord() {
            if (!this.getToken) return;
      api
      if (!this.getToken) return;
      api
        .get("./anonymization_record", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
            this.anonymizationRecord = response.data.items
        })
        },
        updateAnonymizationTechnique() {
            console.log(this.columnsList)
      },
    },
    data() {
      return {
        columnsColumns,
        columnsList: [],
        progressDialog: ref(false),
        selectedTable: null,
        anonymizationTypeList: [],
        anonymizationRecord: null

      };
    },
    created() {
      this.databaseID = this.$route.params.databaseID;
      this.tableID = this.$route.params.tableID
      this.checkSelectedDatabase()

      
    }
  });
  </script>
  