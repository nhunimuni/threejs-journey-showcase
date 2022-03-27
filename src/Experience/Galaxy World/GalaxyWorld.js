import * as THREE from 'three'
import Experience from '../Experience.js'

export default class GalaxyWorld {
    constructor() {
        this.experience = new Experience()
        this.renderer = this.experience.renderer
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.debugObject = {}
        this.geometry = null
        this.material = null
        this.points = null

        // Wait for resources
        this.resources.on('ready', () => {
            this.renderer.instance.setClearColor('#000000')

            this.debugObject.count = 100000
            this.debugObject.size = 0.02
            this.debugObject.radius = 3
            this.debugObject.branches = 3
            this.debugObject.spin = 2
            this.debugObject.randomness = 0.2
            this.debugObject.randomnessPower = 3
            this.debugObject.insideColor = "#9720f8"
            this.debugObject.outsideColor = "#0e0aff"

            this.generateGalaxy()

            // Debug
            if (this.debug.active) {
                this.debugFolder = this.debug.ui.addFolder('Galaxy')
                this.debugFolder
                    .add(this.debugObject, "count")
                    .min(100)
                    .max(1000000)
                    .step(100)
                    .onFinishChange(() => this.generateGalaxy())
                this.debugFolder
                    .add(this.debugObject, "size")
                    .min(0.001)
                    .max(0.1)
                    .step(0.001)
                    .onFinishChange(() => this.generateGalaxy())
                this.debugFolder
                    .add(this.debugObject, "radius")
                    .min(0.01)
                    .max(20)
                    .step(0.01)
                    .onFinishChange(() => this.generateGalaxy())
                this.debugFolder
                    .add(this.debugObject, "branches")
                    .min(2)
                    .max(20)
                    .step(1)
                    .onFinishChange(() => this.generateGalaxy())
                this.debugFolder
                    .add(this.debugObject, "spin")
                    .min(-5)
                    .max(5)
                    .step(0.001)
                    .onFinishChange(() => this.generateGalaxy())
                this.debugFolder
                    .add(this.debugObject, "randomness")
                    .min(0)
                    .max(2)
                    .step(0.001)
                    .onFinishChange(() => this.generateGalaxy())
                this.debugFolder
                    .add(this.debugObject, "randomnessPower")
                    .min(1)
                    .max(10)
                    .step(0.001)
                    .onFinishChange(() => this.generateGalaxy())
                this.debugFolder.addColor(this.debugObject, "insideColor").onFinishChange(() => this.generateGalaxy())
                this.debugFolder.addColor(this.debugObject, "outsideColor").onFinishChange(() => this.generateGalaxy())

            }
        })
    }

    generateGalaxy() {
        this.geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(this.debugObject.count * 3)
        const colors = new Float32Array(this.debugObject.count * 3)
        const colorInside = new THREE.Color(this.debugObject.insideColor)
        const colorOutside = new THREE.Color(this.debugObject.outsideColor)

        // Destroy old galaxy
        if (this.points !== null) {
            this.geometry.dispose()
            this.material.dispose()
            this.scene.remove(this.points)
        }

        //   for (let i = 0; i < this.debugObject.count * 3; i++) {
        //     positions[i] = (Math.random() - 0.5) * 3
        //   }
        for (let i = 0; i < this.debugObject.count; i++) {
            const i3 = i * 3

            const radius = Math.random() * this.debugObject.radius
            const spinAngle = radius * this.debugObject.spin // the further the particle is from the center, the more spin it'll endure
            const branchAngle =
                ((i % this.debugObject.branches) / this.debugObject.branches) * Math.PI * 2

            // const randomX = (Math.random() - 0.5) * this.debugObject.randomness * radius
            // const randomY = (Math.random() - 0.5) * this.debugObject.randomness * radius
            // const randomZ = (Math.random() - 0.5) * this.debugObject.randomness * radius
            const randomX =
                Math.pow(Math.random(), this.debugObject.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1) *
                this.debugObject.randomness *
                radius
            const randomY =
                Math.pow(Math.random(), this.debugObject.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1) *
                this.debugObject.randomness *
                radius
            const randomZ =
                Math.pow(Math.random(), this.debugObject.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1) *
                this.debugObject.randomness *
                radius

            // positions[i3] = (Math.random() - 0.5) * 3
            // positions[i3 + 1] = (Math.random() - 0.5) * 3
            // positions[i3 + 2] = (Math.random() - 0.5) * 3

            // position all particles in one line on the x
            // positions[i3] = radius
            // positions[i3 + 1] = 0
            // positions[i3 + 2] = 0

            // if (i < 11) {
            //   console.log(i, branchAngle, branchAngle + spinAngle)
            // }

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
            positions[i3 + 1] = randomY
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

            const mixedColor = colorInside.clone()
            mixedColor.lerp(colorOutside, radius / this.debugObject.radius)
            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b
        }

        this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

        this.material = new THREE.PointsMaterial({
            size: this.debugObject.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
        })

        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }

    update() { }
}