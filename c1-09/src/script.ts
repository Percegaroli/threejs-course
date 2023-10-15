import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, WebGLRenderer, BufferAttribute, BufferGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.querySelector('.webgl') as HTMLElement

const sizes = {
    width: 0,
    height: 0,
}

const getSizeFromWindow = () => {
    sizes.width = window.innerWidth,
    sizes.height = window.innerHeight
}

const getAspectRatio = () => sizes.width / sizes.height;

getSizeFromWindow();

window.addEventListener('resize', () => {
    getSizeFromWindow();
    camera.aspect = getAspectRatio();
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else canvas.requestFullscreen();
})

const cursor = {
    x: 0,
    y: 0
};

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - .5;
    cursor.y = - (event.clientY / sizes.height - .5);
});

const scene = new Scene()

const geometry = new BufferGeometry();

const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++){
    positionsArray[i] = Math.random();
}

const positionsAttribute = new BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const mesh = new Mesh(
    geometry,
    new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
);

scene.add(mesh);

// Camera
const camera = new PerspectiveCamera(75, getAspectRatio());
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
}

tick();