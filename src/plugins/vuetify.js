import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);
export default new Vuetify({
 theme: {
  themes: {
    light: {
      primary: "#623d33", // #E53935
      secondary: colors.red.lighten4, // #FFCDD2
      accent: "#ff5656",
      error: "#FF5252",
      info: "#f8d045",
      success: "#4CAF50",
      warning: "#fbda50",
    }
  }
 }
});
