<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-container>
          <v-layout row wrap>
            <v-flex xs10 page-title>
              <span class="content-title">{{ $t('views.customers.listing.title') }}</span>
            </v-flex>
            <v-flex xs2 text-xs-right>
              <div class="datatable-topbar-button">
                <v-btn fab dark color="secondary" @click="navigateTo('/addCustomer')">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </div>
            </v-flex>
            <v-flex xs12>
              <customers-table></customers-table>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
import CustomersTable from "@/components/tables/CustomersTable";
const fb = require("../firebaseConfig.js");
export default {
  name: "customers",
  components: {
    "customers-table": CustomersTable
  },
  data() {
    return {};
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    }
  },
  computed: mapState(["userProfile"])
};
</script>
<style>
</style>