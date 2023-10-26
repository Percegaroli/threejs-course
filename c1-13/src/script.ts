import { Scene, BoxGeometry, Mesh, PerspectiveCamera, WebGLRenderer, ColorManagement, LinearSRGBColorSpace, MeshStandardMaterial, SphereGeometry, TorusGeometry, AmbientLight, PlaneGeometry, Clock, DirectionalLight, HemisphereLight, PointLight, RectAreaLight, Vector3, SpotLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

ColorManagement.enabled = false

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

const material = new MeshStandardMaterial({
    roughness: .4,
});

const cube = new Mesh(
    new BoxGeometry(1, 1, 1),
    material
);

const sphere = new Mesh(
    new SphereGeometry(.5, 64, 64),
    material
)

const torus = new Mesh(
    new TorusGeometry(.3, .2, 64, 128),
    material
)

const plane = new Mesh(
    new PlaneGeometry(4, 4),
    material
);
plane.position.set(0, -.8, 0);
plane.rotateX(3 / 2 * Math.PI);

sphere.position.x = -1.5;
torus.position.x = 1.5;
scene.add(sphere, cube, torus, plane);

const ambientLight = new AmbientLight(0xffffff, .7);
const directionalLight = new DirectionalLight(0x00fffc, .5);
directionalLight.position.set(1, .25, 0);
const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, .3);
const pointLight = new PointLight(0xff9000, .5, 3);
pointLight.position.set(1, -.4, 1);
const rectAreaLight = new RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new Vector3());
const spotLight = new SpotLight(0x78ff00, .5, 10, Math.PI * .1, .25, 1);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -.75;
scene.add(ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight, spotLight, spotLight.target);

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
renderer.outputColorSpace = LinearSRGBColorSpace

const clock = new Clock();

const rotate = (mesh: Mesh) => {
    const elapsedTime = clock.getElapsedTime();
    mesh.rotation.y = .1 * elapsedTime;
    mesh.rotation.x = .15 * elapsedTime;
} 

const tick = () => {
    rotate(sphere);
    rotate(torus);
    rotate(cube);
    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
}

tick();