import { Mongo } from 'meteor/mongo';
import { WebApp } from 'meteor/webapp';
import { Logger } from 'meteor/jag:pince';
import { MongodbSender, ServerLogger, LeveledStrategy, MeteorUserProcessor } from 'filog';
// Sets the client logging level values are 'all', 'trace', 'debug', 'info', 'warn', 'error'
Logger.setLevel('trace');

const sender = new MongodbSender(Mongo, 'logger');
export const logger = new ServerLogger(
    new LeveledStrategy(sender, sender, sender),
    WebApp);
logger.processors.push(new MeteorUserProcessor());
