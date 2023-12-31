import { ConsoleLogger } from 'js_utils/ConsoleLogger';
import { LOGLEVEL } from './env.js';

const log = new ConsoleLogger({ logLevel: LOGLEVEL });

globalThis.log = log;

export { log };
