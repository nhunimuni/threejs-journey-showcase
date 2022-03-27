import * as THREE from 'three'
import Experience from '../Experience.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'

/**
 * Fireflies Particle!
 */
export default class FireFlies {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        // Geometry
        const firefliesGeometry = new THREE.BufferGeometry()
        const firefliesCount = 30
        const positionArray = new Float32Array(firefliesCount * 3)
        const scaleArray = new Float32Array(firefliesCount)

        for (let i = 0; i < firefliesCount; i++) {
            positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
            positionArray[i * 3 + 1] = Math.random() * 1.5
            positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4

            scaleArray[i] = Math.random()
        }
        firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

        // Material
        // const firefliesMaterial = new THREE.PointsMaterial({ size: 0.1, sizeAttenuation: true })
        this.firefliesMaterial = new THREE.ShaderMaterial({
            uniforms:
            {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 200 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexShader: firefliesVertexShader,
            fragmentShader: firefliesFragmentShader
        })

        // Points
        const fireflies = new THREE.Points(firefliesGeometry, this.firefliesMaterial)
        this.scene.add(fireflies)

        this.sizes.on('resize', () => {
            // Update fireflies
            this.firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
        })

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('fireflies')
            this.debugFolder.add(this.firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')
        }
    }

    update() {
        // Update materials
        this.firefliesMaterial.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}