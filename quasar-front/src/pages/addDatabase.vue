<template>
  <img src="~assets/wave.png" class="wave" alt="register-wave">
  <div class="q-pa-md">
    <q-card style='width: 100%' v-show='!this.$q.loading.isActive'>
      <q-card-section>
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <h2 class="text-h2 text-uppercase q-my-none text-weight-regular">Add Database</h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent="submitAddDatabase">
            <q-select filled v-model="database.id_db_type" :options="validdatabases" label="Database Type" stack-label
              :dense="true" :options-dense="true" option-label="name" option-value="" :rules="[
                val => !!val || 'Database type is empty'
              ]" />
            <q-input label="Name" v-model="database.name" :rules="[
              val => !!val || 'Name is empty'
            ]">
            </q-input>
            <q-input label="Host" v-model="database.host" :rules="[
              val => !!val || 'Host is empty'
            ]">
            </q-input>
            <q-input label="User" v-model="database.user" :rules="[
              val => !!val || 'User is empty'
            ]">
            </q-input>
            <q-input label="Port" v-model="database.port" :rules="[
              val => !!val || 'Port is empty'
            ]">
            </q-input>
            <q-input label="Password" :type="isPwd ? 'password' : 'text'" v-model="database.password" :rules="[
              val => !!val || 'Password is empty'
            ]">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <q-list>
              <q-item>
                <q-btn :disabled="!isComplete()" class="full-width" color="primary" label="Test Connection"
                  @click="submitTestConnection" rounded>
                </q-btn>
              </q-item>
              <q-item>
                <q-btn class="full-width" color="primary" label="ADD" type="submit" rounded></q-btn>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Notify, Loading } from 'quasar'
import { api } from 'src/boot/axios'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import { ref } from 'vue'

export default defineComponent({
  name: 'addDatabase',
  computed: {
    ...mapGetters('auth', ['getToken'])
  },
  data() {
    return {
      database: {
        id_db_type: ref(null),
        name: '',
        host: '',
        user: '',
        port: '',
        password: ''
      },
      isPwd: true,
      validdatabases: []
    }
  },
  methods: {
    isComplete() {
      console.log(this.database.id_db_type && this.database.name && this.database.host && this.database.user && this.database.port && this.database.password);
      return this.database.id_db_type && this.database.name && this.database.host && this.database.user && this.database.port && this.database.password;
    },
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
    submitTestConnection() {
      if (!this.getToken) return
      const data = {
        type: this.database.id_db_type.name,
        name: this.database.name,
        host: this.database.host,
        user: this.database.user,
        port: this.database.port,
        password: this.database.password
      }
      api.post('http://localhost:5000/test_connection', data, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken}` } }).then((res) => {
        Notify.create({
          type: 'positive',
          message: res.data.message,
          timeout: 1000
        })
      }).catch((err) => {
        console.log(err)
        Notify.create({
          type: 'negative',
          message: err.response.data.error,
          timeout: 1000
        })
      })
    },
    submitAddDatabase() {
      if (!this.getToken) return
      const data = {
        id_db_type: this.database.id_db_type.id,
        name: this.database.name,
        host: this.database.host,
        user: this.database.user,
        port: this.database.port,
        password: this.database.password
      }
      api.post('http://localhost:5000/addDatabase', data, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken}` } }).then((res) => {
        Notify.create({
          type: 'positive',
          message: res.data.message,
          timeout: 1000
        })
        this.$router.push('/client/databases')
      }).catch((err) => {
        console.log(err)
        Notify.create({
          type: 'negative',
          message: err.response.data.error,
          timeout: 1000
        })
      })
    }
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
