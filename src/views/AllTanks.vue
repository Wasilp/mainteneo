<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 page-title>
              <span class="content-title">{{ $t('views.tanks.listing.title') }}</span>
            </v-flex>
            <v-flex xs12>
              <tanks-table></tanks-table>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
import TanksTable from "@/components/tables/TanksTable";
const fb = require("../firebaseConfig.js");
export default {
  name: "all-tanks",
  components: {
    "tanks-table": TanksTable
  },
  data() {
    return {};
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    displayNotification() {
      this.$snotify.simple({
        body: "My Notification Body",
        title: "Notification Title",
        config: {}
      });
    }
  },
  computed: {
    ...mapState(["userProfile", "tanks"])
  }
};
</script>
<style>
</style>