<template>
  <q-page padding>
    <q-card>

      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el label="Anonymization" icon="hotel_class" to="/client/anonymization" />
          <q-breadcrumbs-el label="Setting Anonimyzation" icon="star" to="/client/anonymizationconfig" />
        </q-breadcrumbs>
      </div>

      <q-form>
        <div class="q-px-md">Select table</div>
        <q-card-section class="row justify-between">
          <q-select class="col q-pr-md" filled v-model="tableName" :options="tableList" :dense="true" :options-dense="true"
           option-value="" >{{ this.tableName }}</q-select>

          <div>
            <q-btn color="primary col-4" label="SEND" @click="getColumnsDatabase()" />
          </div>
        </q-card-section>
      </q-form>



      <q-card class="my-card">

        <q-table row-key="columnsList" :rows="rows2" :columns="columns">

        </q-table>
      </q-card>
    </q-card>
  </q-page>
</template>

<script>
import { Notify, Loading } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import { ref } from 'vue'



const comlumnsList = []
const dataType = []

// {
//   label: 'Anonymizaçao',

//   field: 'actions',

//   name: 'actions',

//   align: 'left'
// }
// ]

// let rows = comlumnsList.slice(0).map(r => ({ ...r }))

// rows.forEach((row, index) => {
//   row.index = index
// })

// const model = ref([]);
// rows.forEach(() => {
//   model.value.push('');
// })

export default defineComponent({
  name: 'anonymizationConfig',
  computed: {
    computed: {
      ...mapGetters('auth', ['getToken']),
      ...mapGetters('auth', ['isAuthenticated'])
    },
  },
  data() {
    const columns = [
      {
        label: 'Columns',

        field: 'comlumnsList',

        name: 'comlumnsList',

        align: 'left'
      },
      {
        label: 'Data Type',
        field: 'dataType',
        name: 'dataType',
        align: 'left',
        sortable: true
      }
    ]
    const rows2 = [
      {
        comlumnsList: '',
        dataType: ''
      }
    ]
    return {
      database: {
        tableName: ref(null),
        ip_database: '',
      },
      validdatabases: [],

      columns,
      tableList: [],
      selectTable: '', rows2
    }
  },
  methods: {
    getTableList() {
      console.log(this.ip_database)
      if (!window.localStorage.getItem('localToken')) return

      api.post('/tablesDatabase', { id_db: this.ip_database }, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('localToken')}`
        }
      }).then(response => {

        this.tableList = response.data.tables
        console.log(this.tableList)
        // Loading.hide()
      }).catch(err => {
        console.log(err.mesage)
      })
    },
    getColumnsDatabase() {

      if (!window.localStorage.getItem('localToken')) return

      const data = {
        id_db: this.ip_database,
        table: this.tableName
      }
      console.log(this.tableName)
      api.post('/columnsDatabase', data, {
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${window.localStorage.getItem('localToken')}` }
      }).then(response => {
        console.log("não deu erro")
        var keys = Object.keys(response.data)
        var values = Object.values(response.data)
        console.log(response.data)
      }).catch(err => {
        console.log(err.mesage)
      })
    }
  },
  created() {
    this.ip_database = this.$route.params.data
    console.log(this.ip_database)
    this.getTableList()
  }
})
</script>
