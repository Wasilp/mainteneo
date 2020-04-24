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
                    :value="tank.load/tank.capacity*100"
                    color="accent"
                  >{{ Math.round((tank.load/tank.capacity) *100) }} %</v-progress-circular>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex lg6>
              <v-layout row wrap>
                <v-flex sm6>
                  <label>{{ $t('views.tank.type') }}:</label>
                  <span v-if="tank.type==1">{{ $t('dropdownMenus.tankType.fluid') }}</span>
                  <span v-else-if="tank.type==2">{{ $t('dropdownMenus.tankType.transfer') }}</span>
                  <span v-else-if="tank.type==3">{{ $t('dropdownMenus.tankType.recovery') }}</span>
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.capacity') }}:</label>
                  {{ tank.capacity }}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.quantity') }}:</label>
                  {{ tank.load }}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.gas') }}:</label>
                  {{ tank.gas }}
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
                  {{tank.gasProviderCompanyName}}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.lastUpdate') }}:</label>
                  {{tank.lastUpdated.toDate() | formatDate}}
                </v-flex>
                <v-flex sm6></v-flex>
                <v-flex sm6></v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.tank.lastUpdateBy') }}:</label>
                  <a @click="navigateTo('/employee/'+tank.lastUpdatedByUserId)">{{tank.lastUpdatedByUserName}}</a>
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


            <v-tab-item id="tab-1" key="1">
              <interventions-table
                :query="[['groupBy','interventionNumber'], ['tankId', '==', this.$route.params.id]]">
                </interventions-table>
            </v-tab-item>
            <v-tab-item id="tab-2" key="2">
              <tank-events-table :query="[['allTanksLiveId', '==', tank.allTanksLiveId]]"></tank-events-table>
            </v-tab-item>

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
      color: Material,
      tankHistory:{}
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

        console.log(this.tank)
      } else {
        navigateTo("404");
      }
  },

    tankDataHistory(response, error) {
        // const payload = {};
        //
        // alert('kikou')
        // if (this.$route.params.id) {
        //   payload.tankId = this.$route.params.id;
        // }
        //
        // this.$store.dispatch("fetchTankEvents", payload).then(function(response){
        //     console.log(response,'history')
        //
        //     alert('kikou')
        // });
  }
  },
  created: function() {
    const payload = {};
    if (this.$route.params.id) {
      payload.tankId = this.$route.params.id;
    }
    this.$store.dispatch("fetchTank", payload).then(this.tankDataCallback,this.tankDataHistory);
  }
};
</script>
<style>
</style>
