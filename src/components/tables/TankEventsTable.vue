<template>
<v-card>
    <v-toolbar card color="white">
        <v-text-field flat solo prepend-icon="search" :placeholder="this.$i18n.t('dataTables.tanksEventTable.search')" v-model="search" hide-details class="hidden-sm-and-down"></v-text-field>
        <v-btn icon>
            <v-icon>filter_list</v-icon>
        </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
        <v-data-table :headers="headers" :search="search" :items="tankEventsItems" :rows-per-page-items="[10,25,50,{text:'All','value':-1}]" :pagination.sync="pagination" class="elevation-1" item-key="id">
            <template slot="items" slot-scope="props">
                <td class>{{ props.item.sN }}</td>
                <td class>{{ props.item.gas }}</td>
                <td class>{{ props.item.load}} kg</td>
                <td class>
                    <span v-if="props.item.actionType == 0">{{ $t('dropdownMenus.tankEventType.add') }}</span>
                    <span v-if="props.item.actionType == 1">{{ $t('dropdownMenus.tankEventType.take') }}</span>
                    <span v-else-if="props.item.actionType == 2">{{ $t('dropdownMenus.tankEventType.use') }}</span>
                    <span v-else-if="props.item.actionType == 3">{{ $t('dropdownMenus.tankEventType.release') }}</span>
                    <span v-else-if="props.item.actionType == 4">{{ $t('dropdownMenus.tankEventType.releaseOnSite') }}</span>
                    <span v-else-if="props.item.actionType == 5">{{ $t('dropdownMenus.tankEventType.toSupplier') }}</span>
                    <span v-else-if="props.item.actionType == 6">{{ $t('dropdownMenus.tankEventType.toUnstock') }}</span>
                </td>
                <td class>{{ props.item.actionDate.toDate() | formatDate }}</td>
                <td class nowrap>
                    <div v-if="props.item.actionType == 2">
                        <div v-if="props.item.eventQuantity < 0" key="quantityPositive">
                            <v-icon color="green" small>arrow_upward</v-icon>
                            {{ Math.abs(props.item.gasFlowQuantity) }} kg {{ $t('dataTables.tanksEventTable.headers.injected') }}
                        </div>
                        <div v-else key="quantityNegative">
                            <v-icon color="#D32F2F" small>arrow_downward</v-icon>
                            {{ props.item.gasFlowQuantity }} kg {{ $t('dataTables.tanksEventTable.headers.recovered') }}
                        </div>
                    </div>
                </td>
                <td class>
                    <a @click.stop="navigateTo('/installation/' + props.item.installationId)">{{props.item.installationSn}}</a>
                </td>
                <td class>
                    <span v-if="props.item.actionType == 1"></span>
                    <span v-else-if="props.item.actionType == 2"></span>
                    <span v-else-if="props.item.actionType == 3"></span>
                    <span v-else-if="props.item.actionType == 4">
                        <a @click.stop="navigateTo('/customer/' + props.item.customerId)">{{props.item.customerSiteName}}</a>
                    </span>
                    <span v-else-if="props.item.actionType == 5">//TODO Supplier Name</span>
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
export default {
    name: "tank-events-table",
    props: ["query"],
    components: {},
    data() {
        return {
            search: "",
            pagination: {
                sortBy: "actionDate",
                descending: true
            },
            tankEventsItems: []
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
        tankEventsDataCallback(response, error) {
            if (error) {
                console.log("Error: " + error);
            } else {
                this.tankEventsItems = response;

                console.log(this.tankEventsItems, 'TANKEVENT')
            }
        }
    },
    computed: {
        headers: function() {
            return [{
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.tank"),
                    value: "sN"
                },
                {
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.gas"),
                    value: "refrigerant"
                },
                {
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.quantity"),
                    value: "quantity"
                },
                {
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.action"),
                    value: "actionType"
                },
                {
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.date"),
                    value: "actionDate"
                },
                {
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.gasTransfert"),
                    value: "eventQuantity"
                },
                {
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.installation"),
                    value: "installation"
                },
                {
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.location"),
                    value: "releasedLocation"
                },
                {
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.technician"),
                    value: "actionByName"
                },
                {
                    text: this.$i18n.t("dataTables.tanksEventTable.headers.comment"),
                    value: "eventComments"
                }
            ];
        }
    },
    created: function() {
        const payload = {};
        if (this.query) {
            payload.query = this.query;

            console.log(payload.query, 'im tank event payload')
        }
        this.$store
            .dispatch("fetchTankEvents", payload)
            .then(this.tankEventsDataCallback);
    }
};
</script>
<style lang="stylus" scoped>
</style>
