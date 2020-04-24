<template>
  <v-card>
    <v-toolbar card color="white">
      <v-text-field
        flat
        solo
        prepend-icon="search"
        :placeholder="this.$i18n.t('dataTables.installationsTable.search')"
        v-model="searchInstallations"
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
        :search="searchInstallations"
        :items="installationsItems"
        :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
        :pagination.sync="pagination"
        class="elevation-1"
        item-key="id"
      >
        <template slot="items" slot-scope="props">
          <tr
            @click.stop="navigateTo('/installation/' + props.item.id)"
            :style="{ cursor: 'pointer'}"
          >
            <td class>{{ props.item.sN }}</td>
            <td class>{{ props.item.engineProviderCompanyName }}</td>
            <td class>{{ props.item.model }}</td>
            <td class>{{ props.item.type}}</td>
            <td class>{{ props.item.power }}</td>
            <td class>{{ props.item.load }}</td>
            <td class>
              <a
                @click.stop="navigateTo('/customer/' + props.item.customerId)"
              >{{ props.item.customerName }}</a>
            </td>
            <td class>{{ props.item.localization }}</td>
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
  name: "installations-table",
  props: ["query"],
  components: {},
  data() {
    return {
      search: "",
      pagination: {
        sortBy: "lastUpdate",
        descending: true
      },
      searchInstallations: "",
      installationsItems: []
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    }
  },
  computed: {
    ...mapState(["userProfile", "installations"]),
    headers: function() {
      return [

        {
          text: this.$i18n.t("dataTables.installationsTable.headers.sn"),
          value: "sN"
        },
        {
          text: this.$i18n.t("dataTables.installationsTable.headers.brand"),
          value: "brand"
        },
        {
          text: this.$i18n.t("dataTables.installationsTable.headers.model"),
          value: "model"
        },
        {
          text: this.$i18n.t("dataTables.installationsTable.headers.type"),
          value: "type"
        },
        {
          text: this.$i18n.t("dataTables.installationsTable.headers.power"),
          value: "power"
        },
        {
          text: this.$i18n.t("dataTables.installationsTable.headers.capacity"),
          value: "capacity"
        },
        {
          text: this.$i18n.t("dataTables.installationsTable.headers.customer"),
          value: "customerCompanyName"
        },
        {
          text: this.$i18n.t("dataTables.installationsTable.headers.location"),
          value: "customerCompanyName"
        },
        {
          text: this.$i18n.t(
            "dataTables.installationsTable.headers.lastUpdate"
          ),
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

    this.$store
      .dispatch("fetchInstallations", payload)
      .then(querySnapshot => {
        let installationsArray = [];
        querySnapshot.forEach(doc => {
          let installation = doc.data();
          installation.id = doc.id;
          installationsArray.push(installation);
        });

        this.installationsItems = installationsArray;

        console.log(this.installationsItems)
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
  }
};
</script>
<style></style>
