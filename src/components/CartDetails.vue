<template>
  <v-container class="app-font-color">
    <v-row justify="center">
      <v-col class="display-1 text-center">Cart Contents</v-col>
    </v-row>
    <v-row>
      <v-col justify="center" align="center">
        <v-img
        :src="require('../assets/cart.png')"
        style="height:13vh;width:13.7vh;"
        aspect-ratio="1"
        />
      </v-col>
    </v-row>
    <v-row style="margin:2vw;">{{status}}</v-row>

    <div v-if="!this.status">
      <v-row style="margin-left:2vw;">
        <v-col><label class="text-left">#</label> </v-col>
        <v-col><label class="text-left">Name</label> </v-col>
        <v-col><label class="text-left">Qty</label> </v-col>
        <v-col><label class="text-left">Price</label> </v-col>
        <v-col><label class="text-left">Ext</label> </v-col>
      </v-row>
      <v-row style="margin-left:2vw;margin-right:2vw;" v-for="cartItem in cart" :key="cartItem.id">
        <v-col><label class="text-left">{{ cartItem.product.id }}</label> </v-col>
        <v-col><label class="text-left">{{ cartItem.product.productName }}</label> </v-col>
        <v-col><label class="text-left">{{ cartItem.qty }}</label> </v-col>
        <v-col><label class="text-left">{{ cartItem.product.msrp | currency}}</label> </v-col>
        <v-col><label class="text-left">{{ cartItem.total | currency}}</label> </v-col>
      </v-row>
      <v-row style="margin-left:2vw;margin-right:2vw;">
        <v-col><label class="text-left"></label> </v-col>
        <v-col><label class="text-left"></label> </v-col>
        <v-col><label class="text-left"></label> </v-col>
        <v-col><label class="text-left">subtotal:</label> </v-col>
        <v-col style="border-top: 1px solid black"><label class="text-left">{{subTotal | currency}}</label> </v-col>
      </v-row>

      <v-row style="margin-left:2vw;margin-right:2vw;">
        <v-col><label class="text-left"></label> </v-col>
        <v-col><label class="text-left"></label> </v-col>
        <v-col><label class="text-left"></label> </v-col>
        <v-col><label class="text-left">tax:</label> </v-col>
        <v-col><label class="text-left">{{tax | currency}}</label> </v-col>
      </v-row>

       <v-row style="margin-left:2vw;margin-right:2vw;">
        <v-col><label class="text-left"></label> </v-col>
        <v-col><label class="text-left"></label> </v-col>
        <v-col><label class="text-left"></label> </v-col>
        <v-col><label class="text-left">carttotal:</label> </v-col>
        <v-col><label class="text-left">{{cartTotal | currency}}</label> </v-col>
      </v-row>

      <v-row style="margin-top: 20px; margin-left:2vw;margin-bottom:50px">
        <v-col justify="center" align="center">
          <v-btn medium outlined color="default" @click="clearCart" style="padding: 20px">Clear Cart</v-btn>
        </v-col>
         <v-col justify="center" align="center">
          <v-btn medium outlined color="default" @click="addOrder" style="padding: 20px">Save</v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import fetcher from "../mixins/fetcher";
export default {
  name: "CartDetails",
  data() {
    return {
      subTotal: 0,
      tax: 0,
      cartTotal: 0,
      cart: [],
      status: ""
    };
  },
  beforeMount: function() {
    if (sessionStorage.getItem("cart")) {
      this.cart = JSON.parse(sessionStorage.getItem("cart"));

      this.cart.map(cartItem => {
        
        cartItem.total = parseInt(cartItem.qty) * cartItem.product.msrp
        this.subTotal = this.subTotal +  cartItem.total
        this.tax = this.subTotal * 0.13
        this.cartTotal = this.subTotal + this.tax

      });
      console.log("Cart", this.cart);
    } else {

      this.cart = [];
      
    }
  },
  mixins: [fetcher],
  methods: {
    clearCart: function() {
      sessionStorage.removeItem("cart");
      this.cart = [];
      this.subTotal = 0;
      this.tax = 0;
      this.cartTotal = 0;
      this.status = "cart cleared";
    },
    addOrder: async function() {
      let customer = JSON.parse(sessionStorage.getItem("customer"));
      let cart = JSON.parse(sessionStorage.getItem("cart"));
      try {
        this.status = "sending order info to server";
        let orderHelper = { email: customer.email, selections: cart };
        let payload = await this.$_postdata("order", orderHelper); // in mixin
        if (payload.indexOf("not") > 0) {
          this.status = payload;
        } else {
          this.clearCart();
          this.status = payload;
        }
      } catch (err) {
        console.log(err);
        this.status = `Error add order: ${err}`;
      }
    }

  }
};
</script>