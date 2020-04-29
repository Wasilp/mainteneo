<template>
  <v-card>
    <v-toolbar card color="white">
      <v-text-field
        flat
        solo
        prepend-icon="search"
        :placeholder="this.$i18n.t('dataTables.employeesTable.search')"
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
        :items="usersItems"
        :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
        class="elevation-1"
        item-key="id"
      >
        <template slot="items" slot-scope="props">
          <tr @click.stop="navigateTo('/employee/' + props.item.id)" :style="{ cursor: 'pointer'}">
            <td class>{{ props.item.userName }}</td>
            <td class>{{ phoneNumber(props.item) }}</td>
            <td class>{{ props.item.emailId}}</td>
            <!-- <td class>{{ props.item.lng }}</td> -->
            <td class>{{ props.item.role }}</td>
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
  name: "employees-table",
  props: ["query"],
  components: {},
  data() {
    return {
      search: "",
      usersItems: []
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    usersDataCallback(response, error) {
      if (error) {
        //TODO
        console.log("Error: " + error);
      } else {
        this.usersItems = response;
      }
    },
    phoneNumber: function(employee) {
      if (employee.phone && employee.phone.length > 0) {
        return employee.phone;
      } else {
        return "";
      }
    }
  },
  computed: {
    ...mapState(["userProfile", "users"]),
    headers: function() {
      return [
        {
          text: this.$i18n.t("dataTables.employeesTable.headers.name"),
          value: "userName"
        },
        {
          text: this.$i18n.t("dataTables.employeesTable.headers.phone"),
          value: "phoneNbrs"
        },
        {
          text: this.$i18n.t("dataTables.employeesTable.headers.email"),
          value: "email"
        },
        // {
        //   text: this.$i18n.t("dataTables.employeesTable.headers.language"),
        //   value: "lng"
        // },
        // { text: this.$i18n.t("dataTables.employeesTable.headers.timezone"), value: 'timezone' },
        {
          text: this.$i18n.t("dataTables.employeesTable.headers.role"),
          value: "userType"
        }
      ];
    }
  },
  created: function() {
    const payload = {};
    if (this.query) {
      payload.query = this.query;
    }
    this.$store.dispatch("fetchUsers", payload).then(this.usersDataCallback);
  }
};
</script>
<style>
</style>
