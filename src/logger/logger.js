const log4js = require('log4js');
log4js.configure(require('./config.json'));
const logger = log4js.getLogger();
logger.level = "debug";

export default {
    info(msg) {
        logger.info(msg);
    },
    debug(msg) {
        logger.info(msg);
    },
    error(msg) {
        logger.error(msg);
    },
    warn(msg) {
        logger.warn(msg);
    }

}