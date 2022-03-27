import * as THREE from 'three'

import Experience from '../Experience.js'
import galaxyVertexShader from "./shaders/galaxy/vertex.glsl"
import galaxyFragmentShader from "./shaders/galaxy/fragment.glsl"

export default class AnimatedGalaxyWorld {
    constructor() {
        this.experience = new Experience()
        this.renderer = this.experience.renderer
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.debugObject = {}
        this.debugObject.count = 200000
        this.debugObject.size = 0.005
        this.debugObject.radius = 5
        this.debugObject.branches = 3
        this.debugObject.spin = 1
        this.debugObject.randomness = 0.5
        this.debugObject.randomnessPower = 3
        this.debugObject.insideColor = "#ff6030"
        this.debugObject.outsideColor = "#1b3984"
        this.debugObject.uSize = 30
        this.debugObject.timeSpeed = 1
        this.debugObject.reset = () => {
            this.generateGalaxy()
        }

        this.geometry = null
        this.material = null
        this.points = null

        // Wait for resources
        this.resources.on('ready', () => {
            this.renderer.instance.setClearColor("#000000")

            this.generateGalaxy()

            // Debug
            if (this.debug.active) {
                this.debugFolder = this.debug.ui.addFolder('Portal')
                this.debugFolder
                    .add(this.debugObject, "count")
                    .min(100)
                    .max(1000000)
                    .step(100)
                    .onFinishChange(() => { this.generateGalaxy() })
                this.debugFolder
                    .add(this.debugObject, "radius")
                    .min(0.01)
                    .max(20)
                    .step(0.01)
                    .onFinishChange(() => { this.generateGalaxy() })
                this.debugFolder
                    .add(this.debugObject, "branches")
                    .min(2)
                    .max(20)
                    .step(1)
                    .onFinishChange(() => { this.generateGalaxy() })
                this.debugFolder
                    .add(this.debugObject, "randomness")
                    .min(0)
                    .max(2)
                    .step(0.001)
                    .onFinishChange(() => { this.generateGalaxy() })
                this.debugFolder
                    .add(this.debugObject, "randomnessPower")
                    .min(1)
                    .max(10)
                    .step(0.001)
                    .onFinishChange(() => { this.generateGalaxy() })
                this.debugFolder.addColor(this.debugObject, "insideColor").onFinishChange(() => { this.generateGalaxy() })
                this.debugFolder.addColor(this.debugObject, "outsideColor").onFinishChange(() => { this.generateGalaxy() })
                this.debugFolder
                    .add(this.debugObject, "uSize")
                    .min(1)
                    .max(100)
                    .step(1)
                    .onFinishChange(() => { this.generateGalaxy() })
                this.debugFolder
                    .add(this.debugObject, "timeSpeed")
                    .min(0.0)
                    .max(10.0)
                    .step(0.1)
                    .onFinishChange(() => { this.generateGalaxy() })
            }
        })
    }

    generateGalaxy() {
        if (this.points !== null) {
            this.geometry.dispose()
            this.material.dispose()
            this.scene.remove(this.points)
        }

        /**
         * Geometry
         */
        this.geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(this.debugObject.count * 3)
        const colors = new Float32Array(this.debugObject.count * 3)
        const scales = new Float32Array(this.debugObject.count * 1)
        const randomness = new Float32Array(this.debugObject.count * 3)

        const insideColor = new THREE.Color(this.debugObject.insideColor)
        const outsideColor = new THREE.Color(this.debugObject.outsideColor)

        for (let i = 0; i < this.debugObject.count; i++) {
            const i3 = i * 3

            // Position
            const radius = Math.random() * this.debugObject.radius

            const branchAngle =
                ((i % this.debugObject.branches) / this.debugObject.branches) * Math.PI * 2

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

            //   Set the randomness after we spin in vertex.glsl
            // Meaning we send the random values to the shader
            // positions[i3] = Math.cos(branchAngle) * radius + randomX
            // positions[i3 + 1] = randomY
            // positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ

            positions[i3] = Math.cos(branchAngle) * radius
            positions[i3 + 1] = 0
            positions[i3 + 2] = Math.sin(branchAngle) * radius

            randomness[i3] = randomX
            randomness[i3 + 1] = randomY
            randomness[i3 + 2] = randomZ

            // Color
            const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / this.debugObject.radius)

            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            // Scale
            scales[i] = Math.random()
        }

        this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
        this.geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1))
        this.geometry.setAttribute("aRandomness", new THREE.BufferAttribute(randomness, 3))

        /**
         * Material
         */
        // Replaced by the ShaderMaterial
        // this.material = new THREE.PointsMaterial({
        //     size: this.debugObject.size,
        //     sizeAttenuation: true,
        //     depthWrite: false,
        //     blending: THREE.AdditiveBlending,
        //     vertexColors: true
        // })
        this.material = new THREE.ShaderMaterial({
            // sizeAttenuation: true, // ShaderMat does not have this prop, we need to write that on our own
            depthWrite: false,
            transparent: true,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: galaxyVertexShader,
            fragmentShader: galaxyFragmentShader,
            uniforms: {
                //   uSize: { value: 8 * renderer.getPixelRatio() },
                // For the Light point pattern
                uSize: { value: this.debugObject.uSize * this.renderer.instance.getPixelRatio() },
                uTime: { value: this.debugObject.time },
            },
        })

        /**
         * Points
         */
        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }

    update() {
        if (this.material)
            this.material.uniforms.uTime.value = this.time.elapsed * 0.001 * this.debugObject.timeSpeed
    }
}