import { Scene, MeshBasicMaterial, Mesh, PerspectiveCamera, WebGLRenderer, SphereGeometry, PlaneGeometry, TorusGeometry, Clock, LoadingManager, TextureLoader, DoubleSide, MeshNormalMaterial, MeshMatcapMaterial, MeshDepthMaterial, PointLight, AmbientLight, MeshLambertMaterial, MeshPhongMaterial, Color, MeshToonMaterial, NearestFilter, MeshStandardMaterial, CubeTextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui'
import doorAlphaImage from './assets/materials/door/alpha.jpg';
import doorACImage from './assets/materials/door/ambientOcclusion.jpg';
import doorColorImage from './assets/materials/door/color.jpg';
import doorHeightImage from './assets/materials/door/height.jpg';
import doorMetalnessImage from './assets/materials/door/metalness.jpg';
import doorNormalImage from './assets/materials/door/normal.jpg';
import doorRoughnessImage from './assets/materials/door/roughness.jpg';
import gradientImage from './assets/materials/gradients/5.jpg';
import matcapImage from './assets/materials/matcaps/1.png';

const gui = new GUI();

const canvas = document.querySelector('.webgl') as HTMLElement;

const textureLoader = new TextureLoader();
const cubeTextureLoader = new CubeTextureLoader();

const envMapTexture = cubeTextureLoader.load([
    'src/assets/materials/environmentMaps/0/px.jpg',
    'src/assets/materials/environmentMaps/0/nx.jpg',
    'src/assets/materials/environmentMaps/0/py.jpg',
    'src/assets/materials/environmentMaps/0/ny.jpg',
    'src/assets/materials/environmentMaps/0/pz.jpg',
    'src/assets/materials/environmentMaps/0/nz.jpg'
])

const doorAlphaTexture = textureLoader.load(doorAlphaImage);
const doorColorTexture = textureLoader.load(doorColorImage);
const doorACTexture = textureLoader.load(doorACImage);
const doorHeightTexture = textureLoader.load(doorHeightImage);
const doorMetalnessTexture = textureLoader.load(doorMetalnessImage);
const doorNormalTexture = textureLoader.load(doorNormalImage);
const doorRoughnessTexture = textureLoader.load(doorRoughnessImage);
const gradientTexture = textureLoader.load(gradientImage);
const matcapTexture = textureLoader.load(matcapImage);

gradientTexture.minFilter = NearestFilter;
gradientTexture.magFilter = NearestFilter;
gradientTexture.generateMipmaps = false;

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

/*
const material = new MeshBasicMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    side: DoubleSide
});
*/

//const material = new MeshNormalMaterial();

//const material = new MeshMatcapMaterial({matcap: matcapTexture});

//const material = new MeshDepthMaterial();

/*
const material = new MeshPhongMaterial();
material.shininess = 100;
material.specular = new Color(0x1188ff);
*/

//const material = new MeshToonMaterial({gradientMap: gradientTexture});

/*
const material = new MeshStandardMaterial({
    //roughness: .45,
    //metalness: .45,
    map: doorColorTexture,
    aoMap: doorACTexture,
    displacementMap: doorHeightTexture,
    displacementScale: .05,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
});
*/

const material = new MeshStandardMaterial({
    roughness: .2,
    metalness: .7,
    envMap: envMapTexture
});

const ambientLight = new AmbientLight(0xffffff, .5);
const pointLight = new PointLight(0xffffff, 50);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight);

const sphere = new Mesh(
    new SphereGeometry(.5, 64, 64),
    material
)

const plane = new Mesh(
    new PlaneGeometry(1, 1, 100, 100),
    material
);

const torus = new Mesh(
    new TorusGeometry(.3, .2, 64, 128),
    material
)

sphere.position.x = -1.5;
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

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

const clock = new Clock();

const rotate = (mesh: Mesh) => {
    const elapsedTime = clock.getElapsedTime();
    mesh.rotation.y = .1 * elapsedTime;
    mesh.rotation.x = .15 * elapsedTime;
} 

const tick = () => {
    rotate(sphere);
    rotate(torus);
    rotate(plane);

    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
}

tick();