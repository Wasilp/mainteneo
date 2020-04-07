<template>
  <v-card>
    <v-toolbar card color="white">
      <v-text-field
        flat
        solo
        prepend-icon="search"
        :placeholder="this.$i18n.t('dataTables.tanksTable.search')"
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
        :items="tanksItems"
        :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
        :pagination.sync="pagination"
        class="elevation-1"
        item-key="id"
        v-model="selected"
      >
        <template slot="items" slot-scope="props">
          <tr @click.stop="navigateTo('/tank/' + props.item.id)" :style="{ cursor: 'pointer'}">
            <td class nowrap>{{ props.item.sN }}</td>
            <td class>
              <span v-if="props.item.currentType==1">{{ $t('dropdownMenus.tankType.fluid') }}</span>
              <span
                v-else-if="props.item.currentType==2"
              >{{ $t('dropdownMenus.tankType.transfer') }}</span>
              <span
                v-else-if="props.item.currentType==3"
              >{{ $t('dropdownMenus.tankType.recovery') }}</span>
            </td>
            <td class>{{ props.item.capacity }} kg</td>
            <td class>{{ props.item.load}} kg</td>
            <td class style="padding:10px">
              <v-progress-circular
                :size="76"
                :width="10"
                :rotate="-90"
                :value="props.item.load/props.item.capacity * 100"
                color="accent"
              >{{ Math.round((props.item.load / props.item.capacity) * 100) }} %</v-progress-circular>
            </td>
            <td class>{{ props.item.gas }}</td>
            <td class>
              <v-chip
                v-if="props.item.status == 1"
                outline
                color="green"
              >{{ $t('dropdownMenus.tankStatus.available') }}</v-chip>
              <v-chip
                v-else-if="props.item.status==2"
                outline
                color="orange"
              >{{ $t('dropdownMenus.tankStatus.taken') }}</v-chip>
              <v-chip
                v-else-if="props.item.status==3"
                outline
                color="black"
              >{{ $t('dropdownMenus.tankStatus.onSite') }}</v-chip>
              <v-chip
                v-else-if="props.item.status==4"
                outline
                color="red"
              >{{ $t('dropdownMenus.tankStatus.releasedToSupplier') }}</v-chip>
              <v-chip
                v-else-if="props.item.status==5"
                outline
                color="red"
              >{{ $t('dropdownMenus.tankStatus.toSupplier') }}</v-chip>
            </td>
            <td class>
              <a
                v-if="props.item.takenByName"
                @click="navigateTo('/employee/' + props.item.takenById)"
              >{{ props.item.takenByName}}</a>
              <a
                v-else-if="props.item.status == 3"
                @click="navigateTo('/customer/' + props.item.custIdReleased)"
              >{{ props.item.custNameReleased }}</a>
            </td>
            <td v-if="showVehiclesUI" class>{{ props.item.inVehicle }}</td>
            <td class>{{ props.item.gasProviderCompanyName}}</td>
            <td class>{{ props.item.lastUpdated.toDate() | formatDate }}</td>
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
  name: "tanks-table",
  props: ["query"],
  components: {},
  data() {
    return {
      search: "",
      pagination: {
        sortBy: "lastUpdate",
        descending: true
      },
      selected: [],
      tanksItems: [],
      showVehiclesUI: false
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    displayNotification() {
      this.$snotify.simple({
        body: "My Notification Body",
        title: "Notification Title",
        config: {}
      });
    },
    tanksDataCallback(response, error) {
      if (error) {
        //TODO
        console.log("Error: " + error);
      } else {

          console.log(response,'kikou')
        this.tanksItems = response;
      }
    }
  },
  computed: {
    headers: function() {
      const headersArray = [
        { text: this.$i18n.t("dataTables.tanksTable.headers.sn"), value: "sN" },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.type"),
          value: "currentType"
        },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.capacity"),
          value: "capacity"
        },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.quantity"),
          value: "quantity"
        },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.load"),
          value: ""
        },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.refrigerant"),
          value: "refrigerant"
        },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.status"),
          value: "status"
        },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.owner"),
          value: "takenByName"
        },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.supplier"),
          value: "providerCompName"
        },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.lastUpdate"),
          value: "lastUpdate"
        }
      ];
      if (this.showVehiclesUI) {
        headersArray.splice(8, 0, {
          text: "Véhicule",
          value: "inVehicle"
        });
      }
      return headersArray;
    }
  },
  created: function() {
    this.$store.state.currentUser
      .getIdTokenResult()
      .then(idTokenResult => {
        if (!!idTokenResult.claims.vehicles) {
          this.showVehiclesUI = true;
        } else {
          this.showVehiclesUI = false;
        }
        const payload = {};
        if (this.query) {
          payload.query = this.query;
        }
        this.$store
          .dispatch("fetchMyTanks", payload)
          .then(this.tanksDataCallback);
      })
      .catch(error => {
        //TODO: treatment
        console.log(error);
      });
  }
};
</script>
<style>
</style>
