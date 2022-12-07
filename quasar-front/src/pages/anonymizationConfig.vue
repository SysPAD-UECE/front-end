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
            <q-btn color="primary col-4" label="SELECT" @click="getColumnsDatabase()" />
          </div>
        </q-card-section>
      </q-form>

      <q-card-section class="my-card">
        <q-table hide-header
      hide-bottom  :rows-per-page-options="[this.columns_list.length]" row-key="columnsList" :rows="rows2" :columns="columns">
          <template v-slot:body-cell-anonymization="props">
            <q-select filled v-model="model[props.row.index]" :options="select_anonymization"
              label="Select Anonymization Type" color="teal" clearable options-selected-class="text-deep-orange">
            </q-select>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section>
        <div class="q-mt-md row" >
          <q-btn v-if="(this.contador != 6)" color="primary col grow" label="ADD COLUMNS" @click="sendDataAnonymization()" />
        </div>
        <div class="q-mt-md row" >
          <q-btn v-if="(this.contador === 6)" color="grey col grow" label="ANONYMIZATION" @click="testGetAnony()" />
        </div>
        <!-- <div>
          <q-btn color="primary col-4" label="TEST" @click="testGetAnony()" />
        </div> -->
      </q-card-section>



    </q-card>
  </q-page>
</template>

<script>
import { Notify, Loading } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'anonymizationConfig',
  computed: {
    ...mapGetters('auth', ['getToken']),
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    testEncrypt() {
      const data = {
        'id_db': parseInt(this.id_database),
        'table': this.tableName
      }

      console.log(data)
      if(!this.getToken) return
      Loading.show()
      api.post('/encryptDatabase', data, {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        console.log(response.data)
        Loading.hide()

        this.alertAnonymizationStarted()
        this.testGetAnony()

      }).catch(err => {
        console.log(err)
      })
    },
    testGetAnony() {
      console.log("TESTE GET ANONY FUNCIONANDO")
      const data = {
        'id_db': this.id_database,
        'table': this.tableName
      }
      if(!this.getToken) return

      api.post('/anonymizationDatabase', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        console.log("deubom")
        console.log(response.data)
        Notify.create({
          type: 'positive',
          message: 'Anonymization completed!',
          timeout: 1000
        })
        this.$router.push('./databases')
      }).catch(err => {
        console.log(err)
      })
    },
    sendAnonymization(id_anonymization, columns_to_anonymization) {
      console.log("sendAnonymization chamado")
      const data = {
        id_db: this.id_database,
        id_anonymization_type: id_anonymization,
        table: this.tableName,
        columns: columns_to_anonymization
      }
      console.log(data)
      if(!this.getToken) return
      Loading.show()
      api.post('/addAnonymization', data, {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.contador = this.contador + 1
        console.log(response.data)
        Loading.hide()
      }).catch(err => {
        console.log(err)
      })
    },
    sendDataAnonymization() {
      console.log('sendDataAnonymization')

      var anonymizationJSON = []
      anonymizationJSON = JSON.parse(JSON.stringify(this.anonymization))

      var modelJSON = []
      modelJSON = JSON.parse(JSON.stringify(this.model))

      var dict_anonymization = new Object()

      anonymizationJSON.forEach((key) => {
        dict_anonymization[key.name] = key.id
      })

      var columns_to_anonymization = new Object()

      modelJSON.forEach((key, index) => {

        let type = dict_anonymization[key]

        if(typeof columns_to_anonymization[type] === 'undefined'){
          var new_array = []
          new_array.push(this.columns_list[index])
          columns_to_anonymization[type] = new_array
        }
        else {
          var new_array = []
          new_array = columns_to_anonymization[type]
          new_array.push(this.columns_list[index])
          columns_to_anonymization[type] = new_array
        }
      })
      let cont = 0;
      this.anonymization.forEach((key) => {
        this.contador = 0
        let anonymization_id = key.id
        this.sendAnonymization(anonymization_id, columns_to_anonymization[anonymization_id])
        cont = cont +1;
        console.log("index" + cont)

      })
      // console.log(cont)
      // console.log(anonymization)
      // if(cont === this.anonymization.length){
      //   console.log("iojdjn")
      //   this.testGetAnony()
      // }
    },
    getAnonymizationType() {
      console.log("getAnonymizationType chamado")
      if (!this.getToken) return
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
        this.tableList = response.data
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
        this.columns_list = keys
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
    updateModel() {
      var arr = []
      arr = JSON.parse(JSON.stringify(this.columns2))
      console.log('teste array:')
      let length = arr.length
      console.log(length)
      arr.forEach((key) => {
        this.model.push('Not sensitive')
      })
    }

  },
  data() {
    const $q = useQuasar()
    function alertAnonymizationStarted () {
      $q.dialog({
        title: 'Alert',
        message: 'Anonymization started, you will be notificated when it ends.'
      }).onOk(() => {
        // this.$router.push('./databases')
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
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
    let contador = 0
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
      columns2: [],
      columns_list: [],
      alertAnonymizationStarted,
      contador
    }
  },
  created() {
    this.id_database = this.$route.params.data
    console.log(this.id_database)
    this.getTableList();
  }
})
</script>
