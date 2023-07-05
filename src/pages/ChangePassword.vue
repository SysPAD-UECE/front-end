<template>
  <img src="~assets/blue-wave.svg" class="wave" alt="login-wave" />
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-6 flex justify-center content-center">
      <!-- <img src="~assets/login.svg" class="responsive" alt="login-image"> -->
    </div>
    <div class="col-12 col-md-6 flex content-center">
      <q-card style="width: 80%">
        <q-card-section>
          <q-avatar size="150px" class="absolute-center" icon="face">
          </q-avatar>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <h2 class="text-h3 text-uppercase q-my-none text-weight-regular">
                Change Password
              </h2>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent="submitNewPassword">
            <q-input
              label="New Password"
              :type="isPwd ? 'password' : 'text'"
              v-model="password.newPassword"
              :rules="[(val) => !!val || 'Password is empty']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-input
              label="Repeat New Password"
              :type="isPwdRepeat ? 'password' : 'text'"
              v-model="password.newPasswordRepeat"
              :rules="[
                (val) => !!val || 'Password is empty',
                (val) =>
                  val === password.newPassword || 'Passwords do not match',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwdRepeat ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdRepeat = !isPwdRepeat"
                />
              </template>
            </q-input>
            <div>
              <q-btn
                class="full-width"
                color="primary"
                label="Send New Password"
                type="submit"
                rounded
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
import { mapActions, mapGetters } from "vuex";
import { api } from 'src/boot/axios'

export default defineComponent({
  name: "ChangePassword",
  data() {
    return {
      password: {
        newPassword: "",
        newPasswordRepeat: "",
      },
      isPwd: true,
      isPwdRepeat: true
    };
  },
  computed: {
    ...mapGetters("auth", ["getMe"]),
    ...mapGetters("auth", ["isAuthenticated"]),
  },
  methods: {
    submitNewPassword() {
      Loading.show();
      const token = this.$route.query.token;
      const data = {
        new_password: this.password.newPassword,
        repeat_new_password: this.password.newPasswordRepeat,
      };
      api
        .patch(`/password/redefine/${token}`, data)
        .then((response) => {
          Loading.hide();
          this.$router.push({ name: "login" });
          Notify.create({
            type: "positive",
            message: "Your password has been successfully changed",
            timeout: 2000
          });
        })
        .catch(function (err) {
          Loading.hide()
          const status = err.response.status
          this.$router.push({ name: 'login' })
          if (status === 404) {
          Notify.create({
            type: "negative",
            message: "This user is invalid. Try again later.",
            timeout: 2000
          });
          this.$router.push({ name: "login" });
          this.resendEmail()
        } else {
          Notify.create({
            type: "negative",
            message: "Oops! Something went wrong. Please try again later.",
            timeout: 2000,
          });
        }
        });
    }
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
