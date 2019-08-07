<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 page-title>
              <span class="content-title">{{ $t('views.employees.listing.title') }}</span>
            </v-flex>
            <v-flex xs12>
              <employees-table></employees-table>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
import EmployeesTable from "@/components/tables/EmployeesTable";
const fb = require("../firebaseConfig.js");
export default {
  name: "employees",
  components: {
    "employees-table": EmployeesTable
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