<script>
import { colors } from "quasar";
export default {
  versions: {
    blockcraft: "0.0.6-indev"
  },
  dark: false,
  applyTheme(theme) {
    colors.setBrand("primary", theme["primary"]);
    colors.setBrand("secondary", theme["secondary"]);
    colors.setBrand("accent", theme["accent"]);
    colors.setBrand("positive", theme["positive"]);
    colors.setBrand("negative", theme["negative"]);
    colors.setBrand("info", theme["info"]);
    colors.setBrand("warning", theme["warning"]);
    colors.setBrand("background", theme["background"]);
    colors.setBrand("text", theme["text"]);
  }
};
</script>
