import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import Quasar from 'quasar'

function getCookie(name)
{
  let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

  if(arr=document.cookie.match(reg))

    return unescape(arr[2]);
  else
    return null;
}

export default async ({ app, Vue}) => {
  Vue.use(VueI18n);
  let u_local = '';
  u_local = getCookie("language") || Quasar.lang.getLocale();

  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: u_local,
    fallbackLocale: 'zh-cn',
    messages
  })
}
