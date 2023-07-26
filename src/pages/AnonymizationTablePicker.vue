<template>
  <q-card class="q-pb-lg q-pt-sm">
    <q-table
      title="Tables"
      :rows="tablesList"
      :columns="tablesColumns"
      separator="none"
      hide-pagination
    >
      <template name="props-anonymized" v-slot:body-cell-anonymized="props">
        <q-td :props="props">
          <span
            :class="{
              'text-red': !props.row.anonymized,
              'text-green-7': props.row.anonymized,
            }"
          >
            {{ props.row.anonymized ? "Anonymized" : "Not Anonymized" }}
          </span>
        </q-td>
      </template>
      <template name="props-encrypted" v-slot:body-cell-encrypted="props">
        <q-td :props="props">
          <span
            :class="{
              'text-red': !props.row.encrypted,
              'text-green-7': props.row.encrypted,
            }"
          >
            {{ props.row.encrypted ? "Encrypted" : "Not Encrypted" }}
          </span>
        </q-td>
      </template>
      <template name="props-action" v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            :disabled="props.row.encrypted || props.row.anonymized"
            label="See Progress"
            @click="this.showProgress(props.row.id)"
            size="sm"
            color="primary"
          ></q-btn>
          <q-btn
            label="Send to Anonymization"
            size="sm"
            color="primary"
            @click="send(props.row.id)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-card>
  <q-btn label="teste" @click="this.showProgress"></q-btn>
  <q-dialog v-model="progressDialog">
    <q-card class="q-ma-sm">
      <q-card-section  class="row items-center q-pb-sm" >
        <div class="text-h6">Data Protection Progress</div>
        <q-space/>
        <q-btn icon="close" flat round dense v-close-popup/>
      </q-card-section>
      <q-card-section  class="q-pa-md row items-start q-gutter-md">
        <div class="column items-center q-mr-md">
            <div  class="col">Anonymization Progress</div>
          <div class="col">
            <q-circular-progress :value="this.anonymizationProgress" size="50px" color="primary" class="q-ma-md" />
          </div>
          <div  class="col">{{ this.anonymizationProgress }} %</div>
        </div >
        <div class="column items-center" >
          <div class="col">Encryption Progress</div>
          <div class="col">
            <q-circular-progress :value="this.encryptionProgress" size="50px" color="primary" class="q-ma-md" />
          </div>
          <div  class="col">{{ this.encryptionProgress }} %</div>
        </div>
      </q-card-section>
    </q-card>

  </q-dialog>
</template>

<script>
const tablesColumns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "center",
  },
  {
    label: "Name",
    field: "name",
    align: "center",
  },
  {
    name: "encrypted",
    label: "Encryptation Status",
    field: "encrypted",
    align: "center",
  },
  {
    name: "anonymized",
    label: "Anonymization Status",
    field: "anonymizated",
    align: "center",
  },
  {
    name: "action",
    align: "center",
  },
];
import { defineComponent, ref } from "vue";
import { api } from "src/boot/axios";
import { mapGetters } from "vuex";
import { Loading } from "quasar";

export default defineComponent({
  name: "anonymitazation-table-picker",
  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  methods: {
    showProgress(table) {
      this.progressDialog = true
      this.anonymizationProgressUpdate(table);
      this.updateIntervalAnonymization = setInterval(this.anonymizationProgressUpdate, 1000);
      this.encryptionProgressUpdate(table);
      this.updateIntervalEncryptation = setInterval(this.encryptionProgressUpdate, 1000);
    },
    getTableList() {
      if (!this.getToken) return;
      Loading.show();
      api
        .get(`database/${this.databaseID}/table`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          Loading.hide();
          this.tablesList = response.data.items;
          console.log(response.data);
        });
    },

    anonymizationProgressUpdate(table) {
      api
        .get(`anonymization/database/${this.databaseID}/table/${table}/progress`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          // this.anonymizationProgress = response.data.progress
          console.log(response.data);
        });
    },
    encryptionProgressUpdate(table) {
      api
        .get(`encryption/database/${this.databaseID}/table/${table}/progress`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          // this.encryptionProgress = response.data.progress
          console.log(response.data);
        });
    },
  },
  data() {
    const selected = ref([]);
    return {
      tablesColumns,
      selected,
      tablesList: [],
      anonymizationProgress: 99,
      encryptionProgress: 99,
      progressDialog: ref(false),
    };
  },
  created() {
    this.databaseID = this.$route.params.data;
    this.getTableList();
    // this.anonymizationProgressUpdate();
    // this.updateInterval = setInterval(this.anonymizationProgressUpdate, 1000)
  },
  beforeDestroy() {
    clearInterval(this.updateInterval);
  },
});
</script>
