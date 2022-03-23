import EventEmitter from './EventEmitter.js'

/**
 * The Time works a bit like the Clock class of Three.js
 * It will save 
 * - the current time, 
 * - the elapsed time 
 * - the delta time between the current frame and the previous frame
 * 
 * The class will also trigger an event on each frame so that we can listen to that event and update the whole experience.
 */
export default class Time extends EventEmitter {
    constructor() {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        // 0 created bugs in the past
        // why 16: defalut screens run at 60fps
        // between each time its usually 16ms
        this.delta = 16

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        const currentTime = Date.now()
        // if we log delta we will get 16 and 17
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}