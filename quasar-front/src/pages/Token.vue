<template>
  <!-- <q-dialog v-model="passwordDialog" persistent>
    <q-card>
      <q-card-section class="row flex-center">
        <div class="text-h6">Insert Password</div>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="submitAddDatabase">
          <q-input label="Password" :type="isPwd ? 'password' : 'text'" v-model="database.password" :rules="[
            val => !!val || 'Password is empty'
          ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <q-item>
            <q-btn :disabled="!isComplete()" class="full-width" color="primary" label="Submit"
              @click="submitTestConnection" rounded>
            </q-btn>
          </q-item>
        </q-form>
      </q-card-section>

    </q-card>
  </q-dialog> -->
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el icon="home" to="/" />
      <q-breadcrumbs-el label="Access Token" icon="key" to="/token" />
    </q-breadcrumbs>
  </div>
  <div class="row justify-between">
    <div class="q-pl-md text-h6">Access Token</div>
    <!-- <div class="q-pr-md">
      <q-btn color="primary" icon="autorenew" @click="recarregar = true" />
    </div> -->
  </div>
  <q-card class="my-card q-ma-md" style="height: 300px">
    <q-card-section>
      <div class="text-h10 text-weight-light">{{this.getToken}}</div>
    </q-card-section>
  </q-card>
  <div class="row justify-between">
    <div class="q-pl-md">
      <small class="text-caption text-weight-thin">This Token is valid for 1 hour</small>
    </div>
    <!-- <div class="q-pr-md">
      <q-btn color="primary" label="Copy token" @click="recarregar = true" />
    </div> -->
  </div>
</template>
<!-- recarregar: ref(false),
      passwordDialog: ref(true) -->
<script>
import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'
import { api } from 'src/boot/axios'



export default defineComponent({
  name: 'Token',
  computed: {
    ...mapGetters('auth', ['getToken'])
  },
  data() {
    return {
      recarregar: ref(false),
      passwordDialog: ref(true)
    }
  }
})
</script>
