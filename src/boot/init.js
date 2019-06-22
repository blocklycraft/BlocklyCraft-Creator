// import something here
import Common from '../components/Common'
import Snotify from 'vue-snotify'
import "vue-snotify/styles/material.css";

// "async" is optional
export default ({ Vue, app /* app, router, Vue, ... */ }) => {
  // something to do
  Vue.use(Snotify);

  Vue.prototype.BlockCraft = Common;
}
