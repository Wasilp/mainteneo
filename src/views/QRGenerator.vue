<template>
  <v-app>
    <navigation-drawer></navigation-drawer>
    <top-toolbar></top-toolbar>
    <v-content>
      <div class="content">
        <v-flex sm12 class="page-title">
          <h3>Fiche Employé</h3>
        </v-flex>
        <v-card class="block-element">
          <v-layout row wrap>
            <v-flex lg6>
              <v-layout row wrap>
                <v-flex lg3>
                  <span>
                    <v-icon class="page-icon">settings_overscan</v-icon>
                  </span>
                </v-flex>
                <v-flex lg9>
                  <v-text-field v-model="qrCodeData.text"></v-text-field>
                  <v-select
                    :items="qrCodesTypes"
                    v-model="qrCodeData.type"
                    label="Type"
                    auto
                    required
                  ></v-select>
                  <v-select
                    :items="quantities"
                    v-model="qrCodeData.quantity"
                    label="Quantité"
                    auto
                    required
                  ></v-select>
                  <v-btn outline @click="generate" color="primary">Générer QR Codes</v-btn>
                  <v-btn outline @click="save">Sauver PDF</v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex lg6>
              <v-layout row wrap></v-layout>
            </v-flex>
          </v-layout>
        </v-card>
        <v-divider></v-divider>
        <v-flex lg12 class="block-element">
          <div id="qrcode"></div>
        </v-flex>
      </div>
    </v-content>
  </v-app>
</template>
<script>
/* From Vue Materiel Admin*/
import Material from "vuetify/es5/util/colors";
import MiniStatistic from "@/components/widgets/statistic/MiniStatistic";
import VWidget from "@/components/VWidget";
import QRCode from "@/components/QRCode/qrcode.js";
import QRCodeMin from "@/components/QRCode/qrcode.min.js";
import { mapState } from "vuex";
const fb = require("../firebaseConfig.js");
export default {
  name: "qrcode-generator",
  components: {
    QRCode,
    QRCodeMin
  },
  data() {
    return {
      qrCodeData: {},
      user: {},
      quantities: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      qrCodesTypes: ["tank", "installation"],
      color: Material
    };
  },
  methods: {
    navigateTo(target) {
      this.$router.push(target);
    },
    userDataCallback(response, error) {
      if (error) {
        //TODO
        console.log("Error: " + error);
      } else {
        this.user = response;
      }
    },
    generate() {
      var quantity = $("#quantity").val();
      if (!quantity || quantity <= 0) {
        alert("invalid quantity");
        return;
      }
      var type = $("#qrType").val();
      if (!type) {
        alert("invalid type");
        return;
      }
      // doc = new jsPDF();
      //mm size
      var qrSize = {
        height: 50,
        width: 50
      };
      var offset = {
        left: 10,
        top: 10,
        line: 1
      };
      var qrNbOnLine = 0;
      var maxLine = 4;
      for (let index = 0; index < quantity; index++) {
        var QRCodeData = {
          id: index,
          timestamp: new Date().getTime(),
          type: type,
          customerId: ""
        };
        var stringified = JSON.stringify(QRCodeData);
        makeCode(index, stringified);
        setTimeout(() => {
          var imageData = $("#qrcode")
            .find("img")[0]
            .currentSrc.toString();
          console.log(imageData);
          // doc.addImage(imageData, 'PNG', offset.left, offset.top, qrSize.height, qrSize.width);
          qrNbOnLine++;
          if (type == "tank") {
            if (qrNbOnLine > 3) {
            } else {
            }
          } else if (type == "engine") {
          }
        }, 1000);
      }
      alert("finished");
    },
    save() {
      // doc.save('test.pdf');
      alert("save");
    },
    makeCode(index, text) {
      if (!text) {
        alert("Input a text");
        return;
      }
      // var newDiv = document.createElement('div-'+index);
      var qrcodeDiv = new QRCode(document.getElementById("qrcode"), {
        width: 100,
        height: 100
      });
      qrcodeDiv.makeCode(text);
    }
  },
  computed: {},
  created: function() {
    const payload = {};
    if (this.$route.params.id) {
      payload.userId = this.$route.params.id;
    }
    // this.$store.dispatch("fetchUser", payload).then(this.userDataCallback);
  }
};
</script>
<style>
</style>