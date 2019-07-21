import { app, BrowserWindow } from 'electron'
const Sentry = require('@sentry/node');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = "debug";
Sentry.init({ dsn: 'https://c601fe52e7bc443d8b386d76ed5c2d39@sentry.io/1492753' }); //Crash reporter

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */

logger.info("** BlockCraft!");
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  //
  logger.info("Creating window");


  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webviewTag:true
    }

  });


  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on('closed', () => {
    logger.info("Closed!");
    mainWindow = null
  });
  mainWindow.once('ready-to-show', () => {
    logger.info("Window ready to show!");
    mainWindow.show()
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});
