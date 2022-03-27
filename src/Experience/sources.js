export default [
    // FoxWorld - start
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
            [
                'textures/environmentMap/px.jpg',
                'textures/environmentMap/nx.jpg',
                'textures/environmentMap/py.jpg',
                'textures/environmentMap/ny.jpg',
                'textures/environmentMap/pz.jpg',
                'textures/environmentMap/nz.jpg'
            ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: 'models/Fox/glTF/Fox.gltf'
    },
    // FoxWorld - end

    // PortalWorld - start
    {
        name: 'bakedTexture',
        type: 'texture',
        path: 'textures/bakedPortalModel/baked.jpg'
    },
    {
        name: 'portalModel',
        type: 'gltfDracoModel',
        path: 'models/Portal/portal.glb'
    }
    // PortalWorld - end
]