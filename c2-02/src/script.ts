import { Scene, Mesh, PerspectiveCamera, WebGLRenderer, ColorManagement, LinearSRGBColorSpace, MeshStandardMaterial, SphereGeometry, AmbientLight, PlaneGeometry, Clock, DirectionalLight, DirectionalLightHelper, CameraHelper, PCFSoftShadowMap, SpotLight, PointLight } from 'three';
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
    roughness: .7,
});

const sphere = new Mesh(
    new SphereGeometry(.5, 64, 64),
    material
)
sphere.castShadow = true;

const plane = new Mesh(
    new PlaneGeometry(4, 4),
    material
);
plane.receiveShadow = true;
plane.position.set(0, -.5, 0);
plane.rotateX(3 / 2 * Math.PI);

scene.add(sphere, plane);

const ambientLight = new AmbientLight(0xffffff, .5);

const directionalLight = new DirectionalLight(0xffffff, .5);
directionalLight.castShadow = true;
directionalLight.position.set(2, 2, -1);
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

const spotlight = new SpotLight(0xffffff, .4, 10, Math.PI * .3);
spotlight.position.set(0, 2, 2);
spotlight.castShadow = true;
spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;
spotlight.shadow.camera.fov = 30;
spotlight.shadow.camera.near = 1;
spotlight.shadow.camera.far = 6;

const pointLight = new PointLight(0xffffff, .3);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = .1;
pointLight.shadow.camera.far = 5;

const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
const spotlightCameraHelper = new CameraHelper(spotlight.shadow.camera);
const pointLightCameraHelper = new CameraHelper(pointLight.shadow.camera);
directionalLightCameraHelper.visible = false;
spotlightCameraHelper.visible = false;
pointLightCameraHelper.visible = false;

scene.add(ambientLight, directionalLight, pointLight, spotlight, spotlight.target, directionalLightCameraHelper, spotlightCameraHelper, pointLightCameraHelper);

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
renderer.outputColorSpace = LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

const clock = new Clock();

const rotate = (mesh: Mesh) => {
    const elapsedTime = clock.getElapsedTime();
    mesh.rotation.y = .1 * elapsedTime;
    mesh.rotation.x = .15 * elapsedTime;
} 

const tick = () => {
    rotate(sphere);
    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
}

tick();