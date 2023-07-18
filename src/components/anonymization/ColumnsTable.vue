<template>
  <q-card class="q-pb-lg q-pt-sm">
    <q-table
      title="Sensitive Columns"
      :rows="columnsList"
      :columns="columnsColumns"
      separator="none"
      hide-pagination
    >
    </q-table>
  </q-card>
</template>

<script>
const columnsColumns = [
  {
    label: "Column Name",
    field: "",
    align: "center"
  },
  {
    label: "Data Type",
    field: "",
    align: "center"
  },
  {
    name: "selectAnonymization",
    label: "Select Anonymization",
    field: "",
    align: "center"
  }
]


import { api } from "src/boot/axios";
import { mapGetters } from "vuex";
import { Loading } from "quasar";

export default {
  name: "columnsTable",

  props: ["databaseID", "tableID"],
  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  methods: {
    getTableList() {
      if (!this.getToken) return;
      Loading.show();
      api
        .get(`database/${this.databaseID}/table/${this.tableID}/sensitive_columns`, {
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
    return {
      columnsColumns,
      columnsList: [],
    };
  }
}

</script>
