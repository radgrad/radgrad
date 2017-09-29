import { Meteor } from 'meteor/meteor';
import { Logger } from 'meteor/jag:pince';
import {
  ClientLogger, NullSender, ConsoleSender, MeteorClientHttpSender, LeveledStrategy, BrowserProcessor, RoutingProcessor,
  MeteorUserProcessor,
} from 'filog';


// Sets the client logging level values are 'all', 'trace', 'debug', 'info', 'warn', 'error'
Logger.setLevel('trace');

export const logger = new ClientLogger(new LeveledStrategy(
    new NullSender(),
    new ConsoleSender(),
    new MeteorClientHttpSender(Meteor.absoluteUrl('logger')),
));

logger.processors.push(
    new BrowserProcessor(),
    new RoutingProcessor(),
    new MeteorUserProcessor(Meteor),
);
