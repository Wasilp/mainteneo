<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-flex sm12 class="page-title">
          <h3>{{ $t('views.customer.title') }}</h3>
        </v-flex>
        <v-divider></v-divider>
        <v-card class="block-element">
          <v-layout row wrap>
            <v-flex lg6>
              <v-layout row wrap>
                <v-flex lg3>
                  <span>
                    <v-icon class="page-icon">people</v-icon>
                  </span>
                </v-flex>
                <v-flex lg9>
                  <h2>{{ customer.name}}</h2>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex lg6>
              <v-layout row wrap>
                <v-flex sm6>
                  <label>{{ $t('views.customer.name') }}:</label>
                  {{customer.name}}
                </v-flex>
                <v-flex sm6></v-flex>
                <v-flex sm6 v-if="customer.phone">
                  <label>{{ $t('views.customer.phone') }}:</label>
                  {{customer.phone}}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.customer.email') }}:</label>
                  {{customer.email}}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.customer.vat') }}:</label>
                  {{customer.vat}}
                </v-flex>
                <v-flex sm6 v-if="customer.lastUpdate">
                  <label>{{ $t('views.customer.lastUpdate') }}:</label>
                  {{customer.lastUpdate.toDate() | formatDate }}
                </v-flex>
                <v-flex sm6>
                  <label>{{ $t('views.customer.address') }}:</label>
                  {{customer.street +' '+customer.zipcode+' '+customer.city+' '+customer.country}}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
        <v-divider></v-divider>
        <v-flex lg12 class="block-element" v-if="customer">
          <v-tabs fixed-tabs grow centered icons-and-text>
            <v-tab href="#tab-1">
              {{ $t('views.customer.interventions') }}
              <v-icon class="tab-icon">library_books</v-icon>
            </v-tab>

            <v-tab href="#tab-2">
              {{ $t('views.customer.installations') }}
              <v-icon class="tab-icon">ac_unit</v-icon>
            </v-tab>

            <v-tab-item id="tab-1" key="1">
              <interventions-table
                :query="[['groupBy','interventionNumber'],['customerId' , '==', this.$route.params.id]]"
              ></interventions-table>
            </v-tab-item>

            <v-tab-item id="tab-2" key="2">
              <installations-table :query="[['customerId', '==', this.$route.params.id]]"></installations-table>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
import InterventionsTable from "@/components/tables/InterventionsTable";
import InstallationsTable from "@/components/tables/InstallationsTable";
const fb = require("../firebaseConfig.js");
export default {
  name: "customer",
  components: {
    "interventions-table": InterventionsTable,
    "installations-table": InstallationsTable
  },
  data() {
    return {
      customer: {}
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    }
  },
  computed: {
    ...mapState(["userProfile", "customers"])
  },
  created() {
    console.log("IN CREATED");
    const payload = {};

    console.log(this.$route.params.id,'params')
    if (this.$route.params.id) {
      payload.customerId = this.$route.params.id;
    }
    this.$store
      .dispatch("fetchCustomer", payload)
      .then(doc => {

      console.log(doc,'customer')
        if (doc.exists) {
          let c = doc.data();

          c.id = doc.id;
          this.customer = c;

          console.log(this.customer)
        } else {
          console.log("No such document!");
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }
};
</script>
<style></style>
