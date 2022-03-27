import * as THREE from 'three'
import Experience from '../Experience.js'
import waterVertexShader from "./shaders/water/vertex.glsl"
import waterFragmentShader from "./shaders/water/fragment.glsl"

export default class RagingSeaWorld {
    constructor() {
        this.experience = new Experience()
        this.renderer = this.experience.renderer
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.debugObject = {}
        this.debugObject.depthColor = "#186691"
        this.debugObject.surfaceColor = "#9bd8ff"

        // Wait for resources
        this.resources.on('ready', () => {
            this.renderer.instance.setClearColor("#000000")

            /**
             * Water
             */
            // Geometry
            this.waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

            // Material
            this.waterMaterial = new THREE.ShaderMaterial({
                vertexShader: waterVertexShader,
                fragmentShader: waterFragmentShader,
                uniforms: {
                    uBigWavesElevation: { value: 0.2 },
                    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
                    uBigWavesSpeed: { value: 0.75 },
                    uTime: { value: 0 },
                    uDepthColor: { value: new THREE.Color(this.debugObject.depthColor) },
                    uSurfaceColor: { value: new THREE.Color(this.debugObject.surfaceColor) },
                    uColorOffset: { value: 0.08 },
                    uColorMultiplier: { value: 5 },
                    uSmallWavesElevation: { value: 0.15 },
                    uSmallWavesFrequency: { value: 3 },
                    uSmallWavesSpeed: { value: 0.2 },
                    uSmallIterations: { value: 4 },
                },
            })

            // Mesh
            const water = new THREE.Mesh(this.waterGeometry, this.waterMaterial)
            water.rotation.x = -Math.PI * 0.5
            this.scene.add(water)


            // Debug
            if (this.debug.active) {
                this.debugFolder = this.debug.ui.addFolder('RagingSea')
                this.debugFolder.addColor(this.debugObject, "depthColor").onChange(() => {
                    this.waterMaterial.uniforms.uDepthColor.value.set(this.debugObject.depthColor)
                })
                this.debugFolder.addColor(this.debugObject, "surfaceColor").onChange(() => {
                    this.waterMaterial.uniforms.uSurfaceColor.value.set(this.debugObject.surfaceColor)
                })
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uBigWavesElevation, "value")
                    .min(0)
                    .max(1)
                    .step(0.001)
                    .name("uBigWavesElevation")
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uBigWavesFrequency.value, "x")
                    .min(0)
                    .max(10)
                    .step(0.001)
                    .name("uBigWavesFrequencyX")
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uBigWavesFrequency.value, "y")
                    .min(0)
                    .max(10)
                    .step(0.001)
                    .name("uBigWavesFrequencyY")
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uBigWavesSpeed, "value")
                    .min(0)
                    .max(4)
                    .step(0.001)
                    .name("uBigWavesSpeed")
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uColorOffset, "value")
                    .min(0)
                    .max(1)
                    .step(0.001)
                    .name("uColorOffset")
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uColorMultiplier, "value")
                    .min(0)
                    .max(10)
                    .step(0.001)
                    .name("uColorMultiplier")
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uSmallWavesElevation, "value")
                    .min(0)
                    .max(1)
                    .step(0.001)
                    .name("uSmallWavesElevation")
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uSmallWavesFrequency, "value")
                    .min(0)
                    .max(30)
                    .step(0.001)
                    .name("uSmallWavesFrequency")
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uSmallWavesSpeed, "value")
                    .min(0)
                    .max(4)
                    .step(0.001)
                    .name("uSmallWavesSpeed")
                this.debugFolder
                    .add(this.waterMaterial.uniforms.uSmallIterations, "value")
                    .min(0)
                    .max(5)
                    .step(1)
                    .name("uSmallIterations")
            }
        })
    }

    update() {
        if (this.waterMaterial)
            this.waterMaterial.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}