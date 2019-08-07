<template>
  <v-card>
    <v-toolbar card color="white">
      <v-text-field
        flat
        solo
        prepend-icon="search"
        :placeholder="this.$i18n.t('dataTables.installationInternalUnitsTable.search')"
        v-model="search"
        hide-details
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-btn icon>
        <v-icon>filter_list</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <v-data-table
        :headers="headers"
        :search="search"
        :items="internalUnits"
        :rows-per-page-items="[10,25,50,{text:'All','value':-1}]"
        :pagination.sync="pagination"
        class="elevation-"
        item-key="id"
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td class>{{ props.item.brand }}</td>
            <td class>{{ props.item.model }}</td>
            <td class>{{ externalUnitType(props.item.unitType) }}</td>
            <td class>{{ props.item.location }}</td>
            <td class>{{ props.item.sN }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "intervention-internal-units-table",
  props: ["internalUnits"],
  data() {
    return {
      search: "",
      pagination: {},
      internalUnitTypes: []
    };
  },
  methods: {
    externalUnitType(t) {
      const filteredArray = this.internalUnitTypes.filter(obj => {
        return obj.key == t;
      });
      return filteredArray[0].value;
    }
  },
  computed: {
    headers: function() {
      return [
        {
          text: this.$i18n.t(
            "dataTables.installationInternalUnitsTable.headers.brand"
          ),
          value: "brand"
        },
        {
          text: this.$i18n.t(
            "dataTables.installationInternalUnitsTable.headers.model"
          ),
          value: "model"
        },
        {
          text: this.$i18n.t(
            "dataTables.installationInternalUnitsTable.headers.unitType"
          ),
          value: "unitType"
        },
        {
          text: this.$i18n.t(
            "dataTables.installationInternalUnitsTable.headers.location"
          ),
          value: "location"
        },
        {
          text: this.$i18n.t(
            "dataTables.installationInternalUnitsTable.headers.sn"
          ),
          value: "sN"
        }
      ];
    }
  },
  mounted: function() {
    const internalUnitTypes = this.$t("views.installation.internalUnitTypes");
    for (let key in internalUnitTypes) {
      if (internalUnitTypes.hasOwnProperty(key)) {
        this.internalUnitTypes.push({
          key: key,
          value: internalUnitTypes[key]
        });
      }
    }
  }
};
</script>
<style>
</style>