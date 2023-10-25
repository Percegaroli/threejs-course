import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, WebGLRenderer, TextureLoader, LoadingManager, NearestFilter } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import colorImage from '../../assets/woodDoor/Door_Wood_001_basecolor.jpg';
import ambientOcclusionImage from '../../assets/woodDoor/Door_Wood_001_ambientOcclusion.jpg';
import heightImage from '../../assets/woodDoor/Door_Wood_001_height.png';
import metalicImage from '../../assets/woodDoor/Door_Wood_001_metallic.jpg';
import opacityImage from '../../assets/woodDoor/Door_Wood_001_opacity.jpg';
import roughnessImage from '../../assets/woodDoor/Door_Wood_001_roughness.jpg';
import normalImage from '../../assets/woodDoor/Door_Wood_001_normal.jpg';

const loadingManager = new LoadingManager();

loadingManager.onStart = () => console.log('started loading');
loadingManager.onProgress = () => console.log('progressing');

const textureLoader = new TextureLoader(loadingManager);
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

const colorTexture = textureLoader.load(colorImage);
const OCTexture = textureLoader.load(ambientOcclusionImage);
const heightTexture = textureLoader.load(heightImage);
const metalicTexture = textureLoader.load(metalicImage);
const normalTexture = textureLoader.load(normalImage);
const opacityTexture = textureLoader.load(opacityImage);
const roughnessTexture = textureLoader.load(roughnessImage);

colorTexture.minFilter = NearestFilter

const cube = new Mesh(
    new BoxGeometry(),
    new MeshBasicMaterial({ map: colorTexture })
);

scene.add(cube);

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