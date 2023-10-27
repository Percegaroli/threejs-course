import { Scene, PerspectiveCamera, WebGLRenderer, BufferGeometry, BufferAttribute, Points, PointsMaterial, AdditiveBlending, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const gui = new GUI();

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

const scene = new Scene();

const parameters = {
    count: 100000,
    size: .01,
    radius: 5,
    spin: 1,
    branches: 3,
    randomness: .2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: "#1b3984"
};

let geometry: BufferGeometry | null = null;
let material: PointsMaterial | null = null;
let particle: Points | null = null;

const generateGalaxy = () => {
    if (geometry && material && particle){
        material.dispose();
        geometry.dispose();
        scene.remove(particle);
    }

    geometry = new BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new Color(parameters.insideColor);
    const outsideColor = new Color(parameters.outsideColor);

    for (let index = 0; index < parameters.count; index++){
        const index3 = index * 3
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (index % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? -1: 1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? -1: 1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? -1: 1)

        positions[index3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[index3 + 1] = randomY;
        positions[index3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(outsideColor, radius / parameters.radius);

        colors[index3] = mixedColor.r;
        colors[index3 + 1] = mixedColor.g;
        colors[index3 + 2] = mixedColor.b;
    }
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    material =  new PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true
    })
    particle = new Points(geometry, material);
    scene.add(particle);
}

generateGalaxy();

gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(.001).max(.1).step(.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(.01).max(20).step(.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

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