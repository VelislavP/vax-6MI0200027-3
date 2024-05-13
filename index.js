import * as THREE from "three";
import { vaxInitParallax, light, scene, camera, renderer } from "vax";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

vaxInitParallax(animate);

const controls = new OrbitControls( camera, renderer.domElement );

const coneGeometry = new THREE.ConeGeometry(5, 20, 64);
const containerGeometry = new THREE.BoxGeometry(200, 2, 200);
const containerMaterial = new THREE.MeshLambertMaterial({ color: 'green'});
const coneMaterial = new THREE.MeshLambertMaterial( {color: 'red'} );

light.intensity = 8;
light.position.set(0, 0, 0);
camera.position.set(0, 0, 0);

const conesNumber = 300;
const objects = [];

for (let i = 0; i < 6; i++) {
	const wall = new THREE.Mesh(containerGeometry, containerMaterial);
	
	wall.position.y -= 2;

	for (let j = 0; j < conesNumber; j++) {
		objects[j] = new THREE.Mesh(coneGeometry, coneMaterial);

		objects[j].scale.set(0.5, 0.5, 0.5);

		objects[j].position.set(
			THREE.MathUtils.randFloat(-100, 100),
			6,
			THREE.MathUtils.randFloat(-100, 100)
		);

		wall.add(objects[j]);
	}

	switch (i) {
  		case 0:
			wall.rotation.set(Math.PI / 2, 0, 0);
			wall.position.set(0, 0, -100)
			break;
		case 1:
    		wall.rotation.set(Math.PI / 2, 0, Math.PI / 2);
			wall.position.set(100, 0, 0)
			break;
		case 2:
    		wall.rotation.set(Math.PI, Math.PI, Math.PI / 2);
			wall.position.set(-100, 0, 0)
			break;
		case 3:
			wall.rotation.set(Math.PI / 2, Math.PI, Math.PI);
			wall.position.set(0, 0, 100)
			break;
		case 4:
			wall.position.set(0, -100, 0);
			break;
		case 5:
			wall.rotation.set(Math.PI, 0, 0);
			wall.position.set(0, 100, 0);
			break;
 		default:
    		break;
	}

	scene.add(wall);

	for (let j = 0; j < conesNumber; j++) {
		scene.attach(objects[j]);
		objects[j].rotation.set(0, 0, 0);
	}
}

window.addEventListener("deviceorientation", deviceOrientation, true);

let previousvarter;
let previousGamma;
let previousAlpha;

let deviceNotFound = false;
			
function deviceOrientation( event )
{
	let alpha = event.alpha;

	if( alpha === null ) alert("Error: Cannot find device orientation");

	let gamma = event.gamma;

	if( gamma === null ) alert("Error: Cannot find device orientation");

	deviceNotFound = !gamma && !alpha;
				
	if( gamma >= 0 ) {
		gamma = 90-gamma;

		if(!previousvarter){
			previousvarter = 'A';
			previousGamma = gamma;
			previousAlpha = alpha;
		} else {
			if (previousvarter != 'A'){
				if (Math.abs(previousGamma-gamma) < 30) {
					previousvarter = 'A';
					previousGamma = gamma;
					previousAlpha = alpha;
				} else {
					alpha = alpha - 180;
					gamma = previousGamma;
				}
			} else {
				previousGamma = gamma;
				previousAlpha = alpha;
			}
		}
	} else {
		alpha = alpha+180;
		gamma = -90-gamma;

		if (!previousvarter) {
			previousvarter = 'A';
			previousGamma = gamma;
			previousAlpha = alpha;
		} else {
			if (previousvarter != 'B') {
				if (Math.abs(previousGamma-gamma) < 30) {
					previousvarter = 'B';
					previousGamma = gamma;
					previousAlpha = alpha;
				} else {
					alpha = alpha + 180;
					gamma = previousGamma;
				}
			} else {
				previousGamma = gamma;
				previousAlpha = alpha;
			}
		}
	}
									
	alpha = THREE.MathUtils.degToRad( alpha );
	gamma = THREE.MathUtils.degToRad( gamma );
				
	camera.rotation.set( gamma, alpha, 0, 'YXZ' );
}

function animate(t)
{
	if (deviceNotFound) {
		camera.rotation.x += 0.01;
		camera.rotation.z += 0.01;
		camera.rotation.y += 0.01;
	}
}
