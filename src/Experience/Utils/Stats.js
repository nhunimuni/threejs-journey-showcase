// https://github.com/mrdoob/stats.js/
import StatsTool from 'stats.js'

export default class Stats {
    constructor() {
        this.active = window.location.hash === '#debug'

        if (this.active) {
            /**
             * Stats
             */
            this.instance = new StatsTool()
            this.instance.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
            this.instance.dom.classList.add('stats')
            this.instance.dom.style.top = '30px'
            document.body.appendChild(this.instance.dom)
        }
    }
}