import * as THREE from 'https://unpkg.com/three@0.136.0/build/three.module.js';

/* =========================================
   1. Configuración de Three.js
   ========================================= */
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const coreGeometry = new THREE.TorusKnotGeometry(0.8, 0.25, 128, 16);
const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x00ffcc,
    emissiveIntensity: 0.9,
    wireframe: true,
    roughness: 0.1,
    metalness: 1.0
});
const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(coreMesh);

const wireGeometry = new THREE.BoxGeometry(3.5, 3.5, 3.5);
const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x0f172a, wireframe: true, transparent: true, opacity: 0.3 });
const edges = new THREE.EdgesGeometry(wireGeometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.2 });
const wireMesh = new THREE.LineSegments(edges, lineMaterial);
scene.add(wireMesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x10b981, 3, 50);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/* =========================================
   2. Parallax del Mouse
   ========================================= */
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
});

/* =========================================
   3. Bucle de Animación 3D
   ========================================= */
function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    coreMesh.rotation.y += 0.008;
    coreMesh.rotation.x += 0.005;
    coreMesh.rotation.z += 0.003;
    
    wireMesh.rotation.y -= 0.002;
    wireMesh.rotation.x -= 0.001;

    const time = Date.now() * 0.002;
    const pulse = 1 + Math.sin(time) * 0.05; 
    coreMesh.scale.set(pulse, pulse, pulse);

    scene.rotation.x = targetY * 0.5;
    scene.rotation.y = targetX * 0.5;

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

/* =========================================
   4. Animación Secuencial n8n (Scroll)
   ========================================= */
const n8nCanvas = document.getElementById('n8n-animated-canvas');
const n8nObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.3 });

if(n8nCanvas) {
    n8nObserver.observe(n8nCanvas);
}

/* =========================================
   5. Animación de Contadores y ScrollReveal
   ========================================= */
const counters = document.querySelectorAll('.counter');
const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / 200;

        if (count < target && target > 0) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(animateCounters, 10);
        } else if (count > target && target < 0) {
            counter.innerText = Math.floor(count - (Math.abs(target) / 200));
            setTimeout(animateCounters, 10);
        } else {
            counter.innerText = target;
        }
    });
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            counters.forEach(c => c.innerText = "0");
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelector('.kpi-section').querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter.parentElement);
});

const sr = ScrollReveal({ distance: '60px', duration: 1000, delay: 200, reset: false });
sr.reveal('.sr-left', { origin: 'left' });
sr.reveal('.sr-right', { origin: 'right' });
sr.reveal('.sr-bottom', { origin: 'bottom', interval: 200 });