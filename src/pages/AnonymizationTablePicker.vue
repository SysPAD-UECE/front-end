<template>
  <q-page padding>
    <q-card>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/client/home" />
          <q-breadcrumbs-el label="Anonymization" icon="hotel_class" to="/client/anonymization" />
        </q-breadcrumbs>
      </div>

      <q-form name="select-table">
        <div class="q-px-md">Select the table you want to anonymize</div>
        <q-card-section class="row justify-between">
          <q-select class="col q-pr-md" filled v-model="tableSelect" :options="tableList" :dense="true"
            :options-dense="true" option-value=""></q-select>
          <div>
            <q-btn color="primary col-4" label="Ok" @click="getColumnsTable()" />
          </div>
        </q-card-section>
      </q-form>

      <q-card-section class="my-card">
        <q-table hide-header hide-bottom :rows-per-page-options="[this.columnsList.length]" row-key="columnsList"
          :rows="slicedRows" :columns="columns">
          <template v-slot:body-cell-anonymization="props">
            <q-select filled v-model="anonymizationTechniquesSelect[props.row.index]" :options="anonymizationTechniquesList"
              label="Select anonymization techniques" color="teal" clearable options-selected-class="text-deep-orange">
            </q-select>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section name="anonymization-buttons">
        <div class="q-mt-md row">
          <q-btn v-if="(this.columnsCounter != 6)" color="primary col grow" label="Send data"
            @click="setColumnsAnonymization()" />
        </div>
        <div class="q-mt-md row">
          <q-btn v-if="(this.columnsCounter === 6)" color="grey col grow" label="ANONYMIZATION" @click="sendDataForEncryption()" />

        </div>
      </q-card-section>

      <q-dialog v-model="startAnonymizationDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Alert</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            The anonymization proccess was started sucessfully.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" onclick="location.href='./client/databases'" v-close-popup />
          </q-card-actions>/
        </q-card>
      </q-dialog>

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
  name: 'anonymitazation-table-picker',
  computed: {
    ...mapGetters('auth', ['getToken']),
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    //refatorado
    getTableList() {
      console.log("getTableList")
      if (!this.getToken) return
      api.get(`database/table_names/${this.selectedDatabaseId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.tableList = response.data.table_names
        console.log(this.tableList)
      }).catch(err => {
        console.log(err.mesage)
      })
    },
    getColumnsTable() {
      if (!this.getToken) return
      const data = {
        id_db: this.selectedDatabaseId,
        table: this.tableSelect
      }
      api.post('/columnsDatabase', data, {
        headers: { Authorization: `Bearer ${this.getToken}` }
      }).then(response => {
        if (this.slicedRows.length != 0) this.slicedRows = []

        const keys = Object.keys(response.data)
        const value = Object.values(response.data)
        this.columnsList = keys

        this.getAnonymizationType()

        keys.forEach((key, id) => {
          this.slicedColumns.push(key)
          this.slicedRows.push({
            comlumnsList: key,
            dataType: value[id],
            index: id
          })
        })

        this.setDefaultNotSensitiveOption()

      }).catch(err => {
        console.log(err.mesage)
      })
    },
    getAnonymizationType() {
      if (!this.getToken) return
      api.get('/getAnonymizationType', {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {

        //getting each name and id from response data
        response.data.forEach((key, id) => {
          this.anonymizationTechniquesList.push(key.name)
          this.anonymization.push({
            id: key.id,
            name: key.name
          })
        })

        //searching anonymization ppcbtf to get id
        this.anonymization.forEach((key) => {
          if (key.name == "ppcbtf") {
            console.log(key.id)
          }
        })

      }).catch(err => {
        console.log(err)
      })
    },

    //defining Not sensitive as default
    setDefaultNotSensitiveOption() {
      var arr = []
      arr = JSON.parse(JSON.stringify(this.slicedColumns))
      console.log('teste array:')
      let length = arr.length
      console.log(length)
      arr.forEach((key) => {
        this.anonymizationTechniquesSelect.push('Not sensitive')
      })
    },

    //transforming the data into the type required by the back-end
    setColumnsAnonymization() {

      var anonymizationJSON = []
      anonymizationJSON = JSON.parse(JSON.stringify(this.anonymization))

      var anonymizationTechniquesSelectJSON = []
      anonymizationTechniquesSelectJSON = JSON.parse(JSON.stringify(this.anonymizationTechniquesSelect))

      var dict_anonymization = new Object()

      anonymizationJSON.forEach((key) => {
        dict_anonymization[key.name] = key.id
      })

      var anonymizationColumns = new Object()

      anonymizationTechniquesSelectJSON.forEach((key, index) => {

        let type = dict_anonymization[key]

        if (typeof anonymizationColumns[type] === 'undefined') {
          var new_array = []
          new_array.push(this.columnsList[index])
          anonymizationColumns[type] = new_array
        }
        else {
          var new_array = []
          new_array = anonymizationColumns[type]
          new_array.push(this.columnsList[index])
          anonymizationColumns[type] = new_array
        }
      })

      //sending each column
      let cont = 0;
      this.anonymization.forEach((key) => {
        this.columnsCounter = 0
        let anonymization_id = key.id
        this.sendDataForAnonymization(anonymization_id, anonymizationColumns[anonymization_id])
        cont = cont + 1;
        console.log("index" + cont)

      })

    },

    sendDataForAnonymization(id_anonymization, anonymizationColumns) {
      if (!this.getToken) return
      const data = {
        id_db: this.selectedDatabaseId,
        id_anonymization_type: id_anonymization,
        table: this.tableSelect,
        columns: anonymizationColumns
      }
      api.post('/addAnonymization', data, {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        this.columnsCounter = this.columnsCounter + 1
      }).catch(err => {
        console.log(err)
      })
    },

    sendDataForEncryption() {
      const data = {
        'id_db': parseInt(this.selectedDatabaseId),
        'table': this.tableSelect
      }

      console.log(data)
      if (!this.getToken) return

      api.post('/sendDataForEncryptionbase', data, {
        headers: {
          Authorization: `Bearer ${this.getToken}`
        }
      }).then(response => {
        console.log(response.data)


        this.startAnonymizationAlert()

        this.anonymization()

      }).catch(err => {
        console.log(err)
      })
    },
    anonymization() {
      if (!this.getToken) return
      const data = {
        'id_db': this.selectedDatabaseId,
        'table': this.tableSelect
      }
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
    }
  },
  data() {
    const $q = useQuasar()

    function startAnonymizationAlert() {
      $q.dialog({
        title: 'Alert',
        message: 'Anonymization started, you will be notificated when it ends.'
      })
    }

    const columnsDatabase = [
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

    let columnsCounter = 0
    const slicedRows = []
    const anonymizationTechniquesSelect = ref([])

    //defining one independent select for each row
    let rows = slicedRows.slice(0).map(r => ({ ...r }))
    rows.forEach((row, index) => {
      row.index = index
    })
    rows.forEach(() => {
      anonymizationTechniquesSelect.value.push('');
    })

    return {
      anonymizationTechniquesList: [],
      tableList: [],

      tableSelect: ref(null),
      tableSelect: '',
      anonymizationTechniquesSelect,

      columnsDatabase,

      slicedRows,
      rows,
      slicedColumns: [],
      columnsList: [],

      startAnonymizationAlert,
      startAnonymizationDialog: ref(false),

      selectedDatabaseId: '',
      columnsCounter
    }
  },
  created() {
    this.selectedDatabaseId = this.$route.params.data
    this.getTableList()
  }
})
</script>
