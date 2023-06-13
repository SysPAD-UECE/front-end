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
              <h2 class="text-h3 text-uppercase q-my-none text-weight-regular">Forgot Password</h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent="submitForgotPassword">

            <q-input label="Insert your e-mail" v-model="email" :rules="[
              val => !!val || 'Email is empty'
            ]">
            </q-input>
            <div>
              <q-btn class="full-width" color="primary" label="Send password reset e-mail" type="submit" rounded></q-btn>

            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'
import useAuthUser from 'src/composables/UseAuthUser'
import { defineComponent } from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default defineComponent({
  name: 'Login',
  data() {
    return {
      login: {
        email: 'convidado@example.com',
        password: 'convidado123'
      },
      isPwd: true
    }
  },
  computed: {
    ...mapGetters('auth', ['getMe']),
    ...mapGetters('auth', ['isAuthenticated']),


  },
  methods: {

    async submitForgotPassowrd() {
      try {
        this.$router.push()
        Notify.create({
          type: 'positive',
          message: "Check your email",
          timeout: 1000
        })
      } catch (err) {
        console.log(err)
        Notify.create({
          type: 'negative',
          message: 'Try again later',
          timeout: 1000
        })
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
