import EventEmitter from './Utils/EventEmitter'

export default class WorldSelector extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.default = "CubeWorld"
        this.dropdown = document.getElementById("experience")
        this.selected = this.default
        this.dropdown.value = this.default

        // Change event
        this.dropdown.addEventListener("change", (event) => {
            this.selected = event.target.value
            this.trigger('worldChange')
        })
    }
}