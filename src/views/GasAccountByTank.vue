<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 page-title>
              <span class="content-title">{{ $t('views.gasAccounting.gasAccountingByTank.title') }}</span>
            </v-flex>
            <v-flex xs12>
              <tank-events-table :query="[['actionType', '==', 2]]"></tank-events-table>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
import TankEventsTable from "@/components/tables/TankEventsTable";
const fb = require("../firebaseConfig.js");
export default {
  name: "gas-account-by-tank",
  components: {
    "tank-events-table": TankEventsTable
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