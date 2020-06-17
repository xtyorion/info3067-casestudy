<template>
 <nav>
  <v-toolbar>
    <v-app-bar-nav-icon @click="open = !open" class="casestudy-text"></v-app-bar-nav-icon>
      <v-toolbar-title class="casestudy-text">
        <span>Info3067 Case Study</span>
      </v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
  <v-menu v-model="open" app class="secondary">
    <v-list class="warning">
      <!-- v-list-tile is changed to v-list-item -->
      <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
        <v-list-item-content>
          <v-list-item-title>{{ link.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
 </nav>
</template>
<script>

export default {
  data: () => ({
    open: false,
    links: [
      { text: "Home", route: "/" },
      { text: "Brands", route: "/brands" },
      { text: "Existing Orders", route: "/cartList" },
      { text: "Find a Branch", route: "/locator" },
      { text: "Register", route: "/register" },
      { text: "Login", route: "/login" },
      { text: "Logout", route: "/logout" },
    ]
  })
};
</script>

<style>
.v-toolbar{
  box-shadow: none !important;
  background-color: #fbda50 !important;
}
.casestudy-text{
  color: #623d33;
}
.v-list .v-list-item--active{
  color: #ff5656 !important;
}
</style>