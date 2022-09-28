<template>

    <q-page class="container" padding>
      <q-card>
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el label="Anonymization Configuration" icon="hotel_class" to="/client/anonymizationconfig" />
          </q-breadcrumbs>
        </div>
        <div id="q-app">
          <div class="q-pa-md">
            <q-card v-show='!this.$q.loading.isActive'>
              <q-card-section class="">

                      <q-form class="">

                        <q-select filled v-model="tables" :options="tables" label="Select Table" stack-label
                          :dense="true" :options-dense="true" option-label="name" option-value=this.tableSeted />

                          <div class="">
                          <q-btn color="primary" label="salvar" @click="salvar = true" />
                        <q-btn color="primary" label="voltar" @click="recarregar = true" left="30px" />
                        </div>

                      </q-form>



              </q-card-section>
            </q-card>
          </div>
        </div>
        <q-card class="my-card">
          <q-table row-key="id" v-model="firstDialog" v-model:pagination="pagination" :rows="rows" :columns="columns"
            :rows-per-page-options="[10, 20, 30, 40, 50, 100, 0]">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="type" :props="props">
                  {{ props.row.type}}
                </q-td>
              </q-tr>
            </template>
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
import LoginVue from './Login.vue'



  const tablesList = []


  const columnsList = ['nome', 'cpf']
  const columns = [



    {
      label: 'tablesList',

      field: 'tablesList',

      name: 'tablesList',

      align: 'left'
    },


    {
      label: 'columnsList',
      field: row => row.columnsList,
      name: 'columnsList',
      align: 'left',
      sortable: true
    },


    {
      label: 'Anonymizaçao',

      field: 'actions',

      name: 'actions',

      align: 'left'
    }
  ]
  const pagination = ref({
    sortBy: 'database',
    descending: false,
    page: 1,
    rowsPerPage: 10
  })
  let rows = tablesList.slice(0).map(r => ({ ...r }))



  rows.forEach((row, index) => {
    row.index = index
  })
  const model = ref([]);
  rows.forEach(() => {
    model.value.push('');
  })

  export default defineComponent({
    name: 'anonymizationConfig',
    computed: {
      computed: {
        ...mapGetters('auth', ['getToken']),
        ...mapGetters('auth', ['isAuthenticated'])
      },
    },
    data() {
      return {
        database: {
          id_db_type: ref('MySQL'),
          test: ref('public'),
          name: '',
          host: '',
          user: '',
          port: '',
          password: ''
        },
        databaseConfig: {
          id: ''
        },
        tableSeted: '',
        tables: [],
        validdatabases: [],
        tablesList,
        columnsList,
        columns
      }
    },
    methods: {
      getValidDatabases() {
        if (!this.getToken) return
        Loading.show()
        api.get('/getValidDatabases', {
          headers: {
            Authorization: `Bearer ${this.getToken}`
          }
        }).then(response => {
          this.validdatabases = response.data
          Loading.hide()
        }).catch(err => {
          console.log(err)
        })
      },

      getTableDatabase() {
        if (!this.getToken) return
        Loading.show()
        console.log(this.databaseConfig.id)
        api.post('/columnsDatabase', ).then(response => {
          this.tables = response.data
          Loading.hide()
        }).catch(err => {
          console.log(err)
        })
      },

      getColumnsDatabase() {
        if (!this.getToken) return
        Loading.show()
        console.log(this.tableSeted)
        api.post('/columnsDatabase', ).then(response => {
          this.tables = response.data
          Loading.hide()
        }).catch(err => {
          console.log(err)
        })
      },

    },
    mounted() {
      this.getValidDatabases()
    }
  })
  </script>

  <style scoped>
  .wave {
    position: fixed;
    height: 100%;
    left: 0;
    bottom: 0;
    z-index: -1;
  }
  </style>
