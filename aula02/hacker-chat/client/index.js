/* 
node index.js \
    --username erickwendel \
    --room sala01 \
    --hostUri localhost
*/

import Events from 'events'

import TerminalController from "./src/terminalController.js";
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socker.js';


console.log('process.argv', process.argv)
const [nodePath, filePath, ...commands] = process.argv
console.log(commands)
const config = CliConfig.parseArguments(commands)
console.log('config', config)

const componentEmitter = new Events()
const socketClient = new SocketClient(config)
await socketClient.initialize()

// const controller = new TerminalController()

// await controller.initializeTable(componentEmitter)