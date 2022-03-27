import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import FoxWorld from './FoxWorld/FoxWorld.js'
import Resources from './Utils/Resources.js'
import CubeWorld from './CubeWorld/CubeWorld.js'

import sources from './sources.js'
import WorldSelector from './WorldSelector.js'
import PortalWorld from './PortalWorld/PortalWorld.js'

let instance = null
let worldDestructionDone = false

/**
 * Experience is the main class of the application.
 */
export default class Experience {
    constructor(_canvas) {
        /** 
         * Three ways so that the Camera class can have access to the variables in the Experience class:
         * 1. Use the global variable (window.experience)
         * 2. Pass Experience as paramater (new Camera(this))
         * 3. Set the Experience as Singleton (new Experience())
         */
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // Set dropdown

        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()

        // World
        this.worldSelector = new WorldSelector()
        this.world = null
        if (this.worldSelector.selected === "CubeWorld") this.world = new CubeWorld()
        else if (this.worldSelector.selected === "FoxWorld") this.world = new FoxWorld()
        else if (this.worldSelector.selected === "PortalWorld") this.world = new PortalWorld()
        else this.world = new CubeWorld()

        // WorldSelector on change
        this.worldSelector.on('worldChange', () => {
            this.destroyScene()
            if (worldDestructionDone) {
                this.resources = new Resources(sources)
                if (this.worldSelector.selected === "CubeWorld") this.world = new CubeWorld()
                else if (this.worldSelector.selected === "FoxWorld") this.world = new FoxWorld()
                else if (this.worldSelector.selected === "PortalWorld") this.world = new PortalWorld()
                else this.world = new CubeWorld()
            }
        })

        // Sizes resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroyScene() {
        let objectToRemove = []
        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
            if (child instanceof THREE.Mesh || child instanceof THREE.Group || child instanceof THREE.Points) {
                objectToRemove.push(child)
            }
        })
        objectToRemove.forEach((obj) => this.scene.remove(obj))

        // Dispose ressources
        this.resources.disposeResources()

        // Reset lil-gui
        if (this.debug.active) {
            this.debug.ui.destroy()
            this.debug = new Debug()
        }
        worldDestructionDone = true
    }

    destroyAll() {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if (this.debug.active)
            this.debug.ui.destroy()
    }
}