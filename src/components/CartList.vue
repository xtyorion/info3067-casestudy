<template>
  <v-container fluid>
    <v-row
      justify="center"
      class="text-center headline indigo--text"
      style="margin-top:2vh;"
    >Previous Orders</v-row>
    <v-row justify="center">
      <v-col class="title text-center" style="color:red">{{status}}</v-col>
    </v-row>
    <div v-if="carts.length > 0">
      <v-row justify="center" style="background-color:#e1ae2cs;margin:3vw;">
        <v-col class="text-center headline" cols="2">Id</v-col>
        <v-col cols="6" class="text-center headline">Date</v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-list style="max-height: 50vh;margin-top:-3vh;background-color: #fbda50" class="overflow-y-auto">
            <v-list-item-group>
              <v-list-item
              v-for="(cart, i) in carts"
              :key="i"
              style="border:solid;border-color:#e1ae2c;margin-left:3vw;margin-right:3vw;"
              @click="popDialog(cart)"
              >
              <v-col cols="3">
                <v-list-item-content>
                <v-list-item-title class="subtitle-2" v-text="cart.id">></v-list-item-title>
                </v-list-item-content>
              </v-col>
              <v-col cols="6">
                <v-list-item-content>
                <v-list-item-title
                class="sub-title2 text-left"
                v-text="formatDate(cart.dateCreated)"
                >></v-list-item-title>
                </v-list-item-content>
              </v-col>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="dialog" v-if="selectedCart" justify="center" align="center">
      <v-card>
        <v-row>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false" style="font-size:XX-large;margin:2vw;">X</v-btn>
        </v-row>
        <v-row
          class="headline"
          justify="center"
          align="center"
          style="margin-left:3vw;margin-right:3vw;color:purple"
        >Order #{{selectedCart.id}} ( {{formatDate(selectedCart.orderDate)}} )</v-row>
        <v-row>
          <v-col justify="center" align="center">
            <v-img
            :src="require('../assets/cart.png')"
            style="height:14vh;width:15vh;padding:0;"
            aspect-ratio="1"
            />
          </v-col>
        </v-row>
        <div style="margin:2vw;">
          <v-row justify="center" style="margin-top:2vh;margin:3vw;">
            <v-col cols="3" class="text-center">Name</v-col>
            <v-col cols="3" class="text-center">MSRP</v-col>
            <v-col cols="1" class="text-center">S</v-col>
            <v-col cols="1" class="text-center">O</v-col>
            <v-col cols="1" class="text-center">B</v-col>
            <v-col cols="3" class="text-center pad-5">Extended</v-col>


          </v-row>
          <v-row
          v-for="(detail, i) in details"
          :key="i"
          style="margin-bottom:0;margin-top:-2vh;padding-right:3vw;"
          >
            <v-col cols="3">{{detail.productName}}</v-col>
            <v-col cols="3">{{detail.msrp}}</v-col>
            <v-col cols="1" class="pad-5">{{detail.qtyS}}</v-col>
            <v-col cols="1" class="pad-5">{{detail.qtyO}}</v-col>
            <v-col cols="1" class="pad-5">{{detail.qtyB}}</v-col>
            <v-col cols="3" class="pad-5">{{detail.msrp * detail.qtyS | currency}}</v-col>
          </v-row>
        </div>
        <div style="margin:3vw;padding-left:5vw;padding-right:5vw">
          <v-row style="margin-bottom:0;margin-top:-2vh;">
            <v-col cols="8" class="text-right">Total:</v-col>
            <v-col cols="4" class="text-right">{{selectedCart.subTotal | currency}}</v-col>
          </v-row>
          <v-row style="margin-bottom:0;margin-top:-2vh;">
            <v-col cols="8" class="text-right">Tax:</v-col>
            <v-col cols="4" class="text-right">{{selectedCart.tax | currency}}</v-col>
          </v-row>
          <v-row style="margin-bottom:0;margin-top:-2vh;">
            <v-col cols="8" class="text-right">Order Total:</v-col>
            <v-col cols="4" class="text-right">{{selectedCart.total | currency}}</v-col>
          </v-row>
        </div>
        <v-row justify="center" align="center" style="padding-bottom:5vh;">{{this.dialogStatus}}</v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
  import fetcher from "../mixins/fetcher";
  import datertn from "../mixins/datertn";
  export default {
    name: "CartList",
    data() {
      return {
        carts: [],
        status: {},
        details: [],
        selectedCart: {},
        dialog: false,
        dialogStatus: {}
      };
    },
    mixins: [fetcher, datertn],
    beforeMount: async function() {
      try {
        let customer = JSON.parse(sessionStorage.getItem("customer"));
        this.status = "fetching carts from server...";
        let route = this.$_buildRouteWithParams("order", customer.email.trimEnd());
        this.carts = await this.$_getdata(route.slice(0, -1)); // in mixin
        this.status = `loaded ${this.carts.length} carts`;
      } catch (err) {
        console.log(err);
        this.status = `Error has occured: ${err.message}`;
      }
    },
    methods: {
      selectCart: async function(cartid) {
        if (cartid > 0) {
          // don't use arrow function here
          try {
            let customer = JSON.parse(sessionStorage.getItem("customer"));
            this.status = `fetching details for cart ${cartid}...`;
            let route = this.$_buildRouteWithParams(
              "order",
              cartid,
              customer.email.trimEnd()
            );
            this.details = await this.$_getdata(route.slice(0, -1)); // remove end /
            this.status = `found cart ${cartid} details`;
          } catch (err) {
            console.log(err);
            this.status = `Error has occured: ${err.message}`;
          }
        }
      },
      popDialog: async function(cart) {
        this.dialogStatus = "";
        this.dialog = !this.dialog;
        this.selectedCart = cart;
        this.selectedCart.subTotal = cart.orderAmount
        this.selectedCart.tax = cart.orderAmount * 0.13
        this.selectedCart.total = this.selectedCart.subTotal + this.selectedCart.tax
        await this.selectCart(cart.id);
      }
    }

  };
</script>

<style>
.pad-5{
  padding-left: 5px !important;
  padding-right: 5px !important;
}
</style>
