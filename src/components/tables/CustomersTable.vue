<template>
<v-card>
    <v-toolbar card color="white">
        <v-text-field flat solo prepend-icon="search" :placeholder="this.$i18n.t('dataTables.customersTable.search')" v-model="search" hide-details class="hidden-sm-and-down"></v-text-field>
        <v-btn icon>
            <v-icon>filter_list</v-icon>
        </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
        <v-data-table :headers="headers" :search="search" :items="customersItems" :rows-per-page-items="[10,25,50,{text:'All','value':-1}]" :pagination.sync="pagination" class="elevation-1" item-key="id">
            <template slot="items" slot-scope="props">
                <tr @click.stop="navigateTo('/customer/' + props.item.id)" :style="{ cursor: 'pointer'}">
                    <td nowrap>{{ props.item.name }}</td>
                    <td>{{ props.item.email}}</td>
                    <td>{{ props.item.mainAddress ? props.item.mainZipCode : ''}}</td>
                    <td>{{ props.item.mainAddress ? props.item.mainCity : ''}}</td>
                    <td>{{ props.item.mainAddress ? props.item.mainCountry :' '}}</td>
                    <td>{{ props.item.lastUpdate.toDate() | formatDate }}</td>
                    <td>
                        <v-btn flat icon color="#5071b6" @click.stop="navigateTo('/editCustomer/' + props.item.id)">
                            <v-icon size="20">edit</v-icon>
                        </v-btn>
                        <v-btn flat icon color="#E57373" @click.stop="deleteCustomerById(props)">
                            <v-icon size="20">delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </v-card-text>
</v-card>
</template>
<script>
import {
    mapState
} from "vuex";
const fb = require("../../firebaseConfig.js");
export default {
    name: "customers-table",
    props: ["query"],
    components: {},
    data() {
        return {
            search: "",
            onDelete: true,
            pagination: {
                sortBy: "name",
                descending: false
            },
            customersItems: []
        };
    },
    methods: {
        navigateTo(target) {
            this.$router.push(target);
        },
        customersDataCallback(response, error) {
            if (error) {
                //TODO
                console.log("Error: " + error);
            } else {
                console.log(response)
                this.customersItems = response;
            }
        },
        deleteCustomerById(props) {
            let id = props.item.id
            let index = props.index

            this.customersItems.splice(index, 1);

            this.$store.dispatch("deleteCustomerByid", id).then(docRef => {
                this.$snotify.success(
                    this.$t("views.customers.add.form.customerDeleted"),
                    this.$t("global.saved"), {
                        timeout: 3500,
                        showProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true
                    }
                );
            });
        },
    },
    computed: {
        ...mapState(["userProfile", "customers"]),
        headers: function() {
            return [{
                    text: this.$i18n.t("dataTables.customersTable.headers.name"),
                    value: "name"
                },
                {
                    text: this.$i18n.t("dataTables.customersTable.headers.email"),
                    value: "email"
                },
                {
                    text: this.$i18n.t("dataTables.customersTable.headers.postalCode"),
                    value: "mainZipCode"
                },
                {
                    text: this.$i18n.t("dataTables.customersTable.headers.city"),
                    value: "mainCity"
                },
                {
                    text: this.$i18n.t("dataTables.customersTable.headers.country"),
                    value: "mainCountry"
                },
                {
                    text: this.$i18n.t("dataTables.customersTable.headers.lastUpdate"),
                    value: "lastUpdate"
                },
                {
                    text: "",
                    value: ""
                }
            ];
        }
    },
    created: function() {
        const payload = {};
        if (this.query) {
            payload.query = this.query;
        }
        //this.$store.dispatch("fetchCustomers", payload).then(this.customersDataCallback);
        this.$store
            .dispatch("fetchCustomers", payload)
            .then(querySnapshot => {
                let customersArray = [];
                querySnapshot.forEach(doc => {
                    let customer = doc.data();
                    customer.id = doc.id;
                    customersArray.push(customer);
                });
                this.customersItems = customersArray;
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }
};
</script>
<style>
</style>
