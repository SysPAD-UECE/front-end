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
          <span :class="{'text-red': !props.row.anonymized, 'text-green-7': props.row.anonymized}">
            {{ props.row.anonymized ? 'Anonymized' : 'Not Anonymized' }}
          </span>
        </q-td>
      </template>
      <template name="props-encrypted" v-slot:body-cell-encrypted="props">
        <q-td :props="props">
          <span :class="{'text-red': !props.row.encrypted, 'text-green-7': props.row.encrypted}">
            {{ props.row.encrypted ? 'Encrypted' : 'Not Encrypted' }}
          </span>
        </q-td>
      </template>
      <template name="props-action" v-slot:body-cell-action="props">
        <q-td :props="props">
            <q-btn v-if="!props.row.encrypted && !props.row.anonymized" :disabled="props.row.encrypted || props.row.anonymized" label="Send to Anonymization"  size="sm" color="primary"></q-btn>
            <q-btn v-else label="Send to Anonymization"  size="sm" color="primary" @click="send(props.row.id)"></q-btn>
          </q-td>
      </template>
    </q-table>
    <q-card-section class="q-mt-md" >
      <q-linear-progress :value="anonymizationProgress" :max="100" />
</q-card-section>
  </q-card>
</template>

<script>
const tablesColumns = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "center"
  },
  {
    label: "Name",
    field: "name",
    align: "center"
  },
  {
    name: "encrypted",
    label: "Encryptation Status",
    field: "encrypted",
    align: "center"
  },
  {
    name: "anonymized",
    label: "Anonymization Status",
    field: "anonymizated",
    align: "center"
  },
  {
    name: 'action',
    align: "center"
  }
]
import { defineComponent,ref } from "vue";
import { api } from "src/boot/axios";
import { mapGetters } from "vuex";
import { Loading } from "quasar";

export default defineComponent({
  name: "anonymitazation-table-picker",
  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  methods: {
    
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
          Loading.hide()
          this.tablesList = response.data.items
          console.log(response.data)
        })
    },

    anonymizationProgressUpdate(){
      api
        .get(`anonymization/database/${this.databaseID}/table/${1}/progress`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getToken}`,
          },
        })
        .then((response) => {
          // this.anonymizationProgress = response.data.progress
          console.log(response.data)
        })
    }
  },
  data () {
    const selected = ref([])
    return {
      tablesColumns,
      selected,
      tablesList: [],
      anonymizationProgress: 0
    };
  },
  created() {
    this.databaseID = this.$route.params.data;
    this.getTableList();
    // this.anonymizationProgressUpdate();
    // this.updateInterval = setInterval(this.anonymizationProgressUpdate, 1000)
  },
  beforeDestroy() {
    clearInterval(this.updateInterval)
  }
  
});
</script>
