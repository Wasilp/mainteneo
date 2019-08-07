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
        select-all
      >
        <template slot="items" slot-scope="props">
          <tr @click.stop="navigateTo('/tank/' + props.item.id)" :style="{ cursor: 'pointer'}">
            <td>
              <v-checkbox @click.native.stop.prevent v-model="props.selected" primary hide-details></v-checkbox>
            </td>
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
            <td class>{{ props.item.quantity }} kg</td>
            <td class style="padding:10px">
              <v-progress-circular
                :size="76"
                :width="10"
                :rotate="-90"
                :value="props.item.quantity/props.item.capacity*100"
                color="accent"
              >{{ Math.round((props.item.quantity / props.item.capacity) *100) }} %</v-progress-circular>
            </td>
            <td class>{{ props.item.refrigerant }}</td>
            <td class>{{ props.item.providerCompName }}</td>
            <td class>{{ props.item.lastUpdate.toDate() | formatDate }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
// const fb = require("../../firebaseConfig.js");
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
      tanksItems: []
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
        this.tanksItems = response;
      }
    }
    // setTanksListener(compId) {
    //   const payload = {};
    //   if (this.query) {
    //     payload.query = this.query;
    //   }
    //   this.$store
    //     .dispatch("fetchMyTanks", payload)
    //     .then(this.tanksDataCallback);

    //   const refrigCompRef = fb.db.collection("refrigCompanies").doc(compId);
    //   this.compId = refrigCompRef;
    //   const refrigCompTanksCollecRef = refrigCompRef.collection("tanks");

    //   refrigCompTanksCollecRef
    //     .where("compId", "==", compId)
    //     .orderBy("refrigerant")
    //     .onSnapshot(
    //       querySnapshot => {
    //         var tanksArray = [];
    //         querySnapshot.forEach(doc => {
    //           let tank = doc.data();
    //           tank.id = doc.id;
    //           tanksArray.push(tank);
    //         });
    //         this.tanksItems = tanksArray;
    //         this.populateViewComponents();
    //       },
    //       error => {
    //         console.log(compId);
    //         console.log(error);
    //       }
    //     );
    // }
  },
  watch: {
    selected: function(newSelected, oldSelected) {
      this.$emit("select-tanks", newSelected);
    }
  },
  computed: {
    headers: function() {
      return [
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
          text: this.$i18n.t("dataTables.tanksTable.headers.supplier"),
          value: "providerCompName"
        },
        {
          text: this.$i18n.t("dataTables.tanksTable.headers.lastUpdate"),
          value: "lastUpdate"
        }
      ];
    }
  },
  created: function() {
    const payload = {};
    if (this.query) {
      payload.query = this.query;
    }
    this.$store.dispatch("fetchMyTanks", payload).then(this.tanksDataCallback);
  }
};
</script>
<style>
</style>