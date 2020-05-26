<template>
<v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
        <div class="content">
            <v-flex sm12 class="page-title">
                <h3>{{ $t('views.intervention.title') }}</h3>
            </v-flex>
            <v-card class="block-element">
                <v-container grid-list-xs>
                    <v-layout row wrap>
                        <v-flex lg6>
                            <v-layout row wrap>
                                <v-flex lg3>
                                    <span>
                                        <v-icon class="page-icon">assignment</v-icon>
                                    </span>
                                </v-flex>
                                <v-flex lg9>
                                    <h1>{{interventionType}}</h1>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex lg6>
                            <v-layout row wrap>
                                <v-flex sm6>
                                    <label>{{ $t('views.intervention.interventionNumber') }}:</label>
                                    {{ interventionItems[0].interventionNumber }}
                                </v-flex>
                                <v-flex sm6>
                                    <label>{{ $t('views.intervention.installation') }}:&nbsp;</label>
                                    <a @click="navigateTo('/installation/'+installation.id)">{{installation.sN}}</a>
                                </v-flex>
                                <v-flex sm6>
                                    <label>{{ $t('views.intervention.brand') }}:</label>
                                    {{installation.engineProviderCompanyName}}
                                </v-flex>
                                <v-flex sm6>
                                    <label>{{ $t('views.intervention.customer') }}:&nbsp;</label>
                                    <a @click="navigateTo('/customer/'+installation.customerId)">{{ installation.customerName}}</a>
                                </v-flex>
                                <v-flex sm6>
                                    <label>{{ $t('views.intervention.model') }}:</label>
                                    {{ installation.model }}
                                </v-flex>
                                <v-flex sm6>
                                    <label>{{ $t('views.intervention.localization') }}:</label>
                                    {{ installation.localization}}
                                </v-flex>
                                <v-flex sm6>
                                    <label>{{ $t('views.intervention.fitter') }}:&nbsp;</label>
                                    <a @click="navigateTo('/employee/'+installation.lastUpdatedByUserId)">{{ installation.lastUpdatedByUserUserName}}</a>
                                </v-flex>
                                <v-flex sm6>
                                    <label>{{ $t('views.intervention.lastVisit') }}:</label>
                                    {{ installation.lastUpdated.toDate() | formatDate }}
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
            <v-flex lg12 class="block-element">
                <v-tabs fixed-tabs grow centered icons-and-text>
                    <v-tab href="#tab-1">
                        {{ $t('views.intervention.gas') }}
                        <v-icon class="tab-icon">battery_full</v-icon>
                    </v-tab>
                    <v-tab href="#tab-2">
                        {{ $t('views.intervention.interventionReports') }}
                        <v-icon class="tab-icon">assignment</v-icon>
                    </v-tab>
                    <v-tab-item id="tab-1" key="1">
                        <customer-installation-events-table :query="[['installationId','==', installation.id]]"></customer-installation-events-table>
                    </v-tab-item>
                    <v-tab-item id="tab-2" key="2">
                        <v-card>
                            <div id="media" class="media">
                                <div class="text-xs-center" style="padding: 30px;">
                                    <v-btn large round :loading="loading" :disabled="false" color="secondary" class="white--text" @click="onSelectFile">
                                        {{ $t('views.intervention.upload') }}
                                        <v-icon right dark>cloud_upload</v-icon>
                                    </v-btn>
                                    <input type="file" style="display: none" ref="fileInput" @change="uploadFile">
                                </div>
                                <v-divider></v-divider>
                                <div class="layout row media-layout">
                                    <div class="media-content flex transparent">
                                        <vue-perfect-scrollbar class="media-content--warp">
                                            <v-container fluid>
                                                <v-flex lg4 sm12 xs12 class="pa-2" v-for="(item, id) in interventionFiles" :key="id">


                                                    <v-layout row wrap class="x-grid-lg">
                                                        <a @click="openFile(item.fileName)" class="d-flex">
                                                            <v-card flat tile class="media-detail">
                                                                <v-card-media height="150px" width="150px" style="margin:auto;">
                                                                    <v-icon class="mx-auto" size="120">{{ getFileIcon(item.fileExtension) }}</v-icon>
                                                                </v-card-media>
                                                                <v-divider></v-divider>
                                                                <v-card-text>
                                                                    <p class="text-md-center">
                                                                        <label>{{item.fileName}}</label>
                                                                        - {{item.createdAt.toDate() | formatDate()}}
                                                                    </p>
                                                                </v-card-text>
                                                            </v-card>
                                                        </a>

                                                    </v-layout>
                                                </v-flex>

                                            </v-container>
                                        </vue-perfect-scrollbar>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
        </div>
    </v-content>
</v-app>
</template>
<script>
import {
    mapState,
    install
} from "vuex";
const fb = require("../firebaseConfig.js");

import axios from 'axios';
import VWidget from "@/components/VWidget";
import CustomerInstallationEventsTable from "@/components/tables/CustomerInstallationEventsTable";
export default {
    name: "intervention",
    components: {
        VWidget,
        "customer-installation-events-table": CustomerInstallationEventsTable
    },
    props: {
        type: {
            type: String,
            default: "image"
        }
    },
    data: () => ({
        installation: {},
        intervention: {},
        interventionItems: [],
        interventionType: "",
        folders: [],
        size: "lg",
        view: "grid",
        loading: false,

        fileTypesIcons: {
            url: "link",
            pdf: "picture_as_pdf",
            png: "photo",
            jpeg: "photo",
            jpg: "photo"
        },
        interventionFiles: []
    }),
    computed: {
        mediaMenu() {
            return getFileMenu;
        },
        files() {
            return this.filesItems;
        }
    },

    methods: {
        navigateTo(target) {
            this.$router.push(target);
        },
        installationDataCallback(response, error) {
            if (error) {
                //TODO
                console.log("Error: " + error);
            } else if (response) {

                console.log(response, 'installation datac')
                this.installation = response;

                console.log(response, 'installation')
            } else {
                navigateTo("404");
            }
        },
        interventionDataCallback(response, error) {
            if (error) {
                //TODO
                console.log("Error: " + error);
            } else if (response) {

                this.interventionItems = response;

                switch (this.interventionItems[0].interventionType) {
                    case "1":
                        this.interventionType = this.$i18n.t(
                            "dropdownMenus.interventionType.startup"
                        );
                        break;
                    case "2":
                        this.interventionType = this.$i18n.t(
                            "dropdownMenus.interventionType.maintenance"
                        );
                        break;
                    case "3":
                        this.interventionType = this.$i18n.t(
                            "dropdownMenus.interventionType.coldMounting"
                        );
                        break;
                    case "4":
                        this.interventionType = this.$i18n.t(
                            "dropdownMenus.interventionType.coldRepair"
                        );
                        break;
                    case "5":
                        this.interventionType = this.$i18n.t(
                            "dropdownMenus.interventionType.electricalRepair"
                        );
                        break;
                    default:
                        break;
                }
            } else {
                navigateTo("404");
            }
        },
        fileSize(number) {
            return Bytes.format(number);
        },
        formateDate(string) {
            return string ? new Date(string).toLocaleDateString() : "";
        },
        getFileIcon(fileExtension) {
            if (fileExtension in this.fileTypesIcons) {
                return this.fileTypesIcons[fileExtension];
            } else {
                return "insert_drive_file";
            }
        },
        async setInterventionFilesListener() {

            const interventionId = this.$route.params.id;

            const compId = this.$store.state.userProfile.refrigCompanyId;
            const refrigCompRef = fb.db.collection("files")

            await refrigCompRef
                .where("interventionId", "==", interventionId)
                // .orderBy("createdAt", "desc")
                .onSnapshot((querySnapshot) => {
                        var filesArray = [];
                        querySnapshot.forEach(doc => {
                            let file = doc.data();
                            file.id = doc.id;
                            filesArray.push(file);
                        })
                        this.interventionFiles = filesArray

                        console.log(filesArray, 'KIKOU')
                    },
                    error => {
                        //TODO: treat error
                        console.log(error);
                    }
                );
        },
        onSelectFile() {
            this.$refs.fileInput.click();
        },
        uploadFile(evt) {
            const self = this;
            const file = evt.target.files[0];
            const fileUploadPayload = {
                file: file,
                interventionId: self.interventionItems[0].interventionNumber
            };
            this.loading = true;
            this.$store.dispatch("uploadFile", fileUploadPayload).then(() => {
                this.loading = false;
            });
        },
        openFile(fileName) {

            // let params = {
            //     fileId: id,
            //     accessCode: code
            // }
            //
            // axios.get('https://us-central1-mainteneo-react-native-dev.cloudfunctions.net/api/v1/files/'+params.fileId+'/'+params.accessCode, {
            // }).then(function(response){
            //     console.log(response,'HELLO FROM AXIOS ')
            // }).catch(function(error) {
            //  console.log(error,'FATALERRRROORRR')
            // });

            const test = fb.storage;

            const ref = fb.storage.refFromURL('gs://mainteneo-react-native-dev.appspot.com/' + fileName).getDownloadURL().then(function(url){
                window.open(url)
            })
            // This can be downloaded directly:

        }
    },
    created: function() {
        const installationPayload = {};
        const interventionPayload = {};

        if (
            this.$route.params.installationId &&
            this.$route.params.id
        ) {
            installationPayload.installationId = this.$route.params.installationId;
            interventionPayload.query = [
                ["id", "==", this.$route.params.id]
            ];
        } else {
            navigateTo("404");
        }
        this.$store
            .dispatch("fetchInstallation", installationPayload)
            .then(this.installationDataCallback);
        this.$store
            .dispatch("fetchCustomerInstallationHistory", interventionPayload)
            .then(this.interventionDataCallback);
    },
    mounted: function() {
        this.setInterventionFilesListener();
    }
};
</script>
<style lang="stylus" scoped>
.media {
  &-content--wrap, &-menu {
    min-width: 260px;
    border-right: 1px solid #eee;
    min-height: calc(100vh - 50px - 64px);
  }

  &-detail {
    min-width: 300px;
    border: 1px solid #eee;
  }
}
</style>
