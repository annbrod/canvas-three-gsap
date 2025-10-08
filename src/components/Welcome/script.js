import * as THREE from 'three';
import { gsap } from "gsap";

let container, camera, scene, renderer, particleLight, arrow, arrowId;

const cubes = [];
const wrapper = document.querySelector('.screen--first');
const nextLayer = document.querySelector('.screen--second');
const rayCaster = new THREE.Raycaster();
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2.5);
const directionalLight = new THREE.DirectionalLight(0xff8900,7);
let scrollPosition = 0;
let touchPos;

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove );

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

document.addEventListener( 'pointerdown', onPointerDown );

init();
animate();


function init() {

    container = document.createElement( 'div' );
    wrapper.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.position.z = 3;

    //общий фон
    const path = 'src/assets/images/texture';
    const format = '.jpg';
    const urls = [
        path + format, path + format,
        path + format, path + format,
        path + format, path + format
    ]

    const textureCube = new THREE.CubeTextureLoader().load( urls );

    //создание сцены, добавление фона
    scene = new THREE.Scene();
    scene.background = textureCube;
    scene.backgroundBlurriness = 0.045;
    scene.backgroundIntensity = 0.8;


    //летающие кубы
    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: textureCube, reflectivity: 0.95 } );

    for ( let i = 0; i < 100; i ++ ) {

        const mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

        scene.add( mesh );
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        cubes.push( mesh );

    }


    const width = window.innerWidth || 2;
    const height = window.innerHeight || 2;


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    container.appendChild( renderer.domElement );

    //добавление теней
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //добавление общего света
    scene.add( ambientLight );

    //добавление света сбоку
    directionalLight.position.set(-10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
    // scene.add( helper );


    //добавление летающего шарика, который освещает все вокруг
    particleLight = new THREE.Mesh(
        new THREE.SphereGeometry( .08, 8, 8 ),
        new THREE.MeshPhongMaterial( { color: 0xffffff, wireframe: true } )
    );
    scene.add( particleLight );

    particleLight.add( new THREE.PointLight( 0xffffff, 30 ) );

    //стрелка вниз
    const arrowGeometry = new THREE.RingGeometry(0.1, 0.2, 3, 5);
    const arrowMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.DoubleSide, wireframe:true } );
    arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    scene.add(arrow);
    arrow.position.y = -1;
    arrow.rotation.z = 0.5;
    arrow.add( new THREE.PointLight(0xffffff, 3));
    arrowId = arrow.id

    function arrowRotate() {
        let tl = gsap.timeline();
        tl.to(arrow.rotation, { duration: 3, y: 10 });
        return tl;
    }

    function arrowBounce() {
        function goBottom() {
            let tl = gsap.timeline();
            tl.to(arrow.position, {duration: 0.6, y:-1.1});
            return tl;
        }

        function goTop() {
            let tl = gsap.timeline();
            tl.to(arrow.position, {duration: 0.6, y:-0.9});
            return tl;
        }

        let bounce = gsap.timeline({duration: 1.2, repeat:3,ease: "expo.out", yoyo:true});
        bounce.add(goBottom())
            .add(goTop())
        return bounce; 
    }

    let master = gsap.timeline({repeat: -1});
    master.add(arrowRotate())
      master.add(arrowBounce()) 

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//Добавление классов для появления текста
function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;


    if (mouseX > 3 || mouseX < -3) {
        wrapper.classList.add('center-hide');
        wrapper.classList.remove('screen--right');
        wrapper.classList.remove('screen--left');
    }
    if (mouseX > 3.7) {
        wrapper.classList.add('screen--right');
    }

    if (mouseX < -3.7) {
        wrapper.classList.add('screen--left');
    }

    if (mouseX > -2 && mouseX < 2) {
        wrapper.classList.remove('center-hide');
    }
}

function onScrollDown () {
    gsap.to(ambientLight, {intensity: 1, duration: 0.6} );
    gsap.to(directionalLight, {intensity: 0, duration: 0.6} );
    wrapper.classList.add('gone');
    nextLayer.classList.add('shown')
}


function onPointerDown () {
    mousePosition.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
    rayCaster.setFromCamera( mousePosition, camera )
    const intersects = rayCaster.intersectObjects(scene.children);
    for(let i = 0; i < intersects.length; i ++ ){
        if(intersects[i].object.id === arrowId) {
            gsap.to(ambientLight, {intensity: 1, duration: 0.6} );
            gsap.to(directionalLight, {intensity: 0, duration: 0.6} );
            wrapper.classList.add('gone');
            nextLayer.classList.add('shown')
        }
    }
}

//

function animate() {

    requestAnimationFrame( animate );
    render();

}


function render() {

    const timer = 0.0001 * Date.now();

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    
    //следить за движением мыши
    camera.lookAt( scene.position );
    
    //следить за расположением объектов для ховера
    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    // console.log(intersects);

    for(let i = 0; i < intersects.length; i ++ ){
        if(intersects[i].object.id === arrowId) {
            console.log('hover')
            gsap.to(arrow.rotation, { duration: 3, y: 50 });
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "initial";
        }
    }

    particleLight.position.x = Math.sin( timer * 5 ) * 10;
    particleLight.position.y = Math.cos( timer * 3 ) * 4;
    particleLight.position.z = Math.cos( timer * 1 ) * 5;

    for ( let i = 0; i <  cubes.length; i ++ ) {

        const cube = cubes[ i ];

        cube.position.x = 5 * Math.cos( timer + i );
        cube.position.y = 5 * Math.sin( timer + i * 1.1 );

    }

    // рендеринг сцены
    renderer.render(scene, camera);
}

wrapper.addEventListener( 'wheel', function(e) {
    let newScrollPosition = e.deltaY;
    if (newScrollPosition - scrollPosition > 2 ) {
        onScrollDown();
    }
});

wrapper.addEventListener( 'touchstart', function(e) {
    touchPos = e.changedTouches[0].clientY;
});

wrapper.addEventListener( 'touchmove', function(e) {
    let newTouchPos = e.changedTouches[0].clientY;
    if(newTouchPos < touchPos) {
        onScrollDown();
    }
} );