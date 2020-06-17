<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col class="title text-center">Find Some Branches Near You</v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
        <v-text-field color="primary" label="Enter address" v-model="address" required></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-btn
        @click="getLatAndLng(), dialog = true"
        :class=" { 'purple darken-4 white--text' :valid, disabled: !valid }"
      >Locate</v-btn>
    </v-row>
    <v-dialog v-model="dialog" v-if="dialog" justify="center" align="center">
      <v-card>
        <v-row>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false" style="font-size:XX-large;margin:1vw;">X</v-btn>
        </v-row>
        <v-row align="center" justify="center">
          <v-col class="title text-center">3 closest branches</v-col>
        </v-row>
        <v-row justify="center">
          <div
            id="map"
            ref="map"
            class="googlemap"
            style="margin-top:2vh;margin-bottom:5vh;height:250px;width:300px;min-height:300px;"
          ></div>
        </v-row>
      </v-card>
    </v-dialog>
   
    <v-row
      class="display-1"
      justify="center"
      align="center"
      style="margin-top:2vh;color:purple"
    >{{status}}</v-row>
  </v-container>
</template>
<script>
import fetcher from "../mixins/fetcher";
export default {
  data() {
    return {
      status: "",
      address: "N5Y-1N8",
      valid: true,
      map: null,
      dialog: false,
      branches: [],
    };
  },
  mixins: [fetcher],
  methods: {
    loadBranches: async function() {
     try {
        this.status = "";
        this.branches = await this.$_getdata("branch/" + this.lat + "/" + this.lng); // fetchdata is in mixin

        let myLatLng = new window.google.maps.LatLng(this.lat, this.lng);
        let options = {
          zoom: 10,
          center: myLatLng,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP
        };

        this.map = new window.google.maps.Map(this.$refs["map"], options);
        let center = this.map.getCenter();
        this.map.setCenter(center);
        window.google.maps.event.trigger(this.map, "resize");
        let i2 = 0

        this.branches.map(detail => {
          
          i2++;
          let img = `/img/marker${i2}.png`;
          let marker = new window.google.maps.Marker({
              position: new window.google.maps.LatLng(
              detail.latitude,
              detail.longitude
            ),
            animation: window.google.maps.Animation.DROP,
            icon: img,
            title: `Branches${detail.id} ${detail.street}, ${detail.city},${detail.region}`,
            html: `<div>Branches${detail.id}<br/>${detail.street}, ${
            detail.city
            }<br/>${detail.distance.toFixed(2)} km</div>`,
            visible: true
          });
          
          window.google.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(marker.html); // added .html to the marker object.
            infowindow.close();
            infowindow.open(this.map, marker);
          });
          marker.setMap(this.map);
          let infowindow = new window.google.maps.InfoWindow({ content: "" });
        });

      } catch (err) {
        this.status = `Error has occured: ${err.message}`;
      }
    },
    getLatAndLng() {
      try {
        this.status = "please wait for branches ";
        // A service for converting between an address to LatLng
        let geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: this.address }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          // only if google gives us the OK
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          
          this.loadBranches()

          
         
          
         

         
          // // add the markers, event handlers, infowindows for each location
          // let marker = new window.google.maps.Marker({
          //   position: new window.google.maps.LatLng(this.lat, this.lng),
          //   map: this.map,
          //   animation: window.google.maps.Animation.DROP,
          //   icon: `img/marker1.png`,
          //   title: `Some hover info goes here`,
          //   html: `<div>Some interesting<br/>information about<br/>this location goes
          //   here</div>`
          // });
          // window.google.maps.event.addListener(marker, "click", () => {
          //   infowindow.setContent(marker.html);
          //   infowindow.close();
          //   infowindow.open(this.map, marker);
          // });
        }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>