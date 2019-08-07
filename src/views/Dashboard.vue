<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div v-show="showSpinner" class="text-xs-center spinner-div">
        <v-progress-circular :size="70" :width="7" color="secondary" indeterminate></v-progress-circular>
      </div>
      <div v-show="showInitialMessage" class="text-xs-center spinner-div">
        <span class="headline" v-html="$t('views.dashboard.noTanks')"></span>
      </div>
      <v-container grid-list-xl fluid v-show="showDashboard">
        <v-layout row wrap>
          <!-- mini statistic start -->
          <!-- <v-flex lg3 sm6 xs12>
                    <mini-statistic
                        icon="fa fa-arrow-down"
                        title="5,3"
                        sub-title="TeqCO²"
                        color="green"      
                    >
                    </mini-statistic>  
                    </v-flex>
                    <v-flex lg3 sm6 xs12>
                    <mini-statistic
                        icon="fa fa-arrow-up"
                        title="7,13"
                        sub-title="TeqCO²"
                        color="red"      
                    >
                    </mini-statistic>           
          </v-flex>-->
          <v-flex xs3>
            <mini-statistic
              icon="battery_full"
              :title="this.tanksItems.length+''"
              :sub-title="this.$i18n.t('views.dashboard.tanksInStock')"
              color="secondary"
            ></mini-statistic>
          </v-flex>
          <v-flex xs9>
            <v-spacer></v-spacer>
          </v-flex>
          <!-- <v-flex lg3 sm6 xs12>
                    <mini-statistic
                        icon="fa fa-file-text"
                        title="50+"
                        sub-title="INTERVENTIONS"
                        color="purple"      
                    >
                    </mini-statistic>             
          </v-flex>-->
          <!-- mini statistic  end -->
          <!-- Inventory view -->
          <v-flex lg6 sm12 xs12>
            <v-widget
              :title="this.$i18n.t('views.dashboard.inventoryViewGraph.title')"
              content-bg="white"
            >
              <!-- <v-btn icon slot="widget-header-action">
                <v-icon class="text--secondary">refresh</v-icon>
              </v-btn>-->
              <div slot="widget-content">
                <v-chart ref="inventoryBarPlotChart" :options="inventoryBarPlotChart"/>
              </div>
            </v-widget>
          </v-flex>
          <!-- Inventory view end -->
          <!-- Inventory circle view -->
          <v-flex lg6 sm12 xs12>
            <v-widget
              :title="this.$i18n.t('views.dashboard.inventoryCircleViewGraph.title')"
              content-bg="white"
            >
              <div slot="widget-content">
                <v-chart ref="inventoryCircleChart" :options="inventoryCircleChart"/>
              </div>
            </v-widget>
          </v-flex>
          <!-- Inventory end -->
          <!-- Last activities -->
          <!-- <v-flex lg6 sm12 xs12>
                        <v-widget title="Activités récentes" class="mt-3">
                            <div slot="widget-content">
                            <v-list two-line subheader>
                                <v-list-tile avatar v-for="item in items" :key="item.title">
                                    <v-list-tile-avatar>
                                        <v-icon :class="item.iconClass">{{ item.icon }}</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                                        <v-list-tile-sub-title>{{ item.timeLabel }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-btn icon ripple>
                                            <v-icon color="grey lighten-1">info</v-icon>
                                        </v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </v-list>
                            </div>
                        </v-widget>
          </v-flex>-->
          <!-- Last activities end -->
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");

import Material from "vuetify/es5/util/colors";
import MiniStatistic from "@/components/widgets/statistic/MiniStatistic";
import VWidget from "@/components/VWidget";
import VCircle from "@/components/circle/VCircle";
import UTIL from "@/utils/Utils.js";
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/bar";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
export default {
  name: "dashboard",
  components: {
    MiniStatistic,
    VWidget,
    VCircle
  },
  data() {
    let data = [];

    for (let i = 0; i <= 360; i++) {
      let t = (i / 180) * Math.PI;
      let r = Math.sin(2 * t) * Math.cos(2 * t);
      data.push([r, i]);
    }
    return {
      fbListener: null,
      compId: null,
      tanksInitiallyFetched: false,

      color: Material,
      tanksItems: [],
      inventoryByGas: [],
      inventoryDataBarPlotView: {
        legend: [],
        quantity: [],
        capacity: []
      },
      inventoryBarPlotChart: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        inventoryBarPlotChart: {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: ["Quantity", "Capacity"]
          },
          color: ["#91c7ae", "#546570"],
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: []
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "Quantity",
              type: "bar",
              data: []
            },
            {
              name: "Capacity",
              type: "bar",
              data: []
            }
          ]
        },
        color: ["#91c7ae", "#546570"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: []
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "Quantity",
            type: "bar",
            data: []
          },
          {
            name: "Capacity",
            type: "bar",
            data: []
          }
        ]
      },
      inventoryDataCircleView: [],
      inventoryCircleChart: {
        //    title : {
        //         text: 'Title',
        //         subtext: 'subtitle',
        //         x:'center'
        //     },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left"
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "80%",
            center: ["60%", "50%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    showSpinner() {
      return !this.tanksInitiallyFetched;
    },
    showDashboard() {
      return this.tanksItems.length > 0 && this.tanksInitiallyFetched;
    },
    showInitialMessage() {
      return this.tanksItems.length == 0 && this.tanksInitiallyFetched;
    }
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    tanksDataCallback(response, error) {
      if (error) {
        //TODO: error mngmt
        console.log("Error: " + error);
      } else if (response) {
        this.tanksItems = response;
        this.inventoryByGas = UTIL.groupBy(this.tanksItems, "refrigerant");
        if (this.inventoryByGas.length > 0) {
          this.inventoryByGas.forEach(item => {
            //preparing data for bar plot chart
            let quantity = 0;
            let capacity = 0;
            item.values.forEach(tank => {
              quantity += tank.quantity;
              capacity += tank.capacity;
            });
            this.inventoryDataBarPlotView.legend.push(item.refrigerant);
            this.inventoryDataBarPlotView.quantity.push(quantity);
            this.inventoryDataBarPlotView.capacity.push(capacity);
            //preparing data for circle chart
            this.inventoryDataCircleView.push({
              name: item.refrigerant,
              // value: item.values.length
              value: quantity
            });
          });
          this.$refs.inventoryBarPlotChart.chart.setOption({
            xAxis: [
              {
                type: "category",
                data: this.inventoryDataBarPlotView.legend
              }
            ],
            series: [
              {
                name: "Quantity",
                type: "bar",
                data: this.inventoryDataBarPlotView.quantity
              },
              {
                name: "Capacity",
                type: "bar",
                data: this.inventoryDataBarPlotView.capacity
              }
            ]
          });
          this.$refs.inventoryCircleChart.chart.setOption({
            series: {
              data: this.inventoryDataCircleView
            }
          });
        }
      } else {
        navigateTo("404");
      }
    },
    populateViewComponents() {
      this.inventoryByGas = UTIL.groupBy(this.tanksItems, "refrigerant");
      if (this.inventoryByGas.length > 0) {
        this.inventoryDataBarPlotView.legend.length = 0;
        this.inventoryDataBarPlotView.quantity.length = 0;
        this.inventoryDataBarPlotView.capacity.length = 0;
        this.inventoryDataCircleView.length = 0;
        this.inventoryByGas.forEach(item => {
          //preparing data for bar plot chart
          let quantity = 0;
          let capacity = 0;
          item.values.forEach(tank => {
            quantity += tank.quantity;
            capacity += tank.capacity;
          });
          this.inventoryDataBarPlotView.legend.push(item.refrigerant);
          this.inventoryDataBarPlotView.quantity.push(quantity);
          this.inventoryDataBarPlotView.capacity.push(capacity);
          //preparing data for circle chart
          this.inventoryDataCircleView.push({
            name: item.refrigerant,
            // value: item.values.length
            value: quantity
          });
        });
        this.$refs.inventoryBarPlotChart.chart.setOption({
          xAxis: [
            {
              type: "category",
              data: this.inventoryDataBarPlotView.legend
            }
          ],
          series: [
            {
              name: "Quantity",
              type: "bar",
              data: this.inventoryDataBarPlotView.quantity
            },
            {
              name: "Capacity",
              type: "bar",
              data: this.inventoryDataBarPlotView.capacity
            }
          ]
        });
        this.$refs.inventoryCircleChart.chart.setOption({
          series: {
            data: this.inventoryDataCircleView
          }
        });
      }
    },
    circleData() {
      return this.inventoryDataCircleView;
    },

    setAllTanksListener(compId) {
      const refrigCompRef = fb.db.collection("refrigCompanies").doc(compId);
      this.compId = refrigCompRef;
      const refrigCompTanksCollecRef = refrigCompRef.collection("tanks");

      refrigCompTanksCollecRef
        .where("compId", "==", compId)
        .orderBy("refrigerant")
        .onSnapshot(
          querySnapshot => {
            this.tanksInitiallyFetched = true;
            var tanksArray = [];
            querySnapshot.forEach(doc => {
              let tank = doc.data();
              tank.id = doc.id;
              tanksArray.push(tank);
            });
            this.tanksItems = tanksArray;
            this.populateViewComponents();
          },
          error => {
            console.log(error);
          }
        );
    },
    initAllTanksListener() {
      const compId = this.$store.state.userProfile.compId;

      if (compId) {
        this.setAllTanksListener(compId);
      } else {
        setTimeout(() => {
          this.$store.dispatch("fetchUserProfile");
          this.initAllTanksListener();
        }, 150);
      }
    }
  },
  created: function() {
    const inventoryPayload = {};
    //TODO: query when data OK
    //Problem can't query OR for the moment. Must do 2 queries and combine result
    inventoryPayload.query = [
      // ['status', '<', 4],
      // ['status', '>', 4]
    ];
  },
  mounted: function() {
    this.initAllTanksListener();
  },
  beforeDestroy: function() {
    //this.setAllTanksListener(this.compId);
  }
};
</script>
<style scoped>
.spinner-div {
  padding-top: 126px;
}
</style>