<template>
  <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" :value="drawer" fixed app>
    <v-list dense>
      <template v-for="item in items">
        <v-layout v-if="item.heading" :key="item.heading" row align-center>
          <v-flex xs6>
            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
          </v-flex>
        </v-layout>
        <v-list-group
          v-else-if="item.children"
          v-model="item.model"
          :key="item.text"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          :append-icon="item.appendIcon? item.appendIcon : ''"
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title style="text-transform:uppercase;">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="(child, i) in item.children":key="i" :to='child.link' style="background-color:#F5F5F5">
            <v-list-tile-content>
              <v-list-tile-title style="margin-left:20px">{{ child.text }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="child.icon">
              <v-icon style="color:#757575!important;">{{ child.icon }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else :key="item.text" :to="item.link">
          <v-list-tile-action>
            <v-icon style="color:#5071b6!important;">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title style="text-transform:uppercase;">{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: "navigation-drawer",
  data() {
    return {
      items: [
        {
          icon: "dashboard",
          text: this.$i18n.t("navigationDrawer.menuItems.dashboard"),
          link: "/dashboard"
        },
        {
          icon: "battery_full",
          "icon-alt": "battery_full",
          appendIcon: "keyboard_arrow_down",
          text: this.$i18n.t("navigationDrawer.menuItems.tanksMenu.tanks"),
          model: true,
          children: [
            {
              icon: "format_align_justify",
              text: this.$i18n.t(
                "navigationDrawer.menuItems.tanksMenu.listing"
              ),
              link: "/allTanks"
            },
            {
              icon: "battery_full",
              text: this.$i18n.t(
                "navigationDrawer.menuItems.tanksMenu.available"
              ),
              link: "/availableTanks"
            },
            {
              icon: "battery_alert",
              text: this.$i18n.t(
                "navigationDrawer.menuItems.tanksMenu.toReturn"
              ),
              link: "/toSupplierTanks"
            },
            {
              icon: "local_shipping",
              text: this.$i18n.t("navigationDrawer.menuItems.tanksMenu.taken"),
              link: "/takenTanks"
            },
            {
              icon: "business",
              text: this.$i18n.t("navigationDrawer.menuItems.tanksMenu.onSite"),
              link: "/onSiteTanks"
            }
          ]
        },
        {
          icon: "library_books",
          "icon-alt": "library_books",
          appendIcon: "keyboard_arrow_down",
          text: this.$i18n.t(
            "navigationDrawer.menuItems.interventionsMenu.interventions"
          ),
          model: true,
          children: [
            {
              icon: "format_align_justify",
              text: this.$i18n.t(
                "navigationDrawer.menuItems.interventionsMenu.listing"
              ),
              link: "/interventions"
            }
          ]
        },
        {
          icon: "ac_unit",
          "icon-alt": "ac_unit",
          appendIcon: "keyboard_arrow_down",
          text: this.$i18n.t(
            "navigationDrawer.menuItems.installationsMenu.installations"
          ),
          model: true,
          children: [
            {
              icon: "format_align_justify",
              text: this.$i18n.t(
                "navigationDrawer.menuItems.installationsMenu.listing"
              ),
              link: "/installations"
          },
          {
            icon: "add",
            text: this.$i18n.t(
              "navigationDrawer.menuItems.installationsMenu.add"
            ),
            link: "/addInstallation"
          }
          ]
        },
        {
          icon: "people",
          "icon-alt": "people",
          appendIcon: "keyboard_arrow_down",
          text: this.$i18n.t(
            "navigationDrawer.menuItems.customersMenu.customers"
          ),
          model: true,
          children: [
            {
              icon: "format_align_justify",
              text: this.$i18n.t(
                "navigationDrawer.menuItems.customersMenu.listing"
              ),
              link: "/customers"
            },
            {
              icon: "add",
              text: this.$i18n.t(
                "navigationDrawer.menuItems.customersMenu.add"
              ),
              link: "/addCustomer"
            }
          ]
        },
        {
          icon: "directions_walk",
          "icon-alt": "directions_walk",
          appendIcon: "keyboard_arrow_down",
          text: this.$i18n.t(
            "navigationDrawer.menuItems.employeesMenu.employees"
          ),
          model: true,
          children: [
            {
              icon: "format_align_justify",
              text: this.$i18n.t(
                "navigationDrawer.menuItems.employeesMenu.listing"
              ),
              link: "/employees"
            }
            // { icon: 'add', text: 'Ajouter', link:'/addEmployee'}
          ]
        },
        {
          icon: "history",
          "icon-alt": "history",
          users: "keyboard_arrow_down",
          text: this.$i18n.t(
            "navigationDrawer.menuItems.gasAccountingMenu.gasAccounting"
          ),
          model: true,
          children: [
            {
              icon: "battery_full",
              text: this.$i18n.t(
                "navigationDrawer.menuItems.gasAccountingMenu.accountingByTank"
              ),
              link: "/gasAccountByTank"
            }
            // { icon: 'add', text: 'Ajouter', link:'/addEmployee'}
          ]
        }
        // {
        //   icon: "help",
        //   text: this.$i18n.t("navigationDrawer.menuItems.contactSupport"),
        //   link: "/contactSupport"
        // }
        // { icon: 'settings_overscan', text: 'QR Codes Generator', link: '/qrGenerator' }
        /*
        {
          icon: 'view_modules',
          'icon-alt': 'view_modules',
          'users':'keyboard_arrow_down',
          text: 'Modules',
          model: true,
          children: [
              { icon: '', text: 'Utilisateurs', link: '/dashboard'}
                // { icon: 'add', text: 'Ajouter', link:'/addEmployee'}
            ]
        },
        */
      ]
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push({path:target});
    }
  },
  computed: {
    drawer: function() {
      //   if (this.$store.getters.drawer) {
      //     return this.$store.getters.drawer;
      //   } else {
      //     return true;
      //   }
      return this.$store.getters.drawer;
    }
  },
  created: function() {
    this.$store.state.currentUser
      .getIdTokenResult()
      .then(idTokenResult => {
        if (!!idTokenResult.claims.vehicles) {
          const menuObj = {
            icon: "local_shipping",
            "icon-alt": "local_shipping",
            appendIcon: "keyboard_arrow_down",
            text: this.$i18n.t(
              "navigationDrawer.menuItems.vehiclesMenu.vehicles"
            ),
            model: true,
            children: [
              {
                icon: "format_align_justify",
                text: this.$i18n.t(
                  "navigationDrawer.menuItems.vehiclesMenu.listing"
                ),
                link: "/vehicles"
              }
            ]
          };
          this.items.splice(6, 0, menuObj);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
<style>
</style>
