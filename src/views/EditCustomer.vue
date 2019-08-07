<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <v-form class="form-element">
        <v-flex sm12 class="page-title">
          <span class="content-title">{{ $t('views.customers.edit.title') }}</span>
        </v-flex>
        <v-flex sm12>
          <v-widget :title="this.$i18n.t('views.customers.add.form.title')">
            <div slot="widget-content">
              <v-container class="widget-container">
                <v-layout wrap>
                  <v-flex xs11 md6 class="px-3 pt-1 pb-2" v-if="showCustomerGroupsUI">
                    <v-autocomplete
                      :items="groups"
                      v-model="customer.group"
                      flat
                      hint="Champ non obligatoire"
                      persistent-hint
                      :label="this.$t('views.customers.add.form.group')"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs1 md1 class="px-3 pt-1 pb-2" v-if="showCustomerGroupsUI">
                    <div style="padding-top: 8px;">
                      <v-btn flat icon color="secondary" @click="groupDialog = true">
                        <v-icon>add_circle_outline</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="customer.name"
                      :label="this.$t('views.customers.add.form.name')"
                      :error-messages="nameErrors"
                      @input="$v.customer.name.$touch()"
                      @blur="$v.customer.name.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 md6 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="customer.phoneNbrs"
                      :label="this.$t('views.customers.add.form.phone')"
                      :error-messages="phoneNbrsErrors"
                      @input="$v.customer.phoneNbrs.$touch()"
                      @blur="$v.customer.phoneNbrs.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 md6 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="customer.email"
                      :label="this.$t('views.customers.add.form.email')"
                      :error-messages="emailErrors"
                      @input="$v.customer.email.$touch()"
                      @blur="$v.customer.email.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="customer.mainAddress"
                      :label="this.$t('views.customers.add.form.address')"
                      :error-messages="mainAddressErrors"
                      @input="$v.customer.mainAddress.$touch()"
                      @blur="$v.customer.mainAddress.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 md2 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="customer.mainZipCode"
                      :label="this.$t('views.customers.add.form.postalCode')"
                      :error-messages="mainZipCodeErrors"
                      @input="$v.customer.mainZipCode.$touch()"
                      @blur="$v.customer.mainZipCode.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 md5 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="customer.mainCity"
                      :label="this.$t('views.customers.add.form.city')"
                      :error-messages="mainCityErrors"
                      @input="$v.customer.mainCity.$touch()"
                      @blur="$v.customer.mainCity.$touch()"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 md5 class="px-3 pt-1 pb-2">
                    <v-select
                      v-model="customer.mainCountry"
                      :hint="`${customer.mainCountry}`"
                      :items="countriesItems"
                      item-text="name"
                      item-value="code"
                      :label="this.$t('views.customers.add.form.country')"
                      persistent-hint
                      single-line
                      :error-messages="mainCountryErrors"
                      @input="$v.customer.mainCountry.$touch()"
                      @blur="$v.customer.mainCountry.$touch()"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 md6 class="px-3 pt-1 pb-2">
                    <v-text-field
                      v-model.trim="customer.vat"
                      :label="this.$t('views.customers.add.form.vat')"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12 text-xs-right>
                    <v-btn
                      @click="submit"
                      round
                      color="secondary"
                    >{{ $t('views.customers.add.form.save') }}</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </div>
          </v-widget>
        </v-flex>
      </v-form>
      <v-dialog v-model="groupDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ $t('views.customers.add.addGroup') }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-sm>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model.trim="newGroup"
                    :label="this.$t('views.customers.add.groupName')"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              flat
              round
              @click="groupDialog = false"
            >{{ $t('global.cancel') }}</v-btn>
            <v-btn color="secondary" flat round @click="addGroup">{{ $t('global.save') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>
<script>
import VWidget from "@/components/VWidget";
import { required, email } from "vuelidate/lib/validators";
export default {
  name: "add-customer",
  components: {
    VWidget
  },
  data: () => ({
    groupDialog: false,
    newGroup: null,
    groups: [],
    customer: {
      name: "",
      group: "",
      phoneNbrs: "",
      email: "",
      mainAddress: "",
      mainCity: "",
      mainZipCode: "",
      mainCountry: "",
      vat: ""
    },
    countriesItems: [
      { name: "Afghanistan", code: "AF" },
      { name: "Åland Islands", code: "AX" },
      { name: "Albania", code: "AL" },
      { name: "Algeria", code: "DZ" },
      { name: "American Samoa", code: "AS" },
      { name: "AndorrA", code: "AD" },
      { name: "Angola", code: "AO" },
      { name: "Anguilla", code: "AI" },
      { name: "Antarctica", code: "AQ" },
      { name: "Antigua and Barbuda", code: "AG" },
      { name: "Argentina", code: "AR" },
      { name: "Armenia", code: "AM" },
      { name: "Aruba", code: "AW" },
      { name: "Australia", code: "AU" },
      { name: "Austria", code: "AT" },
      { name: "Azerbaijan", code: "AZ" },
      { name: "Bahamas", code: "BS" },
      { name: "Bahrain", code: "BH" },
      { name: "Bangladesh", code: "BD" },
      { name: "Barbados", code: "BB" },
      { name: "Belarus", code: "BY" },
      { name: "Belgium", code: "BE" },
      { name: "Belize", code: "BZ" },
      { name: "Benin", code: "BJ" },
      { name: "Bermuda", code: "BM" },
      { name: "Bhutan", code: "BT" },
      { name: "Bolivia", code: "BO" },
      { name: "Bosnia and Herzegovina", code: "BA" },
      { name: "Botswana", code: "BW" },
      { name: "Bouvet Island", code: "BV" },
      { name: "Brazil", code: "BR" },
      { name: "British Indian Ocean Territory", code: "IO" },
      { name: "Brunei Darussalam", code: "BN" },
      { name: "Bulgaria", code: "BG" },
      { name: "Burkina Faso", code: "BF" },
      { name: "Burundi", code: "BI" },
      { name: "Cambodia", code: "KH" },
      { name: "Cameroon", code: "CM" },
      { name: "Canada", code: "CA" },
      { name: "Cape Verde", code: "CV" },
      { name: "Cayman Islands", code: "KY" },
      { name: "Central African Republic", code: "CF" },
      { name: "Chad", code: "TD" },
      { name: "Chile", code: "CL" },
      { name: "China", code: "CN" },
      { name: "Christmas Island", code: "CX" },
      { name: "Cocos (Keeling) Islands", code: "CC" },
      { name: "Colombia", code: "CO" },
      { name: "Comoros", code: "KM" },
      { name: "Congo", code: "CG" },
      { name: "Congo, The Democratic Republic of the", code: "CD" },
      { name: "Cook Islands", code: "CK" },
      { name: "Costa Rica", code: "CR" },
      { name: "Cote D'Ivoire", code: "CI" },
      { name: "Croatia", code: "HR" },
      { name: "Cuba", code: "CU" },
      { name: "Cyprus", code: "CY" },
      { name: "Czech Republic", code: "CZ" },
      { name: "Denmark", code: "DK" },
      { name: "Djibouti", code: "DJ" },
      { name: "Dominica", code: "DM" },
      { name: "Dominican Republic", code: "DO" },
      { name: "Ecuador", code: "EC" },
      { name: "Egypt", code: "EG" },
      { name: "El Salvador", code: "SV" },
      { name: "Equatorial Guinea", code: "GQ" },
      { name: "Eritrea", code: "ER" },
      { name: "Estonia", code: "EE" },
      { name: "Ethiopia", code: "ET" },
      { name: "Falkland Islands (Malvinas)", code: "FK" },
      { name: "Faroe Islands", code: "FO" },
      { name: "Fiji", code: "FJ" },
      { name: "Finland", code: "FI" },
      { name: "France", code: "FR" },
      { name: "French Guiana", code: "GF" },
      { name: "French Polynesia", code: "PF" },
      { name: "French Southern Territories", code: "TF" },
      { name: "Gabon", code: "GA" },
      { name: "Gambia", code: "GM" },
      { name: "Georgia", code: "GE" },
      { name: "Germany", code: "DE" },
      { name: "Ghana", code: "GH" },
      { name: "Gibraltar", code: "GI" },
      { name: "Greece", code: "GR" },
      { name: "Greenland", code: "GL" },
      { name: "Grenada", code: "GD" },
      { name: "Guadeloupe", code: "GP" },
      { name: "Guam", code: "GU" },
      { name: "Guatemala", code: "GT" },
      { name: "Guernsey", code: "GG" },
      { name: "Guinea", code: "GN" },
      { name: "Guinea-Bissau", code: "GW" },
      { name: "Guyana", code: "GY" },
      { name: "Haiti", code: "HT" },
      { name: "Heard Island and Mcdonald Islands", code: "HM" },
      { name: "Holy See (Vatican City State)", code: "VA" },
      { name: "Honduras", code: "HN" },
      { name: "Hong Kong", code: "HK" },
      { name: "Hungary", code: "HU" },
      { name: "Iceland", code: "IS" },
      { name: "India", code: "IN" },
      { name: "Indonesia", code: "ID" },
      { name: "Iran, Islamic Republic Of", code: "IR" },
      { name: "Iraq", code: "IQ" },
      { name: "Ireland", code: "IE" },
      { name: "Isle of Man", code: "IM" },
      { name: "Israel", code: "IL" },
      { name: "Italy", code: "IT" },
      { name: "Jamaica", code: "JM" },
      { name: "Japan", code: "JP" },
      { name: "Jersey", code: "JE" },
      { name: "Jordan", code: "JO" },
      { name: "Kazakhstan", code: "KZ" },
      { name: "Kenya", code: "KE" },
      { name: "Kiribati", code: "KI" },
      { name: "Korea, Democratic People'S Republic of", code: "KP" },
      { name: "Korea, Republic of", code: "KR" },
      { name: "Kuwait", code: "KW" },
      { name: "Kyrgyzstan", code: "KG" },
      { name: "Lao People'S Democratic Republic", code: "LA" },
      { name: "Latvia", code: "LV" },
      { name: "Lebanon", code: "LB" },
      { name: "Lesotho", code: "LS" },
      { name: "Liberia", code: "LR" },
      { name: "Libyan Arab Jamahiriya", code: "LY" },
      { name: "Liechtenstein", code: "LI" },
      { name: "Lithuania", code: "LT" },
      { name: "Luxembourg", code: "LU" },
      { name: "Macao", code: "MO" },
      { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
      { name: "Madagascar", code: "MG" },
      { name: "Malawi", code: "MW" },
      { name: "Malaysia", code: "MY" },
      { name: "Maldives", code: "MV" },
      { name: "Mali", code: "ML" },
      { name: "Malta", code: "MT" },
      { name: "Marshall Islands", code: "MH" },
      { name: "Martinique", code: "MQ" },
      { name: "Mauritania", code: "MR" },
      { name: "Mauritius", code: "MU" },
      { name: "Mayotte", code: "YT" },
      { name: "Mexico", code: "MX" },
      { name: "Micronesia, Federated States of", code: "FM" },
      { name: "Moldova, Republic of", code: "MD" },
      { name: "Monaco", code: "MC" },
      { name: "Mongolia", code: "MN" },
      { name: "Montserrat", code: "MS" },
      { name: "Morocco", code: "MA" },
      { name: "Mozambique", code: "MZ" },
      { name: "Myanmar", code: "MM" },
      { name: "Namibia", code: "NA" },
      { name: "Nauru", code: "NR" },
      { name: "Nepal", code: "NP" },
      { name: "Netherlands", code: "NL" },
      { name: "Netherlands Antilles", code: "AN" },
      { name: "New Caledonia", code: "NC" },
      { name: "New Zealand", code: "NZ" },
      { name: "Nicaragua", code: "NI" },
      { name: "Niger", code: "NE" },
      { name: "Nigeria", code: "NG" },
      { name: "Niue", code: "NU" },
      { name: "Norfolk Island", code: "NF" },
      { name: "Northern Mariana Islands", code: "MP" },
      { name: "Norway", code: "NO" },
      { name: "Oman", code: "OM" },
      { name: "Pakistan", code: "PK" },
      { name: "Palau", code: "PW" },
      { name: "Palestinian Territory, Occupied", code: "PS" },
      { name: "Panama", code: "PA" },
      { name: "Papua New Guinea", code: "PG" },
      { name: "Paraguay", code: "PY" },
      { name: "Peru", code: "PE" },
      { name: "Philippines", code: "PH" },
      { name: "Pitcairn", code: "PN" },
      { name: "Poland", code: "PL" },
      { name: "Portugal", code: "PT" },
      { name: "Puerto Rico", code: "PR" },
      { name: "Qatar", code: "QA" },
      { name: "Reunion", code: "RE" },
      { name: "Romania", code: "RO" },
      { name: "Russian Federation", code: "RU" },
      { name: "RWANDA", code: "RW" },
      { name: "Saint Helena", code: "SH" },
      { name: "Saint Kitts and Nevis", code: "KN" },
      { name: "Saint Lucia", code: "LC" },
      { name: "Saint Pierre and Miquelon", code: "PM" },
      { name: "Saint Vincent and the Grenadines", code: "VC" },
      { name: "Samoa", code: "WS" },
      { name: "San Marino", code: "SM" },
      { name: "Sao Tome and Principe", code: "ST" },
      { name: "Saudi Arabia", code: "SA" },
      { name: "Senegal", code: "SN" },
      { name: "Serbia and Montenegro", code: "CS" },
      { name: "Seychelles", code: "SC" },
      { name: "Sierra Leone", code: "SL" },
      { name: "Singapore", code: "SG" },
      { name: "Slovakia", code: "SK" },
      { name: "Slovenia", code: "SI" },
      { name: "Solomon Islands", code: "SB" },
      { name: "Somalia", code: "SO" },
      { name: "South Africa", code: "ZA" },
      { name: "South Georgia and the South Sandwich Islands", code: "GS" },
      { name: "Spain", code: "ES" },
      { name: "Sri Lanka", code: "LK" },
      { name: "Sudan", code: "SD" },
      { name: "Suriname", code: "SR" },
      { name: "Svalbard and Jan Mayen", code: "SJ" },
      { name: "Swaziland", code: "SZ" },
      { name: "Sweden", code: "SE" },
      { name: "Switzerland", code: "CH" },
      { name: "Syrian Arab Republic", code: "SY" },
      { name: "Taiwan, Province of China", code: "TW" },
      { name: "Tajikistan", code: "TJ" },
      { name: "Tanzania, United Republic of", code: "TZ" },
      { name: "Thailand", code: "TH" },
      { name: "Timor-Leste", code: "TL" },
      { name: "Togo", code: "TG" },
      { name: "Tokelau", code: "TK" },
      { name: "Tonga", code: "TO" },
      { name: "Trinidad and Tobago", code: "TT" },
      { name: "Tunisia", code: "TN" },
      { name: "Turkey", code: "TR" },
      { name: "Turkmenistan", code: "TM" },
      { name: "Turks and Caicos Islands", code: "TC" },
      { name: "Tuvalu", code: "TV" },
      { name: "Uganda", code: "UG" },
      { name: "Ukraine", code: "UA" },
      { name: "United Arab Emirates", code: "AE" },
      { name: "United Kingdom", code: "GB" },
      { name: "United States", code: "US" },
      { name: "United States Minor Outlying Islands", code: "UM" },
      { name: "Uruguay", code: "UY" },
      { name: "Uzbekistan", code: "UZ" },
      { name: "Vanuatu", code: "VU" },
      { name: "Venezuela", code: "VE" },
      { name: "Viet Nam", code: "VN" },
      { name: "Virgin Islands, British", code: "VG" },
      { name: "Virgin Islands, U.S.", code: "VI" },
      { name: "Wallis and Futuna", code: "WF" },
      { name: "Western Sahara", code: "EH" },
      { name: "Yemen", code: "YE" },
      { name: "Zambia", code: "ZM" },
      { name: "Zimbabwe", code: "ZW" }
    ],
    showCustomerGroupsUI: false
  }),
  validations: {
    customer: {
      name: { required },
      phoneNbrs: { required },
      email: { required, email },
      mainAddress: { required },
      mainCity: { required },
      mainZipCode: { required },
      mainCountry: { required }
    }
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.customer.name.$dirty) return errors;
      !this.$v.customer.name.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    phoneNbrsErrors() {
      const errors = [];
      if (!this.$v.customer.phoneNbrs.$dirty) return errors;
      !this.$v.customer.phoneNbrs.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.customer.email.$dirty) return errors;
      !this.$v.customer.email.required &&
        errors.push(this.$t("global.mandatoryField"));
      !this.$v.customer.email.email &&
        errors.push(this.$t("global.emailField"));
      return errors;
    },
    mainAddressErrors() {
      const errors = [];
      if (!this.$v.customer.mainAddress.$dirty) return errors;
      !this.$v.customer.mainAddress.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    mainCityErrors() {
      const errors = [];
      if (!this.$v.customer.mainCity.$dirty) return errors;
      !this.$v.customer.mainCity.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    mainZipCodeErrors() {
      const errors = [];
      if (!this.$v.customer.mainZipCode.$dirty) return errors;
      !this.$v.customer.mainZipCode.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    },
    mainCountryErrors() {
      const errors = [];
      if (!this.$v.customer.mainCountry.$dirty) return errors;
      !this.$v.customer.mainCountry.required &&
        errors.push(this.$t("global.mandatoryField"));
      return errors;
    }
  },
  methods: {
    submit() {
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
        const phoneArray = [];
        phoneArray.push(this.customer.phoneNbrs);
        this.customer.phoneNbrs = phoneArray;
        const customerId = this.$route.params.id;
        const payload = {
          updatedCustomer: this.customer,
          customerId: customerId
        };
        if (!this.showCustomerGroupsUI) {
          delete payload.group;
        }
        this.$store.dispatch("updateCustomer", payload).then(docRef => {
          this.$snotify.success(
            this.$t("views.customers.add.form.customerSaved"),
            this.$t("global.saved"),
            {
              timeout: 3500,
              showProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true
            }
          );
          this.$router.push("/customer/" + customerId);
        });
      }
    },
    addGroup() {
      if (this.newGroup !== null && this.newGroup !== "") {
        const groupsArray = this.groups;
        groupsArray.push(this.newGroup);
        groupsArray.sort();
        this.groups = groupsArray;

        this.$store
          .dispatch("updateGroups", this.groups)
          .then(() => {
            this.$snotify.success(
              this.$t("views.customers.add.groupSaved"),
              this.$t("global.saved"),
              {
                timeout: 3500,
                showProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true
              }
            );
            this.groupDialog = false;
            this.customer.group = this.newGroup;
          })
          .catch(err => {
            console.log("Error getting document", err);
          });
      } else {
        this.$snotify.error(
          this.$t("views.customers.add.groupNameEmpty"),
          this.$t("global.error"),
          {
            timeout: 3000,
            showProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true
          }
        );
      }
    }
  },
  created: function() {
    const payload = {};
    if (this.$route.params.id) {
      payload.customerId = this.$route.params.id;
    }

    this.$store.state.currentUser
      .getIdTokenResult()
      .then(idTokenResult => {
        if (!!idTokenResult.claims.customerGroups) {
          this.showCustomerGroupsUI = true;
        } else {
          this.showCustomerGroupsUI = false;
        }
      })
      .catch(error => {
        console.log(error);
      });

    this.$store
      .dispatch("fetchCustomer", payload)
      .then(doc => {
        if (doc.exists) {
          let c = doc.data();
          c.phoneNbrs = c.phoneNbrs[0];
          c.id = doc.id;
          this.customer = c;
        } else {
          console.log("No such document!");
        }
        //TODO: only if showCustomerGroupsUI = true;
        return this.$store.dispatch("fetchGroups");
      })
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          if (doc.data().groupNames) {
            this.groups = doc.data().groupNames;
          }
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }
};
</script>
<style scoped>
.widget-container {
  padding: 0px !important;
}
</style>