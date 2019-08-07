<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <v-form class="form-element" v-if="showForm">
        <v-flex sm12 class="page-title">
          <span class="content-title">Create User</span>
        </v-flex>
        <v-flex sm12>
          <v-widget>
            <div slot="widget-content">
              <v-container class="widget-container">
                <v-layout wrap>
                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="user.userFirstName"
                      label="userFirstName"
                      :error-messages="userFirstNameErrors"
                      @input="$v.user.userFirstName.$touch()"
                      @blur="$v.user.userFirstName.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="user.userLastName"
                      label="userLastName"
                      :error-messages="userLastNameErrors"
                      @input="$v.user.userLastName.$touch()"
                      @blur="$v.user.userLastName.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="user.email"
                      label="email"
                      :error-messages="emailErrors"
                      @input="$v.user.email.$touch()"
                      @blur="$v.user.email.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="phoneNbr"
                      label="phoneNbr"
                      :error-messages="phoneNbrErrors"
                      @input="$v.phoneNbr.$touch()"
                      @blur="$v.phoneNbr.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="user.password"
                      label="password"
                      :error-messages="passwordErrors"
                      @input="$v.user.password.$touch()"
                      @blur="$v.user.password.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="user.tla"
                      label="Three Letters Acronym (TLA)"
                      :error-messages="tlaErrors"
                      @input="$v.user.tla.$touch()"
                      @blur="$v.user.tla.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="user.lng"
                      label="Language (fr, nl or en)"
                      :error-messages="lngErrors"
                      @input="$v.user.lng.$touch()"
                      @blur="$v.user.lng.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="user.compId"
                      label="compId"
                      :error-messages="compIdErrors"
                      @input="$v.user.compId.$touch()"
                      @blur="$v.user.compId.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="user.compName"
                      label="compName"
                      :error-messages="compNameErrors"
                      @input="$v.user.compName.$touch()"
                      @blur="$v.user.compName.$touch()"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12 text-xs-right>
                    <v-btn @click="submitUserCreationRequest" round color="secondary">Create User</v-btn>
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
import VWidget from "@/components/VWidget";
import { required, email } from "vuelidate/lib/validators";
const fb = require("../firebaseConfig.js");
export default {
  name: "create-user",
  components: {
    VWidget
  },
  data: () => ({
    showForm: false,
    user: {
      userFirstName: "",
      userLastName: "",
      email: "",
      password: "",
      tla: "",
      lng: "",
      phoneNbrs: [],
      compId: "GoREyzKNm5XvuWDABGvT",
      compName: "Veolia Luxembourg",
      userType: "refrigTechUser"
    },
    phoneNbr: ""
  }),
  validations: {
    user: {
      userFirstName: { required },
      userLastName: { required },
      email: { required, email },
      password: { required },
      tla: { required },
      lng: { required },
      compId: { required },
      compName: { required }
    },
    phoneNbr: { required }
  },
  computed: {
    userFirstNameErrors() {
      const errors = [];
      if (!this.$v.user.userFirstName.$dirty) return errors;
      !this.$v.user.userFirstName.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    userLastNameErrors() {
      const errors = [];
      if (!this.$v.user.userLastName.$dirty) return errors;
      !this.$v.user.userLastName.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.user.email.$dirty) return errors;
      !this.$v.user.email.required &&
        errors.push(this.$t("global.mandatoryField"));
      !this.$v.user.email.email && errors.push(this.$t("global.emailField"));
      return errors;
    },
    phoneNbrErrors() {
      const errors = [];
      if (!this.$v.phoneNbr.$dirty) return errors;
      !this.$v.phoneNbr.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.user.password.$dirty) return errors;
      !this.$v.user.password.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    tlaErrors() {
      const errors = [];
      if (!this.$v.user.tla.$dirty) return errors;
      !this.$v.user.tla.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    lngErrors() {
      const errors = [];
      if (!this.$v.user.lng.$dirty) return errors;
      !this.$v.user.lng.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    compIdErrors() {
      const errors = [];
      if (!this.$v.user.compId.$dirty) return errors;
      !this.$v.user.compId.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    compNameErrors() {
      const errors = [];
      if (!this.$v.user.compName.$dirty) return errors;
      !this.$v.user.compName.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    }
  },
  methods: {
    submitUserCreationRequest() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$snotify.error(
          this.$t("global.errorFieldsValidation"),
          this.$t("global.error"),
          {
            timeout: 3000,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          }
        );
      } else {
        this.user.phoneNbrs.push(this.phoneNbr);
        const payload = this.user;
        this.$store
          .dispatch("createUserCreationRequest", payload)
          .then(docRef => {
            this.$snotify.success(
              this.$t("global.saved"),
              this.$t("views.customers.add.customerSaved"),
              {
                timeout: 3500,
                showProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true
              }
            );
          });
      }
    }
  },
  created: function() {
    this.$store.state.currentUser
      .getIdTokenResult()
      .then(idTokenResult => {
        if (!!idTokenResult.claims.mainteneoAdminUser) {
          this.showForm = true;
        } else {
          this.showForm = false;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
<style scoped>
.widget-container {
  padding: 0px !important;
}
</style>