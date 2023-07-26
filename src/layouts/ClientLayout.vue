<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <div id="app">
        <auto-logout>
          <div v-if="warningZone">Are you still here?</div>
        </auto-logout>
      </div>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          SysPAD
        </q-toolbar-title>

        <q-btn flat dense round icon="home" aria-label="HomePage" to="/client/home">
          <q-tooltip>Home</q-tooltip>
        </q-btn>
        <q-btn flat dense round icon="account_circle" aria-label="Account" v-if="!isAuthenticated" to="/login">
          <q-tooltip>Account</q-tooltip>
        </q-btn>
        <q-btn flat dense round icon="admin_panel_settings" aria-label="Admin" v-if="isAuthenticated && getMe.is_admin"
          to="/admin">
          <q-tooltip>Admin</q-tooltip>
        </q-btn>
        <!-- <q-btn flat dense round color="white" stack icon="manage_accounts" aria-label="Account" v-if="isAuthenticated">
          {{ getMe.name }}
          <q-tooltip>Account</q-tooltip>
        </q-btn> -->

        <q-btn flat dense round icon="logout" aria-label="Log out" v-if="isAuthenticated" @click="logout">
          <q-tooltip>Logout</q-tooltip>
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header>
          Options
        </q-item-label>

        <!-- <q-item clickable v-ripple to="/client/home" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="home" />
          </q-item-section>
          <q-item-section>
            Home
          </q-item-section>
        </q-item> -->

        <q-item clickable v-ripple to="/client/databases" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="table_view" />
          </q-item-section>
          <q-item-section>
            Databases
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/client/anonymization/databases" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="hotel_class" />
          </q-item-section>
          <q-item-section>
            Anonymization
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <q-list>
        <q-item-label header>
          Conta
        </q-item-label>
        <q-item clickable v-ripple to="/login" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="login" />
          </q-item-section>
          <q-item-section>
            Logar
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/register" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-avatar icon="person_add" />
          </q-item-section>
          <q-item-section>
            Registrar
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'MainLayout',

  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('auth', ['getMe'])
  },
  data: function () {
    return {
      events: ['click', 'mousemove', 'mousedown', 'scroll', 'keypress', 'load'],

      warningTimer: null,
      logoutTimer: null,
      warningZone: false,
    }
  },
  mounted() {
    this.events.forEach(function (event) {
      window.addEventListener(event, this.resetTimer);
    }, this);
    this.setTimers();
  },
  destroyed() {
    this.events.forEach(function (event) {
      window.removeEventListener(event, this.resetTimer);
    }, this); d
    this.resetTimer();
  },

  methods: {
    logout() {
      this.$store.dispatch('auth/signOut')
      this.$router.push('/login')
    },
    setTimers: function () {
      this.warningTimer = setTimeout(this.warningMessage, 28800 * 1000);
      this.logoutTimer = setTimeout(this.logoutUser, 28880 * 1000);

      this.warningZone = false;

    },

    warningMessage: function () {

      this.warningZone = true;


    },
    logoutUser: function () {
      this.$store.dispatch('auth/signOut')
      this.$router.push('/login')

    },
    resetTimer: function () {
      clearTimeout(this.warningTimer);
      clearTimeout(this.logoutTimer);


      this.setTimers();
    }


  },
  setup() {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const $q = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value
      },
      showNotif() {
        $q.notify({
          message: 'Jim pinged you.',
          caption: '5 minutes ago',
          color: 'secondary'
        })
      }

    }
  }
})

</script>
