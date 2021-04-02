import ComponentsBuilder from "./components.js"
import { constants } from "./constants.js"

export default class TerminalController {
    #usersCollors = new Map()

    constructor() {}

    #pickCollor() {
        return `#` + ((1 << 24) * Math.random() | 0).toString(16) + '-fg'
        // return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`
    }

    #getUserCollor(userName) {
        if(this.#usersCollors.has(userName))
          return this.#usersCollors.get(userName)

        const collor = this.#pickCollor()
        this.#usersCollors.set(userName, collor)

        return collor
    }
 



    #onInputReceived(eventEmitter) {
        return function() {
            const message = this.getValue()
            console.log(message)
            this.clearValue()
        }
    }

    #onMessageReceived({ screen, chat}) {
        return msg => {
            // console.log('msg', msg.toString())

            const { userName, message } = msg

            const collor = this.#getUserCollor(userName)
            // chat.addItem(`mensagem: ${msg}`)
            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)

            screen.render()
        }
    }
    
    #onLogChanged({ screen, activityLog}) {
        return msg => {
            // erickwendel left
            // erickwendel join

            const [userName] = msg.split(/\s/)
            const collor = this.#getUserCollor(userName)
            activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)

            screen.render()

        }
    }

    #onStatusChanged({ screen, status }) {

        // ['erickwendel', 'mariazinha'...] 
        return users => {

            // vamos pegar o primeiro elemento da lista
            const { content } = status.items.shift()
            status.clearItems()
            status.addItem(content)

            users.forEach(userName => {
                const collor = this.#getUserCollor(userName)
                status.addItem(`{${collor}}{bold}${userName}{/}`)
            })
        }
    }

    #registerEvents(eventEmitter, components) {
        // eventEmitter.emit('turma01', 'hey')
        // eventEmitter.on('turma01', msg => console.log(msg.toString()))

        // eventEmitter.on('message:received', this.#onMessageReceived(components))
        // eventEmitter.on('activityLog:updated', this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
    }

    async initializeTable(eventEmitter) {
        // console.log('inicializou')
        const components = new ComponentsBuilder()
        .setScreen({ title: 'HackerChat - Erick Webdel'})
        .setLayoutComponent()
        .setInputComponent(this.#onInputReceived(eventEmitter))
        .setChatComponent()
        .setActivityLogComponent()
        .setStatusComponent()
        .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()

        // setInterval(() => {
        //     eventEmitter.emit('message:received', {message: 'hey', userName: 'erickwendel'})
        //     eventEmitter.emit('message:received', {message: 'ho', userName: 'Joazin'})
        //     eventEmitter.emit('message:received', {message: 'hey', userName: 'xuxaDaSilva'})
        //     eventEmitter.emit('message:received', {message: 'hey', userName: 'mariazinha'})

        //     // eventEmitter.emit('activityLog:updated', 'erickwendel join')
        //     // eventEmitter.emit('activityLog:updated', 'erickwendel left')
        //     // eventEmitter.emit('activityLog:updated', 'Joazin join')
        //     // eventEmitter.emit('activityLog:updated', 'xuxaDaSilva left')
        //     // eventEmitter.emit('activityLog:updated', 'mariazinha join')

        //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'erickwendel join')
        //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'erickwendel left')
        //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'Joazin join')
        //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'xuxaDaSilva left')
        //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'mariazinha join')
        // }, 2000);

        // const users = ['erickwendel']
        // eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        // users.push('mariazinha')
        // eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        // users.push('homemdeferro00', 'troll001')
        // eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
        // users.push('maravilha01', '0000abc')
    }
}