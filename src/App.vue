<template>
  <v-app>
    <v-content>
    <Navbar />
    <router-view></router-view>
    <v-footer absolute class="headline" color="warning">
      <v-col class="text-center casestudy-text" cols="12">
      &copy;{{ new Date().getFullYear() }} —
        Case Study
      </v-col>
    </v-footer>
    </v-content>
  </v-app>
</template>

<script>
  import Navbar from "./components/Navbar";
  export default {
    name: "App",
    components: { Navbar }
  };
</script>

<style>
.v-content{
  background-color: #fbda50;
}
.v-content__wrap{
  overflow: hidden;
}
.casestudy-text{
  color: #623d33;
}
</style>