import { 
    Clock, 
    ColorManagement, 
    TextureLoader,
    Mesh,
    MeshStandardMaterial ,
    PlaneGeometry,
    AmbientLight,
    DirectionalLight,
    PerspectiveCamera,
    WebGLRenderer,
    LinearSRGBColorSpace,
    Scene,
    Group,
    BoxGeometry,
    ConeGeometry,
    SphereGeometry,
    PointLight,
    Fog,
    RepeatWrapping,
    PCFSoftShadowMap
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import colorImage from '../../assets/woodDoor/Door_Wood_001_basecolor.jpg';
import ambientOcclusionImage from '../../assets/woodDoor/Door_Wood_001_ambientOcclusion.jpg';
import heightImage from '../../assets/woodDoor/Door_Wood_001_height.png';
import metalicImage from '../../assets/woodDoor/Door_Wood_001_metallic.jpg';
import opacityImage from '../../assets/woodDoor/Door_Wood_001_opacity.jpg';
import roughnessImage from '../../assets/woodDoor/Door_Wood_001_roughness.jpg';
import normalImage from '../../assets/woodDoor/Door_Wood_001_normal.jpg';
import brickColorImage from '../../assets/bricks/color.jpg'
import brickAOImage from '../../assets/bricks/ambientOcclusion.jpg'
import brickNormalImage from '../../assets/bricks/normal.jpg'
import brickRoughnessImage from '../../assets/bricks/roughness.jpg'
import grassColorImage from '../../assets/grass/color.jpg'
import grassAOImage from '../../assets/grass/ambientOcclusion.jpg'
import grassNormalImage from '../../assets/grass/normal.jpg'
import grassRoughnessImage from '../../assets/grass/roughness.jpg'



ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('.webgl') as any;

// Scene
const scene = new Scene()

const fogColor = '#282637';
const fog = new Fog(fogColor, 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new TextureLoader()

/**
 * House
 */
const house = new Group();
scene.add(house);

const brickColorTexture = textureLoader.load(brickColorImage);
const brickAOTexture = textureLoader.load(brickAOImage);
const brickNormalTexture = textureLoader.load(brickNormalImage);
const brickRoughnessTexture = textureLoader.load(brickRoughnessImage);

const wallsHeight = 2.5;
const wallsDepth = 4;
const walls = new Mesh(
    new BoxGeometry(4, wallsHeight, wallsDepth),
    new MeshStandardMaterial({ 
        map: brickColorTexture,
        aoMap: brickAOTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture
     })
)
walls.position.y = wallsHeight / 2;
house.add(walls);

const roofHeight = 1;
const roof = new Mesh(
    new ConeGeometry(3.5, 1, 4),
    new MeshStandardMaterial({ color: '#b35f45'})
)
roof.position.y = wallsHeight + (roofHeight / 2);
roof.rotateY(Math.PI / 4);
house.add(roof);

const doorColorTexture = textureLoader.load(colorImage);
const doorOCTexture = textureLoader.load(ambientOcclusionImage);
const doorHeightTexture = textureLoader.load(heightImage);
const doorMetalicTexture = textureLoader.load(metalicImage);
const doorNormalTexture = textureLoader.load(normalImage);
const doorOpacityTexture = textureLoader.load(opacityImage);
const doorRoughnessTexture = textureLoader.load(roughnessImage);

const doorHeight = 2;
const door = new Mesh(
    new PlaneGeometry(2, doorHeight, 100, 100),
    new MeshStandardMaterial({ 
        map: doorColorTexture,
        normalMap: doorNormalTexture,
        alphaMap: doorOpacityTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalicTexture,
        aoMap: doorOCTexture,
        displacementMap: doorHeightTexture,
        displacementScale: .1,
        transparent: true
    })
)
door.position.y = doorHeight / 2;
door.position.z = wallsDepth / 2 + .01;
house.add(door);

const bushGeometry = new SphereGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({ color: "#89c854" });

const bush1 = new Mesh(bushGeometry, bushMaterial);
bush1.scale.set(.5, .5, .5);
bush1.position.set(.8, .2, 2.2);

const bush2 = new Mesh(bushGeometry, bushMaterial);
bush2.scale.set(.25, .25, .25);
bush2.position.set(1.4, .1, 2.1);

const bush3 = new Mesh(bushGeometry, bushMaterial);
bush3.scale.set(.4, .4, .4);
bush3.position.set(-.8, .1, 2.2);

const bush4 = new Mesh(bushGeometry, bushMaterial);
bush4.scale.set(.15, .15, .15);
bush4.position.set(-1, .05, 2.6);

house.add(bush1, bush2, bush3, bush4);

const graves = new Group();
scene.add(graves);

const graveGeometry = new BoxGeometry(.6, .8, .2);
const graveMaterial = new MeshStandardMaterial({ color: "#b2b6b1" });

for (let index = 0; index < 50; index++){
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const grave = new Mesh(graveGeometry, graveMaterial);
    grave.position.set(
        Math.sin(angle) * radius,
        .3,
        Math.cos(angle) * radius
    );
    grave.rotateY((Math.random() - .5) * .4);
    grave.rotateZ((Math.random() - .5) * .4);
    grave.castShadow = true;
    graves.add(grave);
}

// Floor
const grassColorTexture = textureLoader.load(grassColorImage);
const grassAOTexture = textureLoader.load(grassAOImage);
const grassNormalTexture = textureLoader.load(grassNormalImage);
const grassRoughnessTexture = textureLoader.load(grassRoughnessImage);

[grassColorTexture, grassAOTexture, grassNormalTexture, grassRoughnessTexture].forEach(texture => {
    texture.repeat.set(8, 8)
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
});

const floor = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshStandardMaterial({ 
        map: grassColorTexture,
        aoMap: grassAOTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
     })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new AmbientLight('#b9d5ff', .4)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new DirectionalLight('#b9d5ff', .4)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new PointLight('#ff7d46', 3, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

const ghost1 = new PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2 = new PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new PointLight("#ffff00", 2, 3);
scene.add(ghost3);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(fogColor);


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

[moonLight, doorLight, ghost1, ghost2, ghost3].forEach(light => {
    light.castShadow = true
    light.shadow.mapSize.width = 256;
    light.shadow.mapSize.height = 256;
    light.shadow.camera.far= 7;
});
[walls, bush1, bush2, bush3, bush4].forEach(mesh => mesh.castShadow = true);
floor.receiveShadow = true;

moonLight.shadow.camera.far = 15;

/**
 * Animate
 */
const clock = new Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()