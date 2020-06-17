<template>
 <v-container fluid>
 <v-row justify="center" class="text-center display-2 app-font-color" style="margin-top:.5em;">Brands</v-row>
 <v-row justify="center">
 <v-col class="title text-center" style="color:red">{{status}}</v-col>
 </v-row>
 <v-row justify="center">
 <v-col class="text-left display-1" cols="12" xs="4">
  <v-select 
      :items="brands" 
      item-text="name" 
      style="max-height: 50%;"
      item-value="id"
      @input="changeBrand"
      v-model="selectedid"

    >
    </v-select>
 </v-col>
 </v-row>

<div v-if="products.length > 0">
  <v-row justify="center" class="text-center headline">Items in Brand</v-row>
  <v-row justify="center" style="margin-top:1vh;">
    <v-col class="text-left display-2">
      <v-list style="max-height: 60vh;" class="overflow-y-auto products">
        <v-list-item-group>
          <v-list-item
            class="product"
            @click="popDialog(item)"
            v-for="(item, i) in products"
            :key="i"
            >
            <v-col style="width:25%;">
              <v-img
              :src="require(`../assets/${item.graphicName}.jpg`)"
              class="my-5"
              style="height:10vh;width:10vh;"
              aspect-ratio="1"
              />
            </v-col>
            <v-col style="width:75%;">
              <v-list-item-content>
                <v-list-item-title class="title" v-text="item.productName"></v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>
  </v-row>
 </div>

<v-dialog v-model="dialog" v-if="selectedProduct.hasOwnProperty('id')" justify="center" align="center">
  <v-card>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn text @click="dialog = false" style="font-size:XX-large;margin:1vw;">X</v-btn>
    </v-row>
    <v-row style="margin-left:3vw;margin-right:3vw;">
      <v-col class="title">{{selectedProduct.productName}}</v-col>
      <v-col>
        <label class="subtitle-1 float-right">{{selectedProduct.msrp | currency}}</label>
        <v-img
        :src="require(`../assets/${selectedProduct.graphicName}.jpg`)"
          height="25vh"
          width="25vh"
          contain
          aspect-ratio="1"
          />
      </v-col>
    </v-row>
    <v-row style="margin-left:5vw;margin-right:5vw;">
      <label for="" style="font-weight:500">Description:</label> 
      {{selectedProduct.description}}
    </v-row>
    <v-row style="margin-left:5vw;margin-right:5vw;">
      <label for="" style="font-weight:500; margin-right: 90px;">Cost Price: </label> 
      {{selectedProduct.costPrice | currency}}
    </v-row>
    <v-row style="margin-left:5vw;margin-right:5vw;">
      <label for="" style="font-weight:500; margin-right: 39px;">Quantity On Hand: </label> 
      {{selectedProduct.qtyOnHand }}
    </v-row>
    <v-row style="margin-left:5vw;margin-right:5vw;">
      <label for="" style="font-weight:500; margin-right: 21px;">Quantity Back Order: </label> 
      {{selectedProduct.qtyOnBackOrder }}
    </v-row>
   
    <v-row style="margin-left:3vw;">
      <v-col>Qty:</v-col>
      <v-col>
      <input
      type="number"
      maxlength="3"
      placeholder="enter qty"
      size="3"
      style="width: 15vw;border-bottom:solid;text-align:right"
      v-model="qty"
      />
      </v-col>
      <v-col cols="7"></v-col>
    </v-row>
    <v-row justify="center" align="center" style="margin-bottom:2vh;margin-left:3vw;">
      <v-col>
        <v-btn medium outlined color="accent" @click="addToCart">Add To Cart</v-btn>
      </v-col>
      <v-col>
        <v-btn medium outlined color="accent" @click="viewCart">View Cart</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" style="padding-bottom:5vh;">{{this.dialogStatus}}</v-row>
  </v-card>
 </v-dialog>

 <v-footer absolute class="headline">
 <v-col class="text-center" cols="12">
 &copy;{{ new Date().getFullYear() }} —
 INFO3067
 </v-col>
 </v-footer>
 </v-container>
</template>
<script>
  import fetcher from "../mixins/fetcher";
  export default {
    name: "BrandList",
    data() {
      return {
        brands: [],
        status: {},
        selectedid: 0,
        products: [],
        dialog: false,
        selectedProduct: {},
        dialogStatus: "",
        qty: 0,
        cart: []
      };
    },
    mixins: [fetcher],
    mounted: async function() {
      try {
      this.status = "fetching brands from server...";
      this.brands = await this.$_getdata("brand"); // fetchdata is in mixin
      this.status = `loaded ${this.brands.length + 1} brands`;
      this.brands.unshift({ name: "Current brands", id: 0 });
      } catch (err) {
      console.log(err);
      this.status = `Error has occured: ${err.message}`;
      }
      if (sessionStorage.getItem("cart")) {
        this.cart = await JSON.parse(sessionStorage.getItem("cart"));
      }
    },
    methods: {
      changeBrand: async function(brandid) {
        if (brandid > 0) {
          // don't use arrow function here
          try {
            this.status = `fetching items for ${brandid}...`;
            this.products = await this.$_getdata(`product/${brandid}`);
            this.status = `found ${this.products.length} items`;
          } catch (err) {
            console.log(err);
            this.status = `Error has occured: ${err.message}`;
          }
        }
      },
      popDialog: function(item) {
        this.dialogStatus = "";
        this.dialog = !this.dialog;
        this.selectedProduct = item;
      },
      addToCart: function() {
        
        const index = this.cart.findIndex(
          // is item already on the cart
          item => item.id === this.selectedProduct.id
        );
       
        if (this.qty !== "0") {
          index === -1
          ? this.cart.push({
            id: this.selectedProduct.id,
            qty:  parseInt(this.qty),
            product: this.selectedProduct
          }) // add
          : (this.cart[index] = {
            // replace
            id: this.selectedProduct.id,
            qty:  parseInt(this.qty),
            product: this.selectedProduct
          });

          this.dialogStatus = `${this.qty} item(s) added`;
        } else {
          index === -1 ? null : this.cart.splice(index, 1); // remove
          this.dialogStatus = `item(s) removed`;
        }

        sessionStorage.setItem("cart", JSON.stringify(this.cart));

        console.table(this.cart)
      },
      viewCart: function() {
        this.$router.push({
          name: "cart"
        });
      }
    }

  };

</script>
<style>
.product{
  margin: 60px;
  background: #fffefe;
  border-radius: 15px;
  -webkit-box-shadow: 4px 3px 6px 0px rgba(130,128,130,1);
  -moz-box-shadow: 4px 3px 6px 0px rgba(130,128,130,1);
  box-shadow: 4px 3px 6px 0px rgba(130,128,130,1);
}
.products{
  background: none !important;
}
.v-image__image, .v-image__placeholder{
  top:-10px !important;
}
</style>