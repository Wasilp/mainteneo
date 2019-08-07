<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-flex sm12 class="page-title">
          <h3>{{ $t('views.employee.title') }}</h3>
        </v-flex>
        <v-card class="block-element">
          <v-layout row wrap>
            <v-flex lg6>
              <v-layout row wrap>
                <v-flex lg3>
                  <span>
                    <v-icon class="page-icon">directions_walk</v-icon>
                  </span>
                </v-flex>
                <v-flex lg9>
                  <h1 style="word-wrap:break-word;">{{ user.userName }}</h1>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex lg6>
              <v-layout row wrap>
                <v-flex sm6>
                  <label>{{ $t('views.employee.name') }}:</label>
                  {{ user.userName }}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.employee.phone') }}:</label>
                  {{ phoneNumber(user) }}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.employee.email') }}:</label>
                  {{user.email}}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.employee.language') }}:</label>
                  {{user.lng}}
                </v-flex>
                <!-- <v-flex sm6>
                                    <label>Timezone: </label>{{user.timezone}}
                </v-flex>-->
                <v-flex sm6>
                  <label>{{ $t('views.employee.role') }}:</label>
                  {{user.userType}}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
        <v-divider></v-divider>
        <v-flex lg12 class="block-element">
          <v-tabs fixed-tabs grow centered icons-and-text>
            <v-tab href="#tab-1">
              {{ $t('views.employee.interventions') }}
              <v-icon class="tab-icon">library_books</v-icon>
            </v-tab>
            <v-tab href="#tab-2">
              {{ $t('views.employee.inventory') }}
              <v-icon class="tab-icon">battery_full</v-icon>
            </v-tab>
            <v-tab href="#tab-3">
              {{ $t('views.employee.events') }}
              <v-icon class="tab-icon">compare_arrows</v-icon>
            </v-tab>
            <v-tab-item value="tab-1" key="1">
              <interventions-table
                :query="[['groupBy','interventionNbr'], ['actionById', '==', this.$route.params.id]]"
              ></interventions-table>
            </v-tab-item>
            <v-tab-item value="tab-2" key="2">
              <v-card>
                <tanks-table :query="[['takenById','==', this.$route.params.id]]"></tanks-table>
              </v-card>
            </v-tab-item>
            <v-tab-item value="tab-3" key="3">
              <v-card>
                <tank-events-table :query="[['actionById','==', this.$route.params.id]]"></tank-events-table>
              </v-card>
            </v-tab-item>
            <!-- Statistic 
                        <v-tab-item id="tab-3" key="3">
                            <v-layout row wrap>
                                mini statistic start
                                <v-flex lg3 sm6 xs12>
                                </v-flex>
                                <v-flex lg3 sm6 xs12>
                                    <v-card class="block-element">
                                        <mini-statistic
                                            icon="fa fa-arrow-down"
                                            title="3,9"
                                            sub-title="TeqCO²"
                                            color="green"    
    
                                        >
                                        </mini-statistic>  
                                    </v-card>
                                </v-flex>
                                <v-flex lg3 sm6 xs12>
                                    <v-card class="block-element">
                                        <mini-statistic
                                            icon="fa fa-arrow-up"                                            
                                            title="2,13"
                                            sub-title="TeqCO²"
                                            color="red"      
                                        >
                                        </mini-statistic>           
                                    </v-card>
                                </v-flex>   
                                <v-flex lg3 sm6 xs12>
                                </v-flex>       
                                <v-flex lg3 sm6 xs12>
                                    <v-card class="block-element">
                                        <mini-statistic
                                            icon="fa fa-fire"
                                            title="200"
                                            sub-title="BONBONNES SCANNEES"
                                            color="light-blue"      
                                        >
                                        </mini-statistic>  
                                    </v-card>          
                                </v-flex>        
                                <v-flex lg3 sm6 xs12>
                                    <v-card class="block-element">
                                        <mini-statistic
                                            icon="fa fa-file-text"
                                            title="150"
                                            sub-title="INTERVENTIONS"
                                            color="purple"      
                                        >
                                        </mini-statistic>         
                                    </v-card>    
                                </v-flex>   
                                <v-flex lg3 sm6 xs12>
                                    <v-card class="block-element">
                                        <mini-statistic
                                            icon="fa fa-plus"
                                            title="10"
                                            sub-title="MISES EN ROUTE"
                                            color="light-green"    
    
                                        >
                                        </mini-statistic>  
                                    </v-card>
                                </v-flex>
                                <v-flex lg3 sm6 xs12>
                                    <v-card class="block-element">
                                        <mini-statistic
                                            icon="fa fa-arrow-up"
                                            title="60"
                                            sub-title="DEPANNAGES"
                                            color="grey"      
                                        >
                                        </mini-statistic>           
                                    </v-card>
                                </v-flex>                                           
                                mini statistic  end 
                            </v-layout>
                            <v-spacer></v-spacer>
                        </v-tab-item>
            END Statistic-->
          </v-tabs>
        </v-flex>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import TanksTable from "@/components/tables/TanksTable";
import InterventionsTable from "@/components/tables/InterventionsTable";
import TankEventsTable from "@/components/tables/TankEventsTable";
/* From Vue Materiel Admin*/
import Material from "vuetify/es5/util/colors";
import MiniStatistic from "@/components/widgets/statistic/MiniStatistic";
import VWidget from "@/components/VWidget";
import VCircle from "@/components/circle/VCircle";
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
export default {
  name: "employee",
  components: {
    MiniStatistic,
    VWidget,
    VCircle,
    "tanks-table": TanksTable,
    "interventions-table": InterventionsTable,
    "tank-events-table": TankEventsTable
  },
  data() {
    return {
      user: {},
      color: Material
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    userDataCallback(response, error) {
      if (error) {
        //TODO
        console.log("Error: " + error);
      } else {
        this.user = response;
      }
    },
    phoneNumber: function(employee) {
      if (employee.phoneNbrs && employee.phoneNbrs.length > 0) {
        return employee.phoneNbrs[0];
      } else {
        return "";
      }
    }
  },
  computed: {},
  created: function() {
    const payload = {};
    if (this.$route.params.id) {
      payload.userId = this.$route.params.id;
    }
    this.$store.dispatch("fetchUser", payload).then(this.userDataCallback);
  }
};
</script>
<style>
</style>