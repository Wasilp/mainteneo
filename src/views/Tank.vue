<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-flex sm12 class="page-title">
          <h3>{{ $t('views.tank.title') }}</h3>
        </v-flex>
        <v-card class="block-element">
          <v-layout row wrap>
            <v-flex lg6>
              <v-layout row wrap>
                <v-flex lg2>
                  <span>
                    <v-icon class="page-icon">battery_full</v-icon>
                  </span>
                </v-flex>
                <v-flex lg6>
                  <h1 style="font-size:32px;word-wrap:break-word;">{{ tank.sN }}</h1>
                </v-flex>
                <v-flex lg3>
                  <v-progress-circular
                    :size="80"
                    :width="10"
                    :rotate="-90"
                    :value="tank.quantity/tank.capacity*100"
                    color="accent"
                  >{{ Math.round((tank.quantity/tank.capacity) *100) }} %</v-progress-circular>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex lg6>
              <v-layout row wrap>
                <v-flex sm6>
                  <label>{{ $t('views.tank.type') }}:</label>
                  <span v-if="tank.currentType==1">{{ $t('dropdownMenus.tankType.fluid') }}</span>
                  <span v-else-if="tank.currentType==2">{{ $t('dropdownMenus.tankType.transfer') }}</span>
                  <span v-else-if="tank.currentType==3">{{ $t('dropdownMenus.tankType.recovery') }}</span>
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.capacity') }}:</label>
                  {{ tank.capacity }}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.quantity') }}:</label>
                  {{ tank.quantity }}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.gas') }}:</label>
                  {{ tank.refrigerant }}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.status') }}:</label>
                  <v-chip
                    v-if="tank.status==1"
                    outline
                    color="green"
                  >{{ $t('dropdownMenus.tankStatus.available') }}</v-chip>
                  <v-chip
                    v-else-if="tank.status==2"
                    outline
                    color="orange"
                  >{{ $t('dropdownMenus.tankStatus.taken') }}</v-chip>
                  <v-chip
                    v-else-if="tank.status==3"
                    outline
                    color="black"
                  >{{ $t('dropdownMenus.tankStatus.onSite') }}</v-chip>
                  <v-chip
                    v-else-if="tank.status==4"
                    outline
                    color="gray"
                  >{{ $t('dropdownMenus.tankStatus.releasedToSupplier') }}</v-chip>
                  <v-chip
                    v-else-if="tank.status==5"
                    outline
                    color="red"
                  >{{ $t('dropdownMenus.tankStatus.toSupplier') }}</v-chip>
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.owner') }}:</label>
                  <a
                    :v-if="tank.taken"
                    @click="navigateTo('/employee/'+tank.takenById)"
                  >{{tank.takenByName}}</a>
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.supplier') }}:</label>
                  {{tank.providerCompName}}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.lastUpdate') }}:</label>
                  {{tank.lastUpdate.toDate() | formatDate}}
                </v-flex>
                <v-flex sm6></v-flex>
                <v-flex sm6></v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.lastUpdateBy') }}:</label>
                  <a @click="navigateTo('/employee/'+tank.lastUpdateById)">{{tank.lastUpdateByName}}</a>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
        <v-divider></v-divider>
        <v-flex lg12 class="block-element">
          <v-tabs fixed-tabs grow centered icons-and-text>
            <v-tab href="#tab-1">
              {{ $t('views.tank.interventions') }}
              <v-icon class="tab-icon">library_books</v-icon>
            </v-tab>
            <v-tab href="#tab-2">
              {{ $t('views.tank.events') }}
              <v-icon class="tab-icon">compare_arrows</v-icon>
            </v-tab>
            <!-- <v-tab href="#tab-3">Owers
              <v-icon class="tab-icon">directions_walk</v-icon>
            </v-tab>-->
            <!-- <v-tab href="#tab-4">Statistiques
              <v-icon class="tab-icon">dashboard</v-icon>
            </v-tab>-->
            <v-tab-item id="tab-1" key="1">
              <interventions-table
                :query="[['groupBy','interventionNbr'], ['fromTankId', '==', this.$route.params.id]]"
              ></interventions-table>
            </v-tab-item>
            <v-tab-item id="tab-2" key="2">
              <tank-events-table :query="[['tankId', '==', this.$route.params.id]]"></tank-events-table>
            </v-tab-item>
            <!-- <v-tab-item id="tab-3" key="3">
              <employees-table></employees-table>
            </v-tab-item>-->
            <!-- Statistic TAB 
            <v-tab-item id="tab-4" key="4">
              <v-layout row wrap>
                 mini statistic start 
                <v-flex lg3 sm6 xs12></v-flex>
                <v-flex lg3 sm6 xs12>
                  <v-card class="block-element">
                    <mini-statistic
                      icon="fa fa-arrow-down"
                      title="3,9"
                      sub-title="TeqCO²"
                      color="green"
                    ></mini-statistic>
                  </v-card>
                </v-flex>
                <v-flex lg3 sm6 xs12>
                  <v-card class="block-element">
                    <mini-statistic
                      icon="fa fa-arrow-up"
                      title="2,13"
                      sub-title="TeqCO²"
                      color="red"
                    ></mini-statistic>
                  </v-card>
                </v-flex>
                <v-flex lg3 sm6 xs12></v-flex>
                <v-flex lg3 sm6 xs12>
                  <v-card class="block-element">
                    <mini-statistic
                      icon="fa fa-fire"
                      title="200"
                      sub-title="BONBONNES SCANNEES"
                      color="light-blue"
                    ></mini-statistic>
                  </v-card>
                </v-flex>
                <v-flex lg3 sm6 xs12>
                  <v-card class="block-element">
                    <mini-statistic
                      icon="fa fa-file-text"
                      title="150"
                      sub-title="INTERVENTIONS"
                      color="purple"
                    ></mini-statistic>
                  </v-card>
                </v-flex>
                <v-flex lg3 sm6 xs12>
                  <v-card class="block-element">
                    <mini-statistic
                      icon="fa fa-plus"
                      title="10"
                      sub-title="MISES EN ROUTE"
                      color="light-green"
                    ></mini-statistic>
                  </v-card>
                </v-flex>
                <v-flex lg3 sm6 xs12>
                  <v-card class="block-element">
                    <mini-statistic
                      icon="fa fa-arrow-up"
                      title="60"
                      sub-title="DEPANNAGES"
                      color="grey"
                    ></mini-statistic>
                  </v-card>
                </v-flex>
                mini statistic  end 
              </v-layout>
            </v-tab-item>
            END statistic Tab-->
          </v-tabs>
        </v-flex>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import InerventionsTable from "@/components/tables/InterventionsTable";
import TankEventsTable from "@/components/tables/TankEventsTable";
import EmployeesTable from "@/components/tables/EmployeesTable";
/* From Vue Materiel Admin*/
import Material from "vuetify/es5/util/colors";
import MiniStatistic from "@/components/widgets/statistic/MiniStatistic";
import VWidget from "@/components/VWidget";
import VCircle from "@/components/circle/VCircle";
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
export default {
  name: "tank",
  components: {
    "interventions-table": InerventionsTable,
    "tank-events-table": TankEventsTable,
    "employees-table": EmployeesTable,
    MiniStatistic,
    VWidget,
    VCircle
  },
  data() {
    return {
      tank: {},
      color: Material
    };
  },
  computed: {
    ...mapState(["tanks"])
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    tankDataCallback(response, error) {
      if (error) {
        //TODO
        console.log("Error: " + error);
      } else if (response) {
        this.tank = response;
      } else {
        navigateTo("404");
      }
    }
  },
  created: function() {
    const payload = {};
    if (this.$route.params.id) {
      payload.tankId = this.$route.params.id;
    }
    this.$store.dispatch("fetchTank", payload).then(this.tankDataCallback);
  }
};
</script>
<style>
</style>