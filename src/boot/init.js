// import something here
import Common from '../components/Common'
import Snotify from 'vue-snotify'
import 'vue-snotify/styles/material.css'
import themeLight from '../theme/light'
import themeDark from '../theme/dark'
const settings = require('electron-settings')

const log4js = require('log4js')
log4js.configure(require('../logger/config.json'))
const logger = log4js.getLogger()
logger.level = 'debug'

// "async" is optional
export default ({ Vue /* app, router, Vue, ... */ }) => {
  // something to do
  Vue.use(Snotify)

  Vue.prototype.$BlockCraft = Common
  Vue.prototype.$eventHub = new Vue()
  Vue.prototype.$logger = logger

  // Read theme config from file
  Common.dark = settings.get('dark')
  if (!Common.dark) {
    // Load light theme
    Common.applyTheme(themeLight)
  } else {
    Common.applyTheme(themeDark)
  }
}
