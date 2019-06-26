import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import Quasar from 'quasar'
const settings = require('electron-settings');




export default async ({ app, Vue}) => {

  Vue.use(VueI18n);

  let u_local =settings.get('language') || Quasar.lang.getLocale();

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: u_local,
    fallbackLocale: 'zh-cn',
    messages
  })
}
