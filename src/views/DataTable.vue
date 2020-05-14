<template>
  <v-app>
    <navigation-drawer />
    <top-toolbar />
    <v-content>
      <v-container fluid>
        <h3>{{ $t('topToolbar.actions.logout') }}</h3>
        <v-data-table
          :headers="headers"
          :items="tanks.myTanks"
          hide-actions
          class="elevation-1"
        >
          <template
            slot="items"
            slot-scope="props"
          >
            <td class="text-xs-right">{{ props.item.sN }}</td>
            <td class="text-xs-right">{{ props.item.capacity }}</td>
            <td class="text-xs-right">{{ props.item.quantity }}</td>
            <td class="text-xs-right">{{ props.item.refrigerant }}</td>
            <td class="text-xs-right">{{ props.item.takenByName }}</td>
          </template>
        </v-data-table>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
export default {
  name: "data-table",
  data() {
    return {
      myTanks: []
    };
  },
  computed: {
    ...mapState(["userProfile", "tanks"]),
    headers: function() {
      return [
        {
          text: this.$i18n.t("views.dataTable.table.headers"),
          value: "sN"
        },
        { text: "capacity", value: "capacity" },
        { text: "quantity", value: "quantity" },
        { text: "refrigerant", value: "refrigerant" },
        { text: "takenByName", value: "takenByName" }
      ];
    }
  },
  created: function() {
    this.$store.dispatch("fetchMyTanks");
  }
};
</script>
<style>
</style>
