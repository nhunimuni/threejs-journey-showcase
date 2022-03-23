import * as THREE from 'three'

import Experience from '../Experience.js'
import Environment from './Environment.js'

export default class CubeWorld {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.geometry = new THREE.BoxGeometry(1, 1, 1);
            this.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            this.cube = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.cube)
            this.environment = new Environment()

            // Debug
            if (this.debug.active) {
                this.debugFolder = this.debug.ui.addFolder('Cube')
                this.debugFolder.add(this.cube.position, 'y').min(-3).max(3)
            }
        })
    }

    update() {
        if (this.cube) this.cube.rotation.y = this.time.elapsed * 0.001
    }
}