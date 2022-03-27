import * as THREE from 'three'

import Experience from '../Experience.js'
import FireFlies from './FireFlies.js'

import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

export default class PortalWorld {
    constructor() {
        this.experience = new Experience()
        this.renderer = this.experience.renderer
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.debugObject = {}
        this.debugObject.clearColor = '#190321'
        this.debugObject.portalColorStart = '#ffffff'
        this.debugObject.portalColorEnd = '#380849'

        // Wait for resources
        this.resources.on('ready', () => {
            this.renderer.instance.setClearColor(this.debugObject.clearColor)
            /**
             * Textures
             */
            this.bakedTexture = this.resources.items.bakedTexture
            // There is a disagreement between software / library about the direction of the Y axis in the texture's coordinates. 
            // All we need to do is flip the texture.
            this.bakedTexture.flipY = false
            // Our baked texture is encoded with sRGB but Three.js isn't aware of that.
            // We need to set the encoding
            // And also need to set the output of our WebGLRenderer to sRGB in Renderer.js
            this.bakedTexture.encoding = THREE.sRGBEncoding

            /**
             * Materials
             */
            // Baked material
            // const bakedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            const bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture })
            // Portal light material
            // const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
            this.portalLightMaterial = new THREE.ShaderMaterial({
                uniforms:
                {
                    uTime: { value: 0 },
                    uColorStart: { value: new THREE.Color(this.debugObject.portalColorStart) },
                    uColorEnd: { value: new THREE.Color(this.debugObject.portalColorEnd) },
                },
                vertexShader: portalVertexShader,
                fragmentShader: portalFragmentShader
            })
            // Pole light material
            const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

            /**
            * Model
            */
            this.portalModel = this.resources.items.portalModel

            // this.portalModel.scene.traverse((child) => {
            //     child.material = bakedMaterial
            // })

            const bakedMesh = this.portalModel.scene.children.find(child => child.name === 'baked')
            const portalLightMesh = this.portalModel.scene.children.find(child => child.name === 'portalLight')
            const poleLightAMesh = this.portalModel.scene.children.find(child => child.name === 'poleLightA')
            const poleLightBMesh = this.portalModel.scene.children.find(child => child.name === 'poleLightB')

            bakedMesh.material = bakedMaterial
            portalLightMesh.material = this.portalLightMaterial
            poleLightAMesh.material = poleLightMaterial
            poleLightBMesh.material = poleLightMaterial

            this.scene.add(this.portalModel.scene)

            this.fireFlies = new FireFlies()

            // Debug
            if (this.debug.active) {
                this.debugFolder = this.debug.ui.addFolder('Portal')
                this.renderer.instance.setClearColor(this.debugObject.clearColor)
                this.debugFolder.addColor(this.debugObject, 'clearColor').onChange(() => {
                    this.renderer.instance.setClearColor(this.debugObject.clearColor)
                })

                // Portal
                this.debugFolder
                    .addColor(this.debugObject, 'portalColorStart')
                    .onChange(() => {
                        this.portalLightMaterial.uniforms.uColorStart.value.set(this.debugObject.portalColorStart)
                    })
                this.debugFolder
                    .addColor(this.debugObject, 'portalColorEnd')
                    .onChange(() => {
                        this.portalLightMaterial.uniforms.uColorEnd.value.set(this.debugObject.portalColorEnd)
                    })
            }
        })
    }

    update() {
        if (this.portalLightMaterial)
            this.portalLightMaterial.uniforms.uTime.value = this.time.elapsed * 0.001

        if (this.fireFlies)
            this.fireFlies.update()
    }
}