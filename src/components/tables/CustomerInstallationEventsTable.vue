<template>
<v-card>
    <v-toolbar card color="white">
        <v-text-field flat solo prepend-icon="search" :placeholder="this.$i18n.t('dataTables.customerInstallationsEventTable.search')" v-model="search" hide-details class="hidden-sm-and-down"></v-text-field>
        <v-btn icon>
            <v-icon>filter_list</v-icon>
        </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
        <v-data-table :headers="headers" :search="search" :items="customerInstallationEventsItems" :rows-per-page-items="[10,25,50,{text:'All','value':-1}]" :pagination.sync="pagination" class="elevation-1" item-key="id">
            <template slot="items" slot-scope="props">
                <td class>
                    <a @click.stop="navigateTo('/tank/' + props.item.fromTankId)">{{props.item.sN}}</a>
                </td>
                <td class>{{ props.item.interventionId}}</td>
                <td class>{{ props.item.gas }}</td>
                <td class>{{ props.item.load}} kg</td>
                <td class>{{ props.item.actionDate.toDate() | formatDate }}</td>
                <td class nowrap>
                    <div v-if="props.item.eventQuantity > 0" key="quantityPositive">
                        <v-icon color="green" small>arrow_upward</v-icon>
                        {{ props.item.eventQuantity }} kg {{ $t('dataTables.customerInstallationsEventTable.headers.injected') }}
                    </div>
                    <div v-else key="quantityNegative">
                        <v-icon color="#D32F2F" small>arrow_downward</v-icon>
                        {{ Math.abs(props.item.gasFlowQuantity) }} kg {{ $t('dataTables.customerInstallationsEventTable.headers.recovered') }}
                    </div>
                </td>
                <td class>
                    <a @click.stop="navigateTo('/employee/' + props.item.actionById)">{{props.item.actionByName}}</a>
                </td>
                <td class>{{ props.item.comment }}</td>
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
    name: "customer-installation-events-table",
    props: ["query"],
    components: {},
    data() {
        return {
            search: "",
            pagination: {
                sortBy: "actionDate",
                descending: true
            },
            customerInstallationEventsItems: []
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
        installationEventsDataCallback(response, error) {
            if (error) {
                //TODO
                console.log("Error: " + error);
            } else {
                console.log(response, 'intervention gas')
                this.customerInstallationEventsItems = response;
            }
        }
    },
    computed: {
        headers: function() {
            return [{
                    text: this.$i18n.t(
                        "dataTables.customerInstallationsEventTable.headers.tank"
                    ),
                    value: "sN"
                },
                {
                    text: this.$i18n.t(
                        "dataTables.customerInstallationsEventTable.headers.interventionNumber"
                    ),
                    value: "interventionNbr"
                },
                {
                    text: this.$i18n.t(
                        "dataTables.customerInstallationsEventTable.headers.gas"
                    ),
                    value: "refrigerant"
                },
                {
                    text: this.$i18n.t(
                        "dataTables.customerInstallationsEventTable.headers.quantity"
                    ),
                    value: "quantity"
                },
                {
                    text: this.$i18n.t(
                        "dataTables.customerInstallationsEventTable.headers.date"
                    ),
                    value: "actionDate"
                },
                {
                    text: this.$i18n.t(
                        "dataTables.customerInstallationsEventTable.headers.gasTransfert"
                    ),
                    value: "eventQuantity"
                },
                {
                    text: this.$i18n.t(
                        "dataTables.customerInstallationsEventTable.headers.technician"
                    ),
                    value: "actionByName"
                },
                {
                    text: this.$i18n.t(
                        "dataTables.customerInstallationsEventTable.headers.comment"
                    ),
                    value: "eventComments"
                }
            ];
        }
    },
    created: function() {
        const payload = {};
        if (this.query) {
            payload.query = this.query;

            alert(payload.query)
        }
        this.$store
            .dispatch("fetchTankEvents", payload)
            .then(this.installationEventsDataCallback);
    }
};
</script>
<style lang="stylus" scoped>
</style>
