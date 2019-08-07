<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 page-title>
              <span class="content-title">{{ $t('views.installations.listing.title') }}</span>
            </v-flex>
            <v-flex xs12>
              <installations-table></installations-table>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import InstallationsTable from "@/components/tables/InstallationsTable";
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
export default {
  name: "installations",
  components: {
    "installations-table": InstallationsTable
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