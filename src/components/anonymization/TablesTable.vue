<template>
  <q-card class="q-pb-lg q-pt-sm">
    <q-table
      title="Tables"
      :rows="tablesList"
      :columns="tablesColumns"
      separator="none"
      hide-pagination
      row-key="id"
      selection="single"
      v-model:selected="selected"
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
            <q-btn v-if="!props.row.encrypted && !props.row.anonymized" label="Send to Anonymization"  size="sm" color="primary"></q-btn>
            <q-btn v-else label="Anonymization" size="sm" class="q-ml-sm" flat dense @click="send(props.row.id)"></q-btn>
          </q-td>
      </template>
    </q-table>
  </q-card>
  <q-card><columnsTable :databaseID=this.databaseID /></q-card>
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
    field: "anonymized",
    align: "center"
  },
  {
    name: 'action',
    align: "center"
  }
]

import { api } from "src/boot/axios";
import { mapGetters } from "vuex";
import { Loading, ref } from "quasar";
import columnsTable from 'src/components/anonymization/ColumnsTable.vue'

export default {
  name: "tablesTable",
  props: ["databaseID"],
  components: {
    columnsTable
  },
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
          console.log(this.tablesList)
        })
    },
  },
  data () {
    const selected = ref([])
    return {
      selected,
      tablesColumns,
      tablesList: [],
    };
  },
  // watch: {
  //   tablesList() {
  //     this.$nextTick(() => {
  //       this.$refs.table.refresh();
  //     });
  //   },
  // },
  created() {
    this.databaseID = this.$route.params.data;
    this.getTableList();
  },
};
</script>
