import ComponentsBuilder from "./components.js"

export default class TerminalController {
    constructor() {}

    #onInputReceived(eventEmitter) {
        return function() {
            const message = this.getValue()
            console.log(message)
            this.clearValue()
        }
    }

    async initializeTable(eventEmitter) {
        // console.log('inicializou')
        const components = new ComponentsBuilder()
        .setScreen({ title: 'HackerChat - Erick Webdel'})
        .setLayoutComponent()
        .setInputComponent(this.#onInputReceived(eventEmitter))
        .setChatComponent()
        .build()

        components.input.focus()
        components.screen.render()
    }
}