import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// same [h, s, b] convention as sketch.js's paletteData (trait A, for now —
// the full 12-palette / trait-select system isn't wired up here yet)
const traitA = {
  body: [1, 50, 50] as const,
  door: [50, 70, 50] as const,
};

function hsbToColor(h: number, s: number, b: number): THREE.Color {
  const sat = s / 100;
  const val = b / 100;
  const c = new THREE.Color();
  c.setHSL(h / 360, sat, val - (val * sat) / 2);
  return c;
}

const canvas = document.querySelector<HTMLCanvasElement>('#scene')!;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x16171d);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(3, 2.5, 4);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;

// placeholder 'oven folded up' — a plain box for now, with a smaller box
// standing in for the door. Real geometry comes later.
const oven = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 1.2, 1.2),
  new THREE.MeshStandardMaterial({ color: hsbToColor(...traitA.body) })
);
oven.add(body);

const door = new THREE.Mesh(
  new THREE.BoxGeometry(0.05, 0.9, 0.9),
  new THREE.MeshStandardMaterial({ color: hsbToColor(...traitA.door) })
);
door.position.set(0.825, 0, 0);
oven.add(door);

scene.add(oven);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(4, 5, 3);
scene.add(keyLight);

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
