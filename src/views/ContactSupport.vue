
<template>
    <v-app>
        <navigation-drawer></navigation-drawer>
        <top-toolbar></top-toolbar>
        <v-content>
            <v-form v-model="valid" class="form-element">
                <v-flex sm12 class="page-title">
                    <h3>{{ $t('views.contactSupport.title') }}</h3>
                </v-flex>   
                <v-flex sm12>
                    <v-widget :title='this.$i18n.t("views.contactSupport.form.title")'>
                        <div slot="widget-content">
                        <v-container>
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>{{ $t('views.contactSupport.form.subject') }}</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-select
                                        :items="dropDownItems"
                                        v-model="contact.subject"
                                        v-bind="name"
                                        :label='this.$i18n.t("dropdownMenus.contactSupport.placeHolder")'
                                        auto
                                        required
                                        item-text="name"
                                        item-value="id"
                                    ></v-select>
                                </v-flex>
                            </v-layout>                                                                        
                            <v-layout row>
                                <v-flex xs3>
                                    <v-subheader>{{ $t('views.contactSupport.form.message') }}</v-subheader>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field textarea
                                        v-model="contact.message"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs4>
                                </v-flex>
                                <v-flex xs8>
                                    <v-btn outline @click="submit" color="primary">{{ $t('views.contactSupport.form.send') }}</v-btn>
                                    <v-btn outline @click="navigateTo('/dashboard')">{{ $t('views.contactSupport.form.cancel') }}</v-btn> 
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
    contact: {
        subject: "",
        message: "",
    },
    // subjects : [
    //     {
    //         id:1,
    //         name: "Ajout d'utilisateurs"
    //     },
    //     {
    //         id:2,
    //         name:"Problème d'affichage"
    //     },
    //     {
    //         id:3,
    //         name:"Problème de sauvegarde"
    //     },
    //     {
    //         id:4,
    //         name:"Autre"
    //     }
    // ],    
  }),

    methods: {
        navigateTo(target) {
          this.$router.push(target);
        },
        submit () {
            console.log("validate");
            this.$snotify.success('Votre demande est en cours de traitement','Envoyé')
        },
        clear () {
            this.installation = {};
        }
    },
    computed: {
    dropDownItems: function() {
        return [
            {
                id:1,
                name: this.$i18n.t("dropdownMenus.contactSupport.addUsers")
            },
            {
                id:2,
                name: this.$i18n.t("dropdownMenus.contactSupport.displayProblem")
            },
            {
                id:3,
                name: this.$i18n.t("dropdownMenus.contactSupport.saveProblem")
            },
            {
                id:4,
                name: this.$i18n.t("dropdownMenus.contactSupport.other")
            }
        ]
    }
  },
}
</script>
<style>
</style>