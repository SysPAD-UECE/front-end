<template>
  <img src="~assets/blue-wave.svg" class="wave" alt="login-wave" />
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-6 flex justify-center content-center"></div>
    <div class="col-12 col-md-6 flex content-center">
      <q-card style="width: 80%">
        <q-card-section>
          <q-avatar size="150px" class="absolute-center" icon="face"></q-avatar>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <h2 class="text-h3 text-uppercase q-my-none text-weight-regular">
                Forgot Password
              </h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="!this.emailSent">
          <q-form class="q-gutter-md" @submit.prevent="postForgotPassword">
            <q-input
              label="Insert your e-mail"
              v-model="email"
              :rules="[(val) => !!val || 'Email is empty']"
            >
            </q-input>
            <div>
              <q-btn
                class="full-width"
                color="primary"
                label="Send password reset e-mail"
                rounded
                type="submit"
              ></q-btn>
            </div>
          </q-form>
        </q-card-section>

        <q-card-section v-if="this.emailSent">
          <div class="q-mx-lg text-body1 text-center">
            Check your e-mail for a link to reset your password. Don't forget to
            check your spam folder.
          </div>
          <q-form class="q-gutter-md">
            <q-input label="E-mail" v-model="email" disable> </q-input>
            <div>
              <q-btn
                class="full-width"
                color="primary"
                label="Resend email"
                rounded
                :disabled="pausedFor30Seconds"
                @click="this.postForgotPassword()"
              ></q-btn>
              <q-btn
                class="full-width q-mt-md"
                color="primary"
                label="Change email"
                rounded
                @click="this.changeEmail()"
              ></q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { Loading, Notify } from "quasar";
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";
import { api } from 'src/boot/axios'


export default defineComponent({
  name: "forgot-password",
  data() {
    return {
      pausedFor30Seconds: true,
      emailSent: false,
      email: ref(null)
    }
  },
  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  methods: {
    postForgotPassword() {
      this.pausedFor30Seconds = true;
      setTimeout(() => (this.pausedFor30Seconds = false), 30000);

      const data = { email: this.email }

      Loading.show()

      api
        .post("/password/forgot", data)
        .then((response) => {
          Loading.hide()
          this.emailSent = true;
        })
        .catch(function (err) {
          Loading.hide()
          // this.$router.push({ name: 'login' })
          const status = err.response.status

          if (status === 404 || status === 409) {
          Notify.create({
            type: "negative",
            message: "This user is invalid. Try again later.",
            timeout: 2000
          });
          this.resendEmail()
        }
         else {
          Notify.create({
            type: "negative",
            message: "Oops! Something went wrong. Please try again later.",
            timeout: 2000,
          });
        }
        });
    },
    changeEmail() {
      this.emailSent = false;
      this.pausedFor30Seconds = true;
    },
  },
});
</script>

<style scoped>
.wave {
  position: fixed;
  height: 70%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
</style>
