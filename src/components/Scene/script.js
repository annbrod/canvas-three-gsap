import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


import bg from '/src/assets/images/bg.jpg'

const monkeyUrl = new URL('../../assets/monkey.glb', import.meta.url);
//создание сцены
const scene = new THREE.Scene();

//создание камеры. (поле видимости, аспект-ратио, ближе, дальше)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


//рендеринг сцены
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})

const orbit = new OrbitControls( camera, renderer.domElement );

camera.position.z = 5;
orbit.update();
// const axesHelper = new THREE.AxesHelper(5);
// scene.add( axesHelper );

//создание куба
const geometry = new THREE.BoxGeometry( 2, 2, 2 );

var cubeMaterials = [
    new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/src/assets/images/brick-1.jpg'), side: THREE.DoubleSide }), //правая
    new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/src/assets/images/brick-1.jpg'), side: THREE.DoubleSide }), // левая
    new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/src/assets/images/wood.jpeg'), side: THREE.DoubleSide }), //верхняя
    new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/src/assets/images/wood.jpeg'), side: THREE.DoubleSide }), //нижняя
    new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/src/assets/images/brick-1.jpg'), side: THREE.DoubleSide }), //задняя
    new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/src/assets/images/brick-1.jpg'), side: THREE.DoubleSide }) //передняя
]
//задание цвета
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
const cube = new THREE.Mesh( geometry, cubeMaterials );
scene.add( cube );
cube.position.set(5, 1, 0);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide, wireframe: true});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;


const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff, side: THREE.DoubleSide, wireframe: false});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);
sphere.position.set(-10, 10, 0);


const sphere2Geometry = new THREE.SphereGeometry(4);

// const vShader = `
//     void main() {
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `;

// const fShader = `
//     void main() {
//         gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//     }
// `;

const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

// const gridHelper = new THREE.GridHelper(30);
// scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight(0xffffff,1);
directionalLight.position.set(0, 2, 5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;
directionalLight.shadow.camera.top = 12;
scene.add(directionalLight);

// const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
// scene.add( helper );


const spotLight = new THREE.SpotLight( 0xff0000, 400 );
spotLight.position.set( -16, 10, 0 );
scene.add( spotLight );
spotLight.castShadow = true;
// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add (spotLightHelper);
spotLight.angle = 1;


// scene.fog = new THREE.Fog( 0xffffff, 0, 200 );
scene.fog = new THREE.FogExp2( 0xffffff, 0.01 );

// renderer.setClearColor('#FFDAB9');
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(bg)


const gui = new dat.GUI();

const options = {
    sphereColor: '#0000ff',
    wireframe: false,
    speed: 0.01,
    angle: 1,
    penubmbra: 0,
    intensity: 400
};

const assetLoader = new GLTFLoader();
assetLoader.load(monkeyUrl.href, function(gltf){
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 4, 10);
}, undefined, function(error) {
    console.log(error);
});

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
})

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
})

gui.add(options, 'speed', 0, 0.1);

gui.add(options, 'angle', 0, 1);
gui.add(options, 'penubmbra', 0, 1);
gui.add(options, 'intensity', 100, 1000);


let step = 0;

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();
const sphereId = sphere.id;

cube.name = 'theBox';

function animate() {
	requestAnimationFrame( animate );
	
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    step += options.speed;
    sphere.position.y = 20 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penubmbra = options.penubmbra;
    spotLight.intensity = options.intensity;

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    // console.log(intersects);
    
    for(let i= 0; i < intersects.length; i++){
        if(intersects[i].object.id === sphereId) {
            intersects[i].object.material.color.set(0xff0000);
        }

        if(intersects[i].object.name === 'theBox') {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }
    }

    plane2.geometry.attributes.position.array[12] =5 * Math.random();
    plane2.geometry.attributes.position.array[13] =5 * Math.random();
    plane2.geometry.attributes.position.array[14] =5 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ] =5 * Math.random();

    plane2.geometry.attributes.position.needsUpdate = true
    renderer.render( scene, camera );
    // spotLightHelper.update();
}
animate();