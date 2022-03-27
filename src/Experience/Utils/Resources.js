import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter {
    // sources: Array - Name (for retrievel), Type (to determine loader), Path
    constructor(sources) {
        super()

        this.sources = sources

        /**
         * The loaded ressources.
         */
        this.items = {}
        /**
         * The number of sources to load.
         */
        this.toLoad = this.sources.length
        /**
         * The number of sources already loaded.
         */
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
        // Draco loader
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('draco/')
        this.loaders.gltfDracoLoader = (new GLTFLoader()).setDRACOLoader(dracoLoader)
    }

    startLoading() {
        // Load each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'gltfDracoModel') {
                this.loaders.gltfDracoLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }

    disposeResources() {
        for (const [key, value] of Object.entries(this.items)) {
            if (value instanceof THREE.Texture) {
                value.dispose()
            } else if (value.hasOwnProperty('scene')) {
                let objectToRemove = []
                value.scene.traverse((child) => {
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
                    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
                        objectToRemove.push(child)
                    }
                })
                objectToRemove.forEach((obj) => {
                    value.scene.remove(obj)
                })
            }
        }
        for (const prop of Object.getOwnPropertyNames(this.items)) {
            delete this.items[prop];
        }
    }
}