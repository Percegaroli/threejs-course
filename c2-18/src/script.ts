import { Scene, PerspectiveCamera, WebGLRenderer, PointsMaterial, Points, BufferGeometry, BufferAttribute, TextureLoader, AdditiveBlending, Clock } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import particleImage from './assets/particles/2.png';

const canvas = document.querySelector('.webgl') as HTMLElement

const textureLoader = new TextureLoader();

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

const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for(let index = 0; index < count * 3; index++){
    positions[index] = (Math.random() -.5) * 10;
    colors[index] = Math.random();
}
const particlesGeometry = new BufferGeometry();
particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new BufferAttribute(colors, 3));

const particleTexture = textureLoader.load(particleImage);
const particlesMaterial = new PointsMaterial({
    size: .1,
    sizeAttenuation: true,
    alphaMap: particleTexture,
    //color: '#ff88cc',
    //alphaTest: .001,
    //depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
    transparent: true
});

const particles = new Points(particlesGeometry, particlesMaterial);
scene.add(particles);


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