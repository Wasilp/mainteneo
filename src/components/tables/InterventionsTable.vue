<template>
  <v-card>
    <v-toolbar card color="white">
      <v-text-field
        flat
        solo
        prepend-icon="search"
        :placeholder="this.$i18n.t('dataTables.interventionsTable.search')"
        v-model="search"
        hide-details
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-btn icon>
        <v-icon>filter_list</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <v-data-table
        :headers="headers"
        :search="search"
        :items="interventionItems"
        :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
        :pagination.sync="pagination"
        class="elevation-1"
        item-key="id"
      >
        <template slot="items" slot-scope="props">
          <tr
            @click.stop="navigateTo('/intervention/' + props.item.values[0].installationId + '/' + props.item.values[0].interventionNumber)"
            :style="{ cursor: 'pointer'}"
          >
            <td class>{{ props.item.values[0].interventionNumber }}</td>
            <td class>
              <span
                v-if="props.item.values[0].interventionType==1"
              >{{ $t('dropdownMenus.interventionType.startup') }}</span>
              <span
                v-else-if="props.item.values[0].interventionType=='maintenanceColdInstallation'"
              >{{ $t('dropdownMenus.interventionType.maintenance') }}</span>
              <span
                v-else-if="props.item.values[0].interventionType==3"
              >{{ $t('dropdownMenus.interventionType.coldMounting') }}</span>
              <span
                v-else-if="props.item.values[0].interventionType==4"
              >{{ $t('dropdownMenus.interventionType.coldRepair') }}</span>
              <span
                v-else-if="props.item.values[0].interventionType==5"
              >{{ $t('dropdownMenus.interventionType.electricalRepair') }}</span>
            </td>
            <td class>
              <a
                @click.stop="navigateTo('/installation/' + props.item.values[0].installationId)"
              >{{ props.item.values[0].installationSN }}</a>
            </td>
            <td class>
              <a
                @click.stop="navigateTo('/customer/' + props.item.values[0].customerCompanyId)"
              >{{ props.item.values[0].customerCompanyName }}</a>
            </td>
            <td class>
              <a
                @click.stop="navigateTo('/employee/' + props.item.values[0].actionById)"
              >{{ props.item.values[0].actionByName }}</a>
            </td>
            <td class>{{ props.item.values[0].actionDate.toDate() | formatDate }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
const fb = require("../../firebaseConfig.js");
export default {
  name: "interventions-table",
  props: ["query"],
  components: {},
  data() {
    return {
      search: "",
      pagination: {},
      interventionItems: []
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    interventionDataCallback(response, error) {
      if (error) {
        //TODO
        console.log("Error: " + error);
      } else {

      console.log(response)
        this.interventionItems = response;
      }
    }
  },
  computed: {
    headers: function() {
      return [
        {
          text: this.$i18n.t(
            "dataTables.interventionsTable.headers.interventionNumber"
          ),
          value: "interventionNbr"
        },
        {
          text: this.$i18n.t("dataTables.interventionsTable.headers.type"),
          value: "interventionType"
        },
        {
          text: this.$i18n.t(
            "dataTables.interventionsTable.headers.installation"
          ),
          value: "currentQr"
        },
        {
          text: this.$i18n.t("dataTables.interventionsTable.headers.customer"),
          value: "customerCompanyName"
        },
        {
          text: this.$i18n.t(
            "dataTables.interventionsTable.headers.technician"
          ),
          value: "userName"
        },
        {
          text: this.$i18n.t("dataTables.interventionsTable.headers.date"),
          value: "actionDate"
        }
      ];
    }
  },
  created: function() {
    const payload = {};
    if (this.query) {
      payload.query = this.query;
    }
    this.$store
      .dispatch("fetchCustomerInstallationHistory", payload)
      .then(this.interventionDataCallback);
  }
};
</script>
<style>
</style>
