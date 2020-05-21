<template>
  <div>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" :color="bannerColor" dark app fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-0">
        <router-link to="/dashboard">
          <a>
            <img
              src="@/assets/images/logo-large-white.png"
              height="36px;"
              style="margin-top: 10px;"
            />
          </a>
        </router-link>
      </v-toolbar-title>
      <v-toolbar-side-icon @click.stop="switchNavigationDrawer"></v-toolbar-side-icon>
      <!-- <v-text-field flat solo-inverted hide-details prepend-inner-icon="search" label="Search" class="hidden-sm-and-down"></v-text-field> -->
      <v-spacer></v-spacer>
      <!-- Notifications dropdown
    <v-menu offset-y origin="center center" class="elelvation-1" :nudge-bottom="14" transition="scale-transition">
        <v-btn icon flat slot="activator">
        <v-badge color="red" overlap>
          <span slot="badge">4</span>
          <v-icon medium>notifications</v-icon>
        </v-badge>
      </v-btn>
      <notification-list></notification-list>
    </v-menu>
      END Notifications dropdown-->
      <!-- Right Menu -->
      <v-menu bottom left>
        <v-btn slot="activator" dark icon>
          <v-icon>more_vert</v-icon>
        </v-btn>

        <v-list>
          <v-list-tile @click="openAboutUs">
            <v-list-tile-title>{{ $t('topToolbar.actions.about') }}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="logout">
            <v-list-tile-title>{{ $t('topToolbar.actions.logout') }}</v-list-tile-title>
          </v-list-tile>
          <!-- <v-list-tile @click="setLocale('fr')">
          <v-list-tile-title>FR</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="setLocale('nl')">
          <v-list-tile-title>NL</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="setLocale('en')">
          <v-list-tile-title>EN</v-list-tile-title>
          </v-list-tile>-->
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-dialog light width="500" v-model="aboutUsDialog">
      <v-card>
        <v-card-actions class="justify-center">
          <v-container grid-list-xl class="mt-3 mb-1">
            <v-layout column>
              <v-flex text-xs-center>
                <img src="@/assets/images/logo_invert.svg" height="46" />
              </v-flex>
              <v-flex text-xs-center class="mb-2">
                <span class="subheading tagline">The App for HVACR Professionnals</span>
              </v-flex>
              <v-flex text-xs-center>
                <span>&copy; 2018-2019 - Mainteneo SPRL</span>
              </v-flex>
              <v-flex text-xs-center>
                <span>
                  Contact:
                  <a
                    href="mailto:support@mainteneo.com"
                    class="contact"
                  >support@mainteneo.com</a>
                </span>
              </v-flex>
              <v-flex text-xs-center>
                <span>Mainteneo Cockpit Version 1.1.4</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-actions>
        <v-divider></v-divider>
        <v-card-actions class="justify-center">
          <div>
            <v-btn @click="aboutUsDialog = false" round dark color="secondary">{{ $t('global.ok') }}</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
const fb = require("../../firebaseConfig.js");
import NotificationList from "@/components/widgets/list/NotificationList";
export default {
  name: "top-toolbar",
  components: {
    NotificationList
  },
  data() {
    return {
      aboutUsDialog: false,
      bannerColor:'#5071b6'
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    openAboutUs() {
      this.aboutUsDialog = true;
    },
    switchNavigationDrawer() {
      const currentDrawer = this.$store.getters.drawer;
      this.$store.commit("SET_DRAWER", !currentDrawer);
    },
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          localStorage.removeItem("mainteneo-userProfile");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    },
    setLocale(l) {
      this.$i18n.locale = l;
    }
},

mounted: function(){
    if (webpackHotUpdate) {
         console.log('In Dev Mode');
         this.bannerColor = 'red'
    }

}
};
</script>
<style scoped>
.tagline {
  color: #5071b6;
  font-weight: 500;
}

a.contact:link {
  color: #000000;
  text-decoration: underline;
  font-weight: normal;
}
a.contact:visited {
  color: #000000;
  text-decoration: underline;
  font-weight: normal;
}
a.contact:hover {
  color: #000000;
  text-decoration: underline;
  font-weight: normal;
}
a.contact:active {
  color: #000000;
  text-decoration: underline;
  font-weight: normal;
}
</style>
