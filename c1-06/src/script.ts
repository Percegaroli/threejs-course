import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, WebGLRenderer, Clock } from 'three';

const scene = new Scene()

const cube = new Mesh(
    new BoxGeometry(),
    new MeshBasicMaterial({ color: 0xff0000 })
);

scene.add(cube);

const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new WebGLRenderer({
    canvas: document.querySelector('.webgl') as any
})
renderer.setSize(sizes.width, sizes.height)

const clock = new Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    
    cube.position.y = Math.sin(elapsedTime);
    cube.position.x = Math.cos(elapsedTime);
    camera.lookAt(cube.position);

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
}

tick();