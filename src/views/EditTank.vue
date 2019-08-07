<template>
    <v-app>
        <navigation-drawer></navigation-drawer>
        <top-toolbar></top-toolbar>
        <v-content>
            <v-form v-model="valid" class="form-element">
                <v-flex sm12>
                    <h3>Editer bonbonne</h3>
                </v-flex>   
                <v-flex sm12>
                    <v-widget title="Fiche de la bonbonne">
                        <div slot="widget-content">
                        <v-container>
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Serial Number</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field
                                        v-model="text"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>                                                    
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Marque</v-subheader>
                                </v-flex>
                                <v-flex xs8>
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
                                <v-flex xs4>
                                    <v-subheader>Modèle</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field
                                        v-model="text"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout> 
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Puissance</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field
                                        v-model="text"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Capacité</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field
                                        v-model="text"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Serial Number</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field
                                        v-model="text"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>  
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Customer</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-select
                                        :items="customers"
                                        v-model="installation.customerId"
                                        label="Client"
                                        auto
                                        required
                                        item-text="name"
                                        item-value="id"
                                    ></v-select>
                                </v-flex>
                            </v-layout>  
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Location</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field
                                        v-model="text"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>                            
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Date d'installation</v-subheader>
                                </v-flex>
                                <v-flex xs8>
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
                                <v-flex xs4>
                                    <v-subheader>Remarque</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field textarea
                                        v-model="text"
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
  name: 'edit-tank',
  components: {
    VWidget
  },
  data: () => ({
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
    customers : [
        {
            id:1,
            name:'customer 1'
        },
        {
            id:2,
            name:'customer 2'
        }
    ],
    installation: {
        serialNumber: "",
        brandId: "",
        model:"",
        power:"",
        capacity:"",
        customerId:"",
        location:"",
        installationDate : "",
        comment:""        
    }
  }),

    methods: {
        submit () {
            console.log("validate");
        },
        clear () {
            this.installation = {};
        }
    }
}
</script>
<style>
</style>