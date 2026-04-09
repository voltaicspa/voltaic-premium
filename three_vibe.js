import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';

const container = document.getElementById('three-container');
if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = window.innerWidth < 768 ? 2.8 : 2.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // TIERRA CON EFECTO DATA
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load('img/earth_spherical.jpg'); 
    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshPhongMaterial({ 
            map: earthTexture, 
            shininess: 50, 
            emissive: 0x112244, 
            emissiveIntensity: 0.3 
        })
    );
    group.add(earth);

    // ANILLO DE ESCANEO VOLUMÉTRICO
    const ringGeo = new THREE.TorusGeometry(1.2, 0.005, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3B82F6, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // LUZ DIRECCIONAL (SOL)
    const sun = new THREE.DirectionalLight(0xffffff, 2.0);
    sun.position.set(5, 3, 5);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x404040, 2.0));

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });
    document.addEventListener('touchmove', (e) => {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.002;
        
        // El anillo de escaneo sube y baja físicamente rodeando la esfera
        const time = Date.now() * 0.002;
        ring.position.y = Math.sin(time) * 0.9;
        
        // Interactividad suave
        group.rotation.y += (mouseX * 0.4 - group.rotation.y) * 0.05;
        group.rotation.x += (mouseY * 0.4 - group.rotation.x) * 0.05;
        
        renderer.render(scene, camera);
    }
    animate();
}