<script>
  import { colors } from 'quasar'
  export default {
    project: {
      opened: false,
      path: ''
    },
    dark: false,
    applyTheme (theme){
      colors.setBrand('primary', theme['primary']);
      colors.setBrand('secondary', theme['secondary']);
      colors.setBrand('accent', theme['accent']);
      colors.setBrand('positive', theme['positive']);
      colors.setBrand('negative', theme['negative']);
      colors.setBrand('info', theme['info']);
      colors.setBrand('warning', theme['warning']);
      colors.setBrand('background',theme['background']);
      colors.setBrand('text',theme['text']);
    }
  }
</script>
