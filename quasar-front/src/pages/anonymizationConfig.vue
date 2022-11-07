<template>
  <q-page padding>
    <q-card>

      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/client/home" />
          <q-breadcrumbs-el label="Anonymization" icon="hotel_class" to="/client/anonymization" />
          <q-breadcrumbs-el label="Setting Anonimyzation" icon="star" to="/client/anonymizationconfig" />
        </q-breadcrumbs>
      </div>

      <q-form>
        <div class="q-px-md">Select table</div>
        <q-card-section class="row justify-between">
          <q-select class="col q-pr-md" filled v-model="tableName" :options="tableList" :dense="true"
            :options-dense="true" option-value=""></q-select>
          <div>
            <q-btn color="primary col-4" label="SEND" @click="getColumnsDatabase()" />
          </div>
        </q-card-section>
      </q-form>
      <q-card class="my-card">
        <q-table row-key="columnsList" :rows="rows2" :columns="columns">
          <template v-slot:body-cell-anonymization="props">
            <q-select filled v-model="model[props.row.index]"
              :options="select_anonymization"
              label="Selecione a anonymizacao" color="teal" clearable options-selected-class="text-deep-orange"  >{{this.model}}
            </q-select>
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

export default defineComponent({
  name: 'anonymizationConfig',
  computed: {
      ...mapGetters('auth', ['getToken']),
      ...mapGetters('auth', ['isAuthenticated'])
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

        field: row => row.dataType,
        name: 'dataType',
        align: 'left'
      },
      {
        label: 'Anonymization',
        field: 'anonymization',
        name: 'anonymization',
        align: 'left'
      }
    ]

    const rows2 = []
    const model = ref([])

    let rows = rows2.slice(0).map(r => ({ ...r }))

    rows.forEach((row, index) => {
      row.index = index
    })

    rows.forEach(() => {
      model.value.push('');
    })

    return {
      tableName: ref(null),
      id_database: '',
      columns,
      tableList: [],
      select_anonymization: [],
      anonymization: [],
      selectTable: '',
      rows2,
      shape: ref('line'),
      model,
      rows,
      columns2: []
    }
  },
  methods: {

    getAnonymizationType() {
      console.log("getAnonymizationType chamado")
      if(!this.getToken) return
      api.get('/getAnonymizationType', {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {

        response.data.forEach((key, id) => {
          this.select_anonymization.push(key.name)
          this.anonymization.push({
            id: key.id,
            name: key.name
          })
        })
        console.log(this.select_anonymization)
        console.log(response.data)
        this.anonymization.forEach((key) => {
          if (key.name == "ppcbtf") {
            console.log(key.id)
          }
        })
        //Loading.hide()
      }).catch(err => {
        console.log(err)
      })
    },
    getTableList() {
      if (!this.getToken) return
      api.post('./tablesDatabase', { 'id_db': this.id_database }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        console.log("oiwwww")
        this.tableList = response.data.tables
        console.log(this.tableList)
        // Loading.hide()
      }).catch(err => {
        console.log(err.mesage)
      })
    },
    getColumnsDatabase() {
      if (!this.getToken) return
      const data = {
        id_db: this.id_database,
        table: this.tableName
      }
      api.post('/columnsDatabase', data, {
        headers: { Authorization: `Bearer ${this.getToken}` }
      }).then(response => {
        if (this.rows2.length != 0) this.rows2 = []
        console.log(response.data)
        const keys = Object.keys(response.data)
        const value = Object.values(response.data)
        this.getAnonymizationType()
        keys.forEach((key, id) => {
          this.columns2.push(key)
          this.rows2.push({
            comlumnsList: key,
            dataType: value[id],
            index: id
          })
        })
        this.updateModel()
      }).catch(err => {
        console.log(err.mesage)
      })
    },
    updateModel(){
      var arr = []
      arr = JSON.parse(JSON.stringify(this.columns2))
      console.log('teste array:')
      let length = arr.length
      console.log(length)

      arr.forEach((key)=>{
        this.model.push('Not sensitive')
      })
      console.log(model)
    }

  },
  created() {
    this.id_database = this.$route.params.data
    console.log(this.id_database)
    this.getTableList();
  }
})
</script>
