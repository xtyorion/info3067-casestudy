<template>
 <v-container fill-height fluid>
  <v-row align="center" justify="center">
    <v-col>
      <div class="circle">
        <img :src="require(`../assets/home.svg`)" class="logo">
      </div>
      
    </v-col>
  </v-row>
 </v-container>
</template>

<script>
export default {};
</script>

<style>
  .circle{
    height: 400px;
    width: 400px;
    margin: 0 auto;
    border-radius: 220px;
    background: linear-gradient(45deg,#ff4658, #fd924b);
  }
  .logo{
    height: 100px;height: 331px;
    margin: 0 auto;
    display: block;
    padding-top: 20px;
  }
</style>