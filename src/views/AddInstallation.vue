<template>
    <v-app>
        <navigation-drawer></navigation-drawer>
        <top-toolbar></top-toolbar>
        <v-content>
            <v-form v-model="valid" class="form-element">
                <v-flex sm12 class="page-title">
                    <h3>Ajouter une installation</h3>
                </v-flex>   
                <v-flex sm12>
                    <v-widget title="Informations de la centrale de l'installation">
                        <div slot="widget-content">
                        <v-container>
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Serial Number</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field
                                        v-model="installation.sN"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>                                                    
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Marque</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-select
                                        :items="brands"
                                        v-model="installation.brandId"
                                        label="Marque"
                                        auto
                                        required
                                        item-text="name"
                                        item-value="id"
                                    ></v-select>
                                </v-flex>
                            </v-layout> 
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Modèle</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field
                                        v-model="installation.model"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout> 
                             <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Type</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-select
                                        :items="types"
                                        v-model="installation.type"
                                        label="Type"
                                        auto
                                        required
                                        item-text="name"
                                        item-value="id"
                                    ></v-select>
                                </v-flex>
                            </v-layout>  
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Puissance</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field
                                        v-model="installation.power"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Capacité</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field
                                        v-model="installation.capacity"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout> 
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Customer</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-select
                                        id="selectCustomer"
                                        :items="customersItems"
                                        v-model="selectedCustomer"
                                        v-on:change="onChangeSelectCustomer"
                                        label="Client"
                                        auto
                                        required
                                        item-text="name"
                                        return-object="true"
                                    ></v-select>
                                </v-flex>
                            </v-layout> 
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Groupe d'installation</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-select
                                        id="selectInstallation"
                                        :items="installationGroupItems"
                                        v-model="installation.installation"
                                        label="Installation"
                                        auto
                                        required
                                    ></v-select>
                                </v-flex>
                            </v-layout>  
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Location</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field
                                        v-model="installation.location"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>                            
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Date d'installation</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field
                                        class="mr-2"
                                        label="Installation Date"
                                        append-icon="today"
                                        type="date"
                                        v-model="installation.installationDate"
                                        required
                                    ></v-text-field>   
                                </v-flex>
                            </v-layout> 
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>Remarque</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field textarea
                                        v-model="installation.comments"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>                                                       
                            <v-layout row>
                                <v-flex xs4>
                                </v-flex>
                                <v-flex xs8>
                                    <v-btn outline @click="submit" color="primary">Enregistrer</v-btn>
                                    <v-btn outline @click="clear">Reset</v-btn> 
                                </v-flex>
                            </v-layout>
                        </v-container>
                        </div>
                    </v-widget>
                </v-flex>
            </v-form>
        </v-content>
    </v-app>
</template>
<script>
import VWidget from '@/components/VWidget';
export default {
  name: 'add-installation',
  components: {
    VWidget
  },
  data: () => ({
    selectedCustomer:{},
    installationGroupItems:[],
    installation: {
        sN: "",
        brand: "",
        model: "",
        type:"",
        power:"",
        capacity:"",
        customerCompanyId: "",
        customerCompanyName: "",
        location:"",
        installation:"",
        installationDate:"",
        comments:""
    },
    brands : [
        {
            id:1,
            name:'Daikin'
        },
        {
            id:2,
            name:'Mitsubishi'
        }
    ],
    types : [
        {
            id:1,
            name:'xxxxxx'
        },
        {
            id:2,
            name:'AAAAAAAA'
        }
    ],
    customersItems : []
  }),
  methods: {
    submit() {
      this.installation.customerCompanyId = this.selectedCustomer.id;
      this.installation.customerCompanyName = this.selectedCustomer.name;
      const payload = this.installation;
      this.$store.dispatch("createInstallation", payload).then(this.createdDataCallback);
    },
    clear() {
      console.log("clear");
      this.$snotify.info({
        body: "My Notification Body",
        title: "Notification Title",
        config: {}
      });
    },
    onChangeSelectCustomer(){
        this.installationGroupItems = this.selectedCustomer.installations;
    },
    navigateTo(target) {
      this.$router.push(target);
    },
    customersDataCallback(response, error){
        if(error){
            //TODO
            console.log("Error: "+error);
        } else{
            this.customersItems = response;
        }
    },
    createdDataCallback(response, error){
        if(error){
            //TODO
            console.log("Error: "+error);
        } else{
            this.$snotify.success({
              title: "Installation créée avec succès",
              config: {}
            });
            navigateTo('/installation/'+response);
        }
    }
  },
  created:  function() {
    const payload={};
    this.$store.dispatch("fetchCustomers", payload).then(this.customersDataCallback);
  }
}
</script>
<style>
</style>