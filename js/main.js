document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------
    // SCÈNE 3D AVEC THREE.JS
    // ----------------------------------------
    const container = document.getElementById('canvas-container');
    // S'assurer que le conteneur existe avant d'exécuter Three.js
    if (container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Étoiles
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const posArray = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * (Math.random() * 5) * 100;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const starMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0x8e44ad,
        });
        const starMesh = new THREE.Points(starGeometry, starMaterial);
        scene.add(starMesh);

        camera.position.z = 5;

        // Mouvement de la souris
        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        function animate() {
            requestAnimationFrame(animate);

            // Animation des étoiles
            starMesh.rotation.y += 0.0001;

            // Mouvement de la caméra basé sur la souris pour un effet parallaxe
            if (mouseX > 0) {
                camera.position.x += (mouseX / window.innerWidth * 2 - 1 - camera.position.x) * 0.01;
                camera.position.y += (-(mouseY / window.innerHeight * 2 - 1) - camera.position.y) * 0.01;
            }

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } // Fin de la condition if (container)

    // ----------------------------------------
    // ANIMATIONS AVEC GSAP & SCROLLTRIGGER
    // ----------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    // Animation du titre héro
    gsap.from(".hero-content > *", {
        duration: 1,
        opacity: 0,
        y: 50,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
    });

    // Animation des cartes au défilement
    // *** MIS À JOUR DU SÉLECTEUR ICI ***
    const cards = document.querySelectorAll(".content-card, .skill-card, .project-card-elite");
    cards.forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // ----------------------------------------
    // EFFET 3D SUR LES CARTES DE PROJET
    // ----------------------------------------
    // *** MIS À JOUR DU SÉLECTEUR ICI ***
    const projectCards = document.querySelectorAll('.project-card-elite');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8; // Réduction de l'angle pour un effet plus subtil
            const rotateY = ((x - centerX) / centerX) * 8; 

            gsap.to(card, {
                duration: 0.7, // Animation plus douce
                rotationX: rotateX,
                rotationY: rotateY,
                scale: 1.03, // Léger zoom au survol
                ease: 'power3.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.7,
                rotationX: 0,
                rotationY: 0,
                scale: 1.0, // Retour à l'échelle normale
                ease: 'power3.out'
            });
        });
    });

});
