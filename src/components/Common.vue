<script>
import { colors } from "quasar";
import logger from "../logger/logger";
//捕获所有异常

window.onerror = function (msg){
  logger.error(msg)
  return true;
}
export default {
  versions: {
    blockcraft: "0.0.9-indev"
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
