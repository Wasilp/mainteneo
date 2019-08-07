<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-flex sm12 class="page-title">
          <span class="content-small-title">{{ $t('views.installation.title') }}</span>
        </v-flex>
        <v-card class="block-element">
          <v-layout row wrap>
            <v-flex sm12>
              <v-layout row wrap>
                <v-flex sm1>
                  <span>
                    <v-icon class="page-icon">ac_unit</v-icon>
                  </span>
                </v-flex>
                <v-flex sm5 class="mb-5 display-3 font-weight-thin">
                  <span style="word-wrap:break-word;">{{ installation.currentQr }}</span>
                </v-flex>
                <v-flex sm6 class="mb-5">
                  <v-layout column wrap>
                    <v-flex sm12 class="mb-1">
                      <span class="card-sub-header-title">Type:&nbsp;</span>
                      <span class="card-sub-header">{{ engineType }}</span>
                    </v-flex>
                    <v-flex sm12>
                      <span class="card-sub-header-title">Client:&nbsp;</span>
                      <span class="card-sub-header">
                        <a
                          @click="navigateTo('/customer/' + installation.customerCompanyId)"
                        >{{installation.customerCompanyName}}</a>
                      </span>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex sm12>
                  <v-layout row wrap>
                    <v-flex sm1>
                      <v-spacer></v-spacer>
                    </v-flex>
                    <v-flex sm11>
                      <v-layout row wrap>
                        <v-flex sm4 class="mb-2 top-table-text">
                          <label>Localisation:</label>
                          {{installation.location}}
                        </v-flex>

                        <v-flex
                          sm4
                          class="mb-2 top-table-text"
                          v-if="installation.type === 'clim'"
                          key="no-di"
                        >
                          <label>Date de l'installation:</label>
                          {{ installation.engineDate | formatDateDaysOnly }}
                        </v-flex>

                        <v-flex v-else sm4 class="mb-2 top-table-text">
                          <v-spacer></v-spacer>
                        </v-flex>

                        <v-flex sm4 class="mb-2 top-table-text">
                          <v-spacer></v-spacer>
                        </v-flex>

                        <v-flex sm4 class="mb-3 top-table-text">
                          <label>{{ $t('views.installation.brand') }}:</label>
                          {{installation.brand}}
                        </v-flex>
                        <v-flex sm4 class="mb-3 top-table-text">
                          <label>{{ $t('views.installation.model') }}:</label>
                          {{ installation.model }}
                        </v-flex>

                        <v-flex sm4 class="mb-3 top-table-text">
                          <label>{{ $t('views.installation.sn') }}:</label>
                          {{installation.sN}}
                        </v-flex>

                        <v-flex sm12 class="mb-3">
                          <v-divider></v-divider>
                        </v-flex>

                        <v-flex sm4 v-bind:class="classObject">
                          <label>{{ $t('views.installation.refrigerant') }}:</label>
                          {{installation.refrigerant}}
                        </v-flex>
                        <v-flex sm4 class="mb-2 top-table-text">
                          <label>{{ $t('views.installation.capacity') }}:</label>
                          {{ installation.capacity }} kg
                        </v-flex>
                        <v-flex sm4 class="mb-2 top-table-text">
                          <label>{{ $t('views.installation.power') }}:</label>
                          {{ installation.power }} kW
                        </v-flex>

                        <v-flex sm4 class="mb-2 top-table-text" v-if="installation.type === 'clim'">
                          <label>Charge:</label>
                          {{ load }}
                        </v-flex>

                        <v-flex sm4 class="mb-2 top-table-text" v-if="installation.type === 'clim'">
                          <label>Charge additionnelle:</label>
                          {{ additionalLoad }}
                        </v-flex>

                        <v-flex sm4 class="mb-2 top-table-text" v-if="installation.type === 'clim'">
                          <v-spacer></v-spacer>
                        </v-flex>

                        <v-flex sm4 class="mb-3 top-table-text" v-if="installation.type === 'clim'">
                          <label>Fonctionnement:</label>
                          {{ operation }}
                        </v-flex>

                        <v-flex sm4 class="mb-3 top-table-text" v-if="installation.type === 'clim'">
                          <label>Type d’Unité Extérieure:</label>
                          {{ externalUnit }}
                        </v-flex>

                        <v-flex sm4 class="mb-3 top-table-text" v-if="installation.type === 'clim'">
                          <label>Tension:</label>
                          {{ tension }}
                        </v-flex>

                        <v-flex sm12 class="mb-3">
                          <v-divider></v-divider>
                        </v-flex>

                        <v-flex sm4 class="mb-4 top-table-text">
                          <label>{{ $t('views.installation.lastVisit') }}:</label>
                          {{ installationLastUpdate | formatDate }}
                        </v-flex>
                        <v-flex sm4 class="mb-4 top-table-text">
                          <label>{{ $t('views.installation.lastVisitBy') }}:&nbsp;</label>
                          <a
                            @click="navigateTo('/employee/' + installation.lastUpdateById)"
                          >{{ installation.lastUpdateByName }}</a>
                        </v-flex>
                        <v-flex sm4 class="mb-4 top-table-text">
                          <v-spacer></v-spacer>
                        </v-flex>

                        <v-flex sm12 class="mb-4 top-table-text">
                          <label>{{ $t('views.installation.comment') }}:</label>
                          {{installation.comments}}
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
        <!-- <v-divider></v-divider> -->
        <v-flex lg12 class="block-element">
          <v-tabs fixed-tabs grow centered icons-and-text>
            <v-tab href="#tab-1">
              {{ $t('views.installation.interventions') }}
              <v-icon class="tab-icon">library_books</v-icon>
            </v-tab>
            <v-tab href="#tab-2" v-if="installation.type === 'clim'">
              {{ $t('views.installation.internalUnits') }}
              <v-icon class="tab-icon">ballot</v-icon>
            </v-tab>
            <v-tab-item id="tab-1" key="1">
              <interventions-table
                :query="[['groupBy','interventionNbr'], ['installId', '==', this.$route.params.id]]"
              ></interventions-table>
            </v-tab-item>
            <v-tab-item id="tab-2" key="2" v-if="installation.type === 'clim'">
              <intervention-internal-units-table :internalUnits="installation.internalUnitLines"></intervention-internal-units-table>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import InterventionsTable from "@/components/tables/InterventionsTable";
import InstallationInternalUnitsTable from "@/components/tables/InstallationInternalUnitsTable";

export default {
  name: "installation",
  components: {
    "interventions-table": InterventionsTable,
    "intervention-internal-units-table": InstallationInternalUnitsTable
  },
  data() {
    return {
      installation: {},
      externalUnits: [],
      tensions: [],
      engineOperations: [],
      engineTypes: []
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    installationDataCallback(response, error) {
      if (error) {
        //TODO
        console.log("Error: " + error);
      } else {
        this.installation = response;
      }
    }
  },
  computed: {
    installationLastUpdate: function() {
      if (this.installation.lastUpdate) {
        return this.installation.lastUpdate.toDate();
      } else {
        return "-";
      }
    },
    engineType: function() {
      if (this.installation.type) {
        const filteredArray = this.engineTypes.filter(obj => {
          return obj.key == this.installation.type;
        });
        return filteredArray[0].value;
      } else {
        return "-";
      }
    },
    operation: function() {
      if (this.installation.operation) {
        const filteredArray = this.engineOperations.filter(obj => {
          return obj.key == this.installation.operation;
        });
        return filteredArray[0].value;
      } else {
        return "-";
      }
    },
    tension: function() {
      if (this.installation.tension) {
        const filteredArray = this.tensions.filter(obj => {
          return obj.key == this.installation.tension;
        });
        return filteredArray[0].value + "  V/ph/Hz";
      } else {
        return "-";
      }
    },
    externalUnit: function() {
      if (this.installation.externalUnit) {
        const filteredArray = this.externalUnits.filter(obj => {
          return obj.key == this.installation.externalUnit;
        });
        return filteredArray[0].value;
      } else {
        return "-";
      }
    },
    load: function() {
      if (this.installation.load) {
        return this.installation.load + " kg";
      } else {
        return "-";
      }
    },
    additionalLoad: function() {
      if (this.installation.additionalLoad) {
        return this.installation.additionalLoad + " kg";
      } else {
        return "-";
      }
    },
    classObject: function() {
      if (this.installation.type === "clim") {
        return "mb-2 top-table-text";
      } else {
        return "mb-3 top-table-text";
      }
    }
  },

  created: function() {
    const payload = {};
    if (this.$route.params.id) {
      payload.installationId = this.$route.params.id;
    }
    this.$store
      .dispatch("fetchInstallation", payload)
      .then(this.installationDataCallback);
  },

  mounted: function() {
    const engineTypes = this.$t("views.installation.engineTypes");
    for (let key in engineTypes) {
      if (engineTypes.hasOwnProperty(key)) {
        this.engineTypes.push({ key: key, value: engineTypes[key] });
      }
    }

    const engineOperations = this.$t("views.installation.engineOperations");
    for (let key in engineOperations) {
      if (engineOperations.hasOwnProperty(key)) {
        this.engineOperations.push({ key: key, value: engineOperations[key] });
      }
    }

    const externalUnits = this.$t("views.installation.externalUnits");
    for (let key in externalUnits) {
      if (externalUnits.hasOwnProperty(key)) {
        this.externalUnits.push({ key: key, value: externalUnits[key] });
      }
    }

    const tensions = this.$t("views.installation.tensions");
    for (let key in tensions) {
      if (tensions.hasOwnProperty(key)) {
        this.tensions.push({ key: key, value: tensions[key] });
      }
    }
  }
};
</script>
<style>
.top-table-text {
  font-family: Roboto, sans-serif;
  font-size: 15px;
}

label {
  color: rgba(0, 0, 0, 0.54);
}

.card-sub-header {
  color: rgba(0, 0, 0, 0.87);
  font-family: "Roboto", sans-serif;
  font-size: 21px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 32px;
  margin-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  overflow-wrap: break-word;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
  word-wrap: break-word;
}

.card-sub-header-title {
  color: rgba(0, 0, 0, 0.54);
  font-family: "Roboto", sans-serif;
  font-size: 21px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 32px;
  margin-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  overflow-wrap: break-word;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
  word-wrap: break-word;
}
</style>