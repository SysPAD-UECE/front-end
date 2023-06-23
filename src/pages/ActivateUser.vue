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
                User Activation
              </h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-mx-lg text-body1 text-center">
            Check your e-mail for a link to activate your account. Don't forget to
            check your spam folder.
          </div>
          <!-- <q-form class="q-gutter-md">
            <div>
              <q-btn
                class="q-my-lg full-width"
                color="primary"
                label="Resend email"
                rounded
                :disabled="pausedFor30Seconds"
                @click=""
              ></q-btn>
            </div>
          </q-form> -->
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { Loading, Notify } from "quasar";
import { defineComponent, ref } from "vue";
import { mapActions, mapGetters } from "vuex";
import { api } from 'src/boot/axios'


export default defineComponent({
  name: "Login",
  data() {
    return {
      pausedFor30Seconds: false,
      emailSent: false,
      email: ref(null),
    };
  },
  computed: {
    ...mapGetters("auth", ["getToken"]),
  },
  methods: {
    pauseButton(){
      this.pausedFor30Seconds = true;
      setTimeout(() => (this.pausedFor30Seconds = false), 30000);
    },
    activateUser() {
      Loading.show()
      const token = this.$route.query.token
      console.log(token)
      api
        .post(`/user/activate_user/${token}`)
        .then((response) => {
          Loading.hide()
          this.$router.push({ name: 'login' })
          Notify.create({
            type: "positive",
            message: "Your account has been successfully activated",
            timeout: 1000
          });
        })
        .catch(function (err) {
          Loading.hide()
          const status = err.response.status
           if (status === 401) {
          Notify.create({
            type: "negative",
            message: "Your activation token expired! We have sent a new activation email to you. Please check your inbox.",
            timeout: 5000,
            actions: [
            { label: 'OK', color: 'yellow', handler: () => { /* ... */ } }
          ]
          });
          // this.resendEmail()
        } else if (status === 409) {
          Notify.create({
            type: "negative",
            message: "Your activation token is invalid! We have sent a new activation email to you. Please check your inbox.",
            timeout: 5000,
            actions: [
            { label: 'OK', color: 'yellow', handler: () => { /* ... */ } }
          ]
          });
          // this.resendEmail()
        } else {
          Notify.create({
            type: "negative",
            message: "Oops! Something went wrong. Please try again later.",
            timeout: 2000,
          });
        }
        });
    },
    // resendEmail() {
    //   Loading.show()
    //   this.pauseButton()
    //   api
    //     .post(`/user/resend_activation_email/${user_id}`)
    //     .then((response) => {
    //       Loading.hide()
    //       this.$router.push('login')
    //       Notify.create({
    //         type: "positive",
    //         message: "Your account has been successfully activated",
    //         timeout: 1000
    //       });
    //     })
    //     .catch(function (err) {
    //       Loading.hide()
    //       const status = err.response.status
    //       if (status === 400){
    //       Notify.create({
    //         type: "negative",
    //         message: "Oops! Something went wrong. Please try again later.",
    //         timeout: 2000,
    //       });
    //     }
    //     });
    // }
  },
  mounted () {
    this.pauseButton()
    this.activateUser()
  }
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
