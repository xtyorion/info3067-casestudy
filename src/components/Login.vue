<template>
  <v-container>
    <v-row flex align-center>
      <v-col xs12 sm4 elevation-6>
        <v-card style="height:65vh;">
          <v-card-title class="justify-center display-1 app-font-color">Login</v-card-title>
          <v-row align="center" justify="center">
            <v-col>
              <div class="circleLogin">
                <img :src="require(`../assets/home.svg`)" class="logoLogin">
              </div>
              
            </v-col>
          </v-row>
          <v-card-text class="pt-4">
            <div>
              <v-form v-model="valid" ref="form">
                <v-text-field
                  class="app-font-color"
                  label="Enter your e-mail address"
                  v-model="email"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  class="app-font-color"
                  label="Enter your password"
                  v-model="password"
                  min="4"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  required
                  @click:append="show1 = !show1"
                ></v-text-field>
                <v-row justify="center">
                  <v-btn
                  @click="login"
                  :class=" { 'warning app-font-color': valid, disabled: !valid }"
                  :disabled="valid===false"
                  >Login</v-btn>
                </v-row>
              </v-form>
            </div>
            <div class="text-center" style="margin-top:5vh;">{{status}}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import fetcher from "../mixins/fetcher";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      show1: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 4 || "Min 4 characters"
      },
      valid: false,
      status: ""
    };
  },
  methods: {
    login: async function() {
      await sessionStorage.removeItem("customer");
      try {
        this.status = "logging into server";
        let customerHelper = {
        firstname: "",
        lastname: "",
        email: this.email,
        password: this.password
        };
        let payload = await this.$_postdata("login", customerHelper); // in mixin
        if (payload.token.indexOf("invalid") > 0) {
          this.status = payload.token;
        } else {
          await sessionStorage.setItem("customer", JSON.stringify(payload));
          this.$route.params.nextUrl
          ? this.$router.push({ name: this.$route.params.nextUrl })
          : this.$router.push({ name: "home" });
        }
      } catch (err) {
        console.log("here" + err);
        this.status = `Error has occured: ${err}`;
      }
    }
  },
  mixins: [fetcher]
};
</script>

<style>
.v-card{
  margin: 80px;
  background: #fbf9f6;
}
.app-font-color{
  color: #623d33 !important;
}
.circleLogin{
  height: 160px;
  width: 160px;
  margin: 0 auto;
  border-radius: 220px;
  background: linear-gradient(45deg,#ff4658, #fd924b);
}
.logoLogin{
  height: 131px;
  margin: 0 auto;
  display: block;
  padding-top: 20px;
}
</style>