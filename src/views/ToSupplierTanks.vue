<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-container>
          <v-layout row wrap>
            <v-flex xs10 page-title>
              <span class="content-title">{{ $t('views.tanks.toReturn.title') }}</span>
            </v-flex>
            <v-flex xs2 text-xs-right>
              <div class="datatable-topbar-button">
                <v-btn fab dark color="secondary" @click="releaseTanksToSupplier()">
                  <v-icon dark>unarchive</v-icon>
                </v-btn>
              </div>
            </v-flex>

            <v-flex xs12>
              <tanks-table-selector
                :query="[['status', '==', 5]]"
                v-on:select-tanks="populateTanksToRelease"
              ></tanks-table-selector>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
import TankTableSelector from "@/components/tables/TanksTableSelector";
const fb = require("../firebaseConfig.js");
export default {
  name: "to-supplier-tanks",
  components: {
    "tanks-table-selector": TankTableSelector
  },
  data() {
    return {
      tanksToRelease: []
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    populateTanksToRelease(tanksArray) {
      this.tanksToRelease = tanksArray;
    },
    releaseTanksToSupplier() {
      console.log("releaseTanksToSupplier");
      this.$store
        .dispatch("releaseTanks", this.tanksToRelease)
        .then(() => {
          this.$snotify.success(
            this.$t("views.tanks.toReturn.tanksReturned"),
            this.$t("global.success"),
            {
              timeout: 3500,
              showProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true
            }
          );
        })
        .catch(error => {
          this.$snotify.error(error, this.$t("global.error"), {
            timeout: 4500,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
        });
    }
  }
};
</script>
<style>
</style>