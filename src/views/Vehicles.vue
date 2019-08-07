<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-container>
          <v-layout row wrap>
            <v-flex xs6 page-title>
              <span class="content-title">{{ $t('views.vehicles.title') }}</span>
            </v-flex>
            <v-flex xs2 text-xs-right>
              <div class="datatable-topbar-button">
                <v-btn fab dark color="secondary" @click="dialog = true">
                  <v-icon dark>add</v-icon>
                </v-btn>
              </div>
            </v-flex>
            <v-flex xs8>
              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-text-field v-model="editedItem.name" label="Nom du Véhicule"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" flat @click="close">Cancel</v-btn>
                    <v-btn color="secondary" flat @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-data-table
                hide-headers
                :items="vehicleNames"
                :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                  <td class="justify-center layout px-0">
                    <v-icon
                      size="20"
                      color="#5071b6"
                      class="mr-2"
                      @click="editItem(props.item)"
                    >edit</v-icon>
                    <v-icon size="20" color="#5071b6" @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </template>
                <template
                  v-slot:no-data
                >Aucun véhicule. Veuillez utiliser le bouton "+" pour ajouter un véhicule.</template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-content>
  </v-app>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "vehicles",
  data() {
    return {
      dialog: false,
      vehicleNames: [],

      editedIndex: -1,
      editedItem: {
        name: ""
      },
      defaultItem: {
        name: ""
      }
    };
  },
  computed: {
    ...mapState(["userProfile"]),
    formTitle() {
      return this.editedIndex === -1
        ? "Nouveau Véhicule"
        : "Modifier le Véhicule";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },

    editItem(item) {
      this.editedIndex = this.vehicleNames.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.vehicleNames.indexOf(item);
      confirm("Etes vous sûr de vouloir supprimer ce véhicule?") &&
        this.vehicleNames.splice(index, 1);
      this.saveToDatabase();
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.vehicleNames[this.editedIndex], this.editedItem);
      } else {
        this.vehicleNames.push(this.editedItem);
      }
      this.saveToDatabase();
      this.close();
    },

    saveToDatabase() {
      let payload = [];
      for (const v of this.vehicleNames) {
        payload.push(v.name);
      }

      this.$store
        .dispatch("updateVehicles", payload.sort())
        .then(() => {
          this.$snotify.success(
            "Votre modidification a bien été enregistrée.",
            this.$t("global.saved"),
            {
              timeout: 3500,
              showProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true
            }
          );
          this.groupDialog = false;
        })
        .catch(err => {
          console.log("Error getting document", err);
          this.$snotify.error(err, this.$t("global.error"), {
            timeout: 3000,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          });
        });
    }
  },

  created() {
    this.$store
      .dispatch("fetchVehicles")
      .then(doc => {
        if (!doc.exists) {
          //TODO: Deal with error
          console.log("No such document!");
        } else {
          if (doc.data().names) {
            var namesObjs = doc.data().names.map(val => {
              return {
                name: val
              };
            });
            this.vehicleNames = namesObjs;
          }
        }
      })
      .catch(err => {
        //TODO: Deal with error
        console.log("Error getting document", err);
      });
  }
};
</script>
<style>
</style>