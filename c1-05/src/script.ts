import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, WebGLRenderer, Group } from 'three';

const scene = new Scene()

const group = new Group();
scene.add(group);

const cube1 = new Mesh(
    new BoxGeometry(),
    new MeshBasicMaterial({ color: 0xff0000 })
);
group.add(cube1);

const cube2 = new Mesh(
    new BoxGeometry(),
    new MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = -2;
group.add(cube2);

const cube3 = new Mesh(
    new BoxGeometry(),
    new MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2;
group.add(cube3);

group.position.y = 1;

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
renderer.render(scene, camera)