import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, WebGLRenderer } from 'three';

const scene = new Scene()

const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshBasicMaterial({ color: 0xff0000 })
const mesh = new Mesh(geometry, material)
scene.add(mesh)

const sizes = {
    width: 800,
    height: 600
}

const camera = new PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

const renderer = new WebGLRenderer({
    canvas: document.querySelector('.webgl') as any
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)