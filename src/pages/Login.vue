<template>
  <img src="~assets/blue-wave.svg" class="wave" alt="login-wave">
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-6 flex justify-center content-center">
    </div>
    <div class="col-12 col-md-6 flex content-center">
      <q-card style='width: 80%'>
        <q-card-section>
          <q-avatar size="150px" class="absolute-center" icon="face">
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <h2 class="text-h2 text-uppercase q-my-none text-weight-regular">Login</h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent="submitLogin">
            <q-input label="Email" v-model="login.email" :rules="[
                val => !!val || 'Email is empty'
              ]">
            </q-input>
            <q-input label="Senha" :type="isPwd ? 'password' : 'text'" v-model="login.password" :rules="[
                val => !!val || 'Password is empty'
              ]">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <div>
              <q-btn class="full-width" color="primary" label="Login" type="submit" rounded></q-btn>
              <div class="text-center q-mt-sm q-gutter-lg">
                <router-link class="text-white" to="/forgot">Forgot password?</router-link>
                <router-link class="text-white" to="/register">Create an account</router-link>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { Notify, Loading } from 'quasar'
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
  name: 'Login',
  data() {
    return {
      login: {
        email: 'convidado@example.com',
        password: 'Convidado@123'
      },
      isPwd: true
    }
  },
  computed: {
    ...mapGetters('auth', ['getMe']),
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('auth', ['apiData']),

  },
  methods: {
    ...mapActions('auth', ['doLogin']),
    async submitLogin() {
      Loading.show()
      try {
        await this.doLogin(this.login)
        Loading.hide()
        const toPath = this.$route.query.to || '/client'
        this.$router.push(toPath)
      } catch (err) {
        console.log(err.response.data.message)
        Loading.hide()
        const status = err.response.status
        if (status === 404) {
          Notify.create({
            type: "negative",
            message: this.$t(err.response.data.message),
            timeout: 2000
          });
        } else if (status === 401) {
          Notify.create({
            type: "negative",
            message: "Wrong e-mail or password.",
            timeout: 2000
          });
        } else {
          Notify.create({
            type: "negative",
            message: "Oops! Something went wrong. Please try again later.",
            timeout: 2000,
          });
        }
      }
    }
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
