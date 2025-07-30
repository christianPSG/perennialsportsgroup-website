document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      // Prevent scroll jumping on mobile by using simpler approach
      if (isMobileDevice()) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }
  });
});

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData);

  if (!data.name || !data.email || !data.message) {
    showNotification("Please fill in all required fields.", "error");
    return;
  }

  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  fetch(this.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        showNotification(
          "Thank you for your message! We will contact you soon at " +
          data.email,
          "success"
        );
        this.reset();
      } else {
        showNotification(
          "There was a problem sending your message. Please try again or email us directly at info@perennialsportsgroup.com",
          "error"
        );
      }
    })
    .catch((error) => {
      showNotification(
        "There was a problem sending your message. Please try again or email us directly at info@perennialsportsgroup.com",
        "error"
      );
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
});

function showNotification(message, type) {
  const existing = document.querySelector(".notification-popup");
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification-popup ${type}`;
  notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-message">${message}</span>
                    <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

if (!isMobileDevice()) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });
}

function animateCountUp() {
  const counters = document.querySelectorAll(".stat-number[data-target]");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = isMobileDevice() ? 1500 : 1000; 
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

function initStatsCountingAnimation() {
  const statsSection = document.querySelector(".hero-stats");
  if (!statsSection) return;

  if (isMobileDevice()) {
    setTimeout(animateCountUp, 500);
  } else {
    setTimeout(animateCountUp, 1500);
  }
}

initStatsCountingAnimation();

function setupMobileHeroAnimations() {
  const heroLogo = document.querySelector(".hero-logo");
  const heroTagline = document.querySelector(".hero-tagline");
  const heroCta = document.querySelector(".hero-cta");
  const heroStats = document.querySelector(".hero-stats");

  console.log("Mobile hero elements found:", {
    logo: !!heroLogo,
    tagline: !!heroTagline,
    cta: !!heroCta,
    stats: !!heroStats,
  });

  [heroLogo, heroTagline, heroCta, heroStats].forEach((element) => {
    if (element) {
      element.style.display = "block";
      element.style.visibility = "visible";
      element.style.position = "relative";
      element.style.zIndex = "1000";

      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "all 0.8s ease-out";
    }
  });

  setTimeout(() => {
    if (heroTagline) {
      heroTagline.style.opacity = "1";
      heroTagline.style.transform = "translateY(0)";
    }
  }, 500); 

  setTimeout(() => {
    if (heroLogo) {
      heroLogo.style.opacity = "1";
      heroLogo.style.transform = "translateY(0)";
      console.log("Logo should be visible now");
    }
    if (heroCta) {
      heroCta.style.opacity = "1";
      heroCta.style.transform = "translateY(0)";
    }
    if (heroStats) {
      heroStats.style.opacity = "1";
      heroStats.style.transform = "translateY(0)";
    }
  }, 1000);
}

let lastScrollTop = 0;
let scrollTimeout = null;
let isScrolling = false;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const el = entry.target;

      if (entry.isIntersecting) {
        if (el.id === "mission-vision-section") {
          el.classList.add("mission-vision-visible");
        } else if (el.id === "about-section") {
          el.classList.add("about-section-visible");
        } else if(el.id === "basketball-canvas") {
              initBasketballScene();
        }else{
                    el.classList.add("visible");
        }
      } else {
        if (el.id === "mission-vision-section") {
          el.classList.remove("mission-vision-visible");
        } else if (el.id === "about-section") {
          el.classList.remove("about-section-visible");
        } else {
          el.classList.remove("visible");
        }
      }
    });
  },
  {
    threshold: 0.2, 
  }
);

document.querySelectorAll(
  ".scroll-section, .contact-section, #mission-vision-section, #about-section, #basketball-canvas"
).forEach((section) => observer.observe(section));

particlesJS("particles-js", {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 5,
      },
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
});

function initLightParticles() {

  const lightParticlesConfig = {
    particles: {
      number: {
        value: 120,
        density: {
          enable: true,
          value_area: 600, 
        },
      },
      color: {
        value: "#1e3a8a",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 0.8,
          opacity_min: 0.2,
          sync: false,
        },
      },
      size: {
        value: 2.5, 
        random: true,
        anim: {
          enable: false,
          speed: 25,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#1e3a8a",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false,
        },
        onclick: {
          enable: false,
        },
        resize: true,
      },
    },
    retina_detect: true,
  };

  particlesJS("particles-scroll-section", lightParticlesConfig);
  particlesJS("particles-about-section", lightParticlesConfig);
  particlesJS("particles-mission-vision", lightParticlesConfig);
  particlesJS("particles-contact", lightParticlesConfig);
  particlesJS("particles-social", lightParticlesConfig);
}

setTimeout(() => {
  initLightParticles();
}, 1000);

let scene,
  camera,
  renderer,
  court,
  pillars = [];
let isScrollSectionVisible = false;

function initBasketballScene() {
  const canvas = document.getElementById("basketball-canvas");
  const container = canvas.parentElement;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
  );
  camera.position.set(0, 30, 0);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  createBasketballCourt();

  createShotFrequencyPillars();

  window.addEventListener("resize", onWindowResize);

  animate();

  setupScrollTrigger();
}

function createBasketballCourt() {
  const courtWidth = 25; 
  const courtLength = 23.5; 

  const gridOffsetZ = courtLength / 2; 

  const gridHelper = new THREE.GridHelper(courtLength, 20, 0x1a237e, 0x1a237e);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.6;
  gridHelper.position.set(0, 0.01, gridOffsetZ);
  scene.add(gridHelper);

  const gridHelper2 = new THREE.GridHelper(courtWidth, 16, 0x1a237e, 0x1a237e);
  gridHelper2.material.transparent = true;
  gridHelper2.material.opacity = 0.6;
  gridHelper2.rotateY(Math.PI / 2);
  gridHelper2.position.set(0, 0.01, gridOffsetZ);
  scene.add(gridHelper2);

  const courtGeometry = new THREE.PlaneGeometry(courtWidth, courtLength);
  const courtMaterial = new THREE.MeshLambertMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
  });
  court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.rotation.x = -Math.PI / 2;
  court.position.set(0, 0, gridOffsetZ);
  court.receiveShadow = true;
  scene.add(court);

  const arcPoints = [];
  const basketZ = -5.25;
  const arcRadius = 6.75; 
  const cornerDistance = 6.7;

  const startAngle = Math.acos(cornerDistance / arcRadius);
  const endAngle = Math.PI - startAngle;

  for (let angle = startAngle; angle <= endAngle; angle += 0.05) {
    const x = Math.cos(angle) * arcRadius;
    const z = basketZ + Math.sin(angle) * arcRadius;
    arcPoints.push(new THREE.Vector3(x, 0.03, z));
  }

  const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
  const threePointMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 5,
  });
  const threePointArc = new THREE.Line(arcGeometry, threePointMaterial);
  scene.add(threePointArc);

  const hoopGeometry = new THREE.RingGeometry(0.45, 0.5, 16);
  const hoopMaterial = new THREE.MeshLambertMaterial({ color: 0xff6600 });
  const hoop = new THREE.Mesh(hoopGeometry, hoopMaterial);
  hoop.rotation.x = -Math.PI / 2;
  hoop.position.set(0, 6.1, -5.25);
  scene.add(hoop);

  const backboardGeometry = new THREE.PlaneGeometry(1.8, 1.05);
  const backboardMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });
  const backboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
  backboard.position.set(0, 6.5, -6);
  scene.add(backboard);

  const poleGeometry = new THREE.CylinderGeometry(0.1, 0.12, 6.5, 8);
  const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(0, 3.25, -6);
  scene.add(pole);

  const armGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.75, 6);
  const armMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const arm = new THREE.Mesh(armGeometry, armMaterial);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(0, 6.1, -5.625);
  scene.add(arm);

  const bracketGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 6);
  const bracketMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
  const bracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
  bracket.position.set(0, 6.1, -5.25);
  scene.add(bracket);
}

function createShotFrequencyPillars() {
  const shotData = [];
  const basketX = 0;
  const basketZ = -5.25;

  // Paint area shots (high frequency, high efficiency) - close to basket
  for (let i = 0; i < 25; i++) {
    const angle = Math.random() * Math.PI; // Half circle in front of basket
    const radius = 1 + Math.random() * 2.5;
    const x = basketX + Math.cos(angle) * radius;
    const z = basketZ + Math.sin(angle) * radius;

    shotData.push({
      x: x,
      z: z,
      frequency: 80 + Math.random() * 120,
      efficiency: 0.55 + Math.random() * 0.25,
    });
  }

  // Mid-range shots (moderate frequency, moderate efficiency)
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI; // Half circle in front of basket
    const radius = 3 + Math.random() * 4;
    const x = basketX + Math.cos(angle) * radius;
    const z = basketZ + Math.sin(angle) * radius;

    shotData.push({
      x: x,
      z: z,
      frequency: 30 + Math.random() * 80,
      efficiency: 0.35 + Math.random() * 0.25,
    });
  }

  // Three-point shots along the arc (proper 3-point line)
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI; // Half circle arc
    const radius = 6.75 + Math.random() * 0.3; // NBA 3-point distance
    const x = basketX + Math.cos(angle) * radius;
    const z = basketZ + Math.sin(angle) * radius;

    shotData.push({
      x: x,
      z: z,
      frequency: 15 + Math.random() * 50,
      efficiency: 0.28 + Math.random() * 0.25,
    });
  }

  // Corner three-pointers (specific spots)
  for (let i = 0; i < 8; i++) {
    const side = i < 4 ? -1 : 1;
    const x = side * (7 + Math.random() * 0.5); // Corner 3 distance
    const z = basketZ + 1 + Math.random() * 2; // Slightly in front of basket

    shotData.push({
      x: x,
      z: z,
      frequency: 25 + Math.random() * 40,
      efficiency: 0.32 + Math.random() * 0.18,
    });
  }

  // Free throw line shots
  for (let i = 0; i < 15; i++) {
    const x = (Math.random() - 0.5) * 6; // Spread around free throw line
    const z = basketZ + 4.25; // Free throw distance from basket

    shotData.push({
      x: x,
      z: z,
      frequency: 40 + Math.random() * 60,
      efficiency: 0.38 + Math.random() * 0.22,
    });
  }

  // Extended range shots (beyond 3-point line)
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI;
    const radius = 8 + Math.random() * 2; // Deep 3s
    const x = basketX + Math.cos(angle) * radius;
    const z = basketZ + Math.sin(angle) * radius;

    shotData.push({
      x: x,
      z: z,
      frequency: 5 + Math.random() * 25,
      efficiency: 0.25 + Math.random() * 0.2,
    });
  }

  shotData.forEach((shot, index) => {
    // Calculate pillar height based on frequency (normalize to 0-6 range)
    const height = (shot.frequency / 200) * 6 + 0.3;

    // Use PSG website colors based on efficiency
    const efficiency = shot.efficiency;
    let color;

    if (efficiency >= 0.5) {
      // High efficiency: PSG Gold (#F4EFEB)
      color = new THREE.Color(0xf4efeb);
    } else if (efficiency >= 0.4) {
      // Medium efficiency: PSG Accent (#C7D9E5)
      color = new THREE.Color(0xc7d9e5);
    } else if (efficiency >= 0.35) {
      // Low-medium efficiency: PSG Secondary (#577C8D)
      color = new THREE.Color(0x577c8d);
    } else {
      // Low efficiency: PSG Primary (#2F4157)
      color = new THREE.Color(0x2f4157);
    }

    // Create pillar with smaller radius for more instances
    const pillarGeometry = new THREE.CylinderGeometry(0.15, 0.2, height, 8);
    const pillarMaterial = new THREE.MeshLambertMaterial({
      color: color,
      transparent: true,
      opacity: 0.85,
    });
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar.position.set(shot.x, height / 2, shot.z);
    pillar.castShadow = true;

    // Add subtle glow effect with PSG colors
    const glowGeometry = new THREE.CylinderGeometry(0.2, 0.25, height + 0.1, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(shot.x, height / 2, shot.z);

    scene.add(pillar);
    scene.add(glow);
    pillars.push({ pillar, glow, originalHeight: height });
  });
}

function setupScrollTrigger() {

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  let cameraAnimation = null;

  // ScrollTrigger for section visibility and camera animation
  ScrollTrigger.create({
    trigger: ".scroll-section",  // Make sure this matches your basketball section's selector
    start: "top bottom",
    end: "bottom 20%",
    onEnter: () => {
      isScrollSectionVisible = true;
      animatePillarsIn();

      // Kill previous camera animation if any
      if (cameraAnimation) cameraAnimation.kill();

      cameraAnimation = gsap.to(camera.position, {
        duration: 2,
        ease: "power2.inOut",
        x: 15,
        y: 12,
        z: 8,
        onUpdate: () => {
          camera.lookAt(0, 0, -5.25);
        },
      });

      // **Re-initialize basketball scene here**
      cleanupBasketballScene();   // <-- You need to write this to dispose previous scene properly
      initBasketballScene();
    },
    onLeave: () => {
      isScrollSectionVisible = false;
      if (cameraAnimation) {
        cameraAnimation.kill();
        cameraAnimation = null;
      }
    },
    onEnterBack: () => {
      isScrollSectionVisible = true;
      // Same as onEnter, re-init scene
      cleanupBasketballScene();
      initBasketballScene();
    },
    onLeaveBack: () => {
      isScrollSectionVisible = false;
      if (cameraAnimation) {
        cameraAnimation.kill();
        cameraAnimation = null;
      }
    },
  });

}

function animatePillarsIn() {

  pillars.forEach((pillarObj, index) => {
    gsap.fromTo(
      pillarObj.pillar.scale,
      { y: 0 },
      {
        y: 1,
        duration: 0.6,
        delay: 0,
        ease: "power2.out",
      }
    );
    gsap.fromTo(
      pillarObj.glow.scale,
      { y: 0 },
      {
        y: 1,
        duration: 0.6,
        delay: 0,
        ease: "power2.out",
      }
    );
  });
}

function animate() {
  requestAnimationFrame(animate);

  if (isScrollSectionVisible) {
    pillars.forEach((pillarObj, index) => {
      pillarObj.pillar.rotation.y += 0.005;
      pillarObj.glow.rotation.y += 0.005;
    });
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  const container = document.getElementById("basketball-canvas").parentElement;
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
}

window.addEventListener("load", () => {
  setTimeout(() => {
    initPlayerProfile();
  }, 1000);
});

// Also initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Backup initialization in case window load doesn't fire
  setTimeout(() => {
    if (!mobilityChart) {
      initPlayerProfile();
    }
  }, 2000);
});

function toggleBox(element) {

  // Close all other expanded boxes
  const allBoxes = document.querySelectorAll(".service-box"); // Change to your actual class
  allBoxes.forEach((box) => {
    if (box !== element) {
      box.classList.remove("expanded");
    }
  });

  // Toggle current box
  element.classList.toggle("expanded");
}

// Player Profile Interface
let currentChart = null;
let chartCanvas = null;

let radarAnimationState = {
  attributesVisible: false,
  top50Visible: false,
  conferenceVisible: false,
  currentProgress: 0,
};

function initPlayerProfile() {
  console.log("Initializing player profile...");

  // Initialize the Chart.js mobility chart with scroll triggers
  setTimeout(() => {
    setupRadarScrollTrigger();
  }, 500);
}

function setupRadarScrollTrigger() {
  const qbCanvas = document.getElementById("qb-mobility-chart");
  const wrCanvas = document.getElementById("wr-mobility-chart");

  if (!qbCanvas || !wrCanvas) {
    console.log("Mobility chart canvases not found");
    return;
  }

  console.log("Setting up Chart.js radar charts...");

  // Initialize both Chart.js radar charts
  initChartJsRadar(qbCanvas, "qb");
  initChartJsRadar(wrCanvas, "wr");

  // Disable chart ScrollTrigger on mobile for static mode
  if (!isMobileDevice()) {
    ScrollTrigger.create({
      trigger: "#mission-vision-section",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        updateChartJsRadar(progress, "qb");
        updateChartJsRadar(progress, "wr");
      },
    });
  } else {
    // For mobile, immediately show charts at full progress
    updateChartJsRadar(1, "qb");
    updateChartJsRadar(1, "wr");
  }
}

function initializeMobilityChart() {
  const canvas = document.getElementById("mobility-chart");
  if (!canvas) {
    console.log("Mobility chart canvas not found");
    return;
  }

  console.log("Drawing pocket mobility chart...");
  const ctx = canvas.getContext("2d");
  drawPocketMobilityChart(ctx, 1.0);
}

// Chart.js Radar Chart Implementation
let qbMobilityChart = null;
let wrMobilityChart = null;

function initChartJsRadar(canvas, position) {
  const ctx = canvas.getContext("2d");

  // Destroy existing chart if it exists
  if (position === "qb" && qbMobilityChart) {
    qbMobilityChart.destroy();
  } else if (position === "wr" && wrMobilityChart) {
    wrMobilityChart.destroy();
  }

  // Define data based on position
  let data, labels;

  if (position === "qb") {
    labels = [
      "Pocket Presence",
      "Scramble Ability",
      "Evasion",
      "Rollout Accuracy",
      "Escape Rate",
      "Mobility Index",
    ];
    data = {
      labels: labels,
      datasets: [
        {
          label: "Sample Player",
          data: [8.9, 4.2, 9.6, 7.1, 3.8, 9.3],
          backgroundColor: "rgba(199, 217, 229, 0.3)",
          borderColor: "#C7D9E5",
          borderWidth: 3,
          pointBackgroundColor: "#C7D9E5",
          pointBorderColor: "#F4EFEB",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.1,
          hidden: false,
        },
        {
          label: "League Average",
          data: [4.8, 5.3, 4.6, 5.7, 4.9, 5.1],
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.5)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(255, 255, 255, 0.7)",
          pointBorderColor: "rgba(255, 255, 255, 0.9)",
          pointBorderWidth: 1,
          pointRadius: 4,
          hidden: false, // Show immediately with text
        },
        {
          label: "Conference Average",
          data: [6.1, 6.8, 5.4, 6.9, 5.8, 6.3],
          backgroundColor: "rgba(87, 124, 141, 0.1)",
          borderColor: "rgba(87, 124, 141, 0.6)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(87, 124, 141, 0.8)",
          pointBorderColor: "rgba(87, 124, 141, 1)",
          pointBorderWidth: 1,
          pointRadius: 4,
          hidden: false, // Show immediately with text
        },
        {
          label: "Elite Threshold",
          data: [8.3, 7.6, 8.7, 8.1, 7.9, 8.4],
          backgroundColor: "rgba(244, 239, 235, 0.1)",
          borderColor: "rgba(244, 239, 235, 0.7)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(244, 239, 235, 0.9)",
          pointBorderColor: "#F4EFEB",
          pointBorderWidth: 1,
          pointRadius: 4,
          hidden: false, // Show immediately with text
        },
      ],
    };
  } else {
    labels = [
      "Route Precision",
      "Separation Speed",
      "Catch Radius",
      "YAC Ability",
      "Release Quickness",
      "Route Diversity",
    ];
    data = {
      labels: labels,
      datasets: [
        {
          label: "Sample Player",
          data: [9.1, 7.3, 8.8, 6.2, 9.4, 7.9],
          backgroundColor: "rgba(199, 217, 229, 0.3)",
          borderColor: "#C7D9E5",
          borderWidth: 3,
          pointBackgroundColor: "#C7D9E5",
          pointBorderColor: "#F4EFEB",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.1,
          hidden: false,
        },
        {
          label: "League Average",
          data: [4.9, 5.6, 4.3, 5.8, 4.7, 5.2],
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.5)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(255, 255, 255, 0.7)",
          pointBorderColor: "rgba(255, 255, 255, 0.9)",
          pointBorderWidth: 1,
          pointRadius: 4,
          hidden: false, // Show immediately with text
        },
        {
          label: "Conference Average",
          data: [6.4, 6.1, 6.7, 5.9, 6.3, 6.0],
          backgroundColor: "rgba(87, 124, 141, 0.1)",
          borderColor: "rgba(87, 124, 141, 0.6)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(87, 124, 141, 0.8)",
          pointBorderColor: "rgba(87, 124, 141, 1)",
          pointBorderWidth: 1,
          pointRadius: 4,
          hidden: false, // Show immediately with text
        },
        {
          label: "Elite Threshold",
          data: [8.2, 7.8, 8.6, 7.9, 8.1, 8.4],
          backgroundColor: "rgba(244, 239, 235, 0.1)",
          borderColor: "rgba(244, 239, 235, 0.7)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(244, 239, 235, 0.9)",
          pointBorderColor: "#F4EFEB",
          pointBorderWidth: 1,
          pointRadius: 4,
          hidden: false, // Show immediately with text
        },
      ],
    };
  }

  const config = {
    type: "radar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false, // Remove title as requested
        },
        legend: {
          display: false, // Remove legend completely
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          min: 0,
          ticks: {
            stepSize: 2,
            color: "rgba(255, 255, 255, 0.6)",
            font: {
              size: 11,
              family: "Inter",
              weight: "400",
            },
            backdropColor: "transparent",
          },
          grid: {
            color: "rgba(199, 217, 229, 0.3)",
            lineWidth: 1,
          },
          angleLines: {
            color: "rgba(199, 217, 229, 0.3)",
            lineWidth: 1,
          },
          pointLabels: {
            color: "rgba(255, 255, 255, 0.9)",
            font: {
              size: 13,
              weight: "500",
              family: "Inter",
            },
          },
        },
      },
      animation: {
        duration: 2000, // No animation on mobile
        easing: "easeInOutQuart",
      },
      interaction: {
        intersect: false,
        mode: "point",
      },
    },
  };

  if (position === "qb") {
    qbMobilityChart = new Chart(ctx, config);
  } else {
    wrMobilityChart = new Chart(ctx, config);
  }
}

function updateChartJsRadar(progress, position) {
  const chart = position === "qb" ? qbMobilityChart : wrMobilityChart;

  if (!chart || !chart.data || !chart.data.datasets) return;

  try {
    // Store original data values if not already stored
    if (!chart.originalData) {
      chart.originalData = chart.data.datasets.map((dataset) => [
        ...dataset.data,
      ]);
    }

    const datasets = chart.data.datasets;
    const originalData = chart.originalData;

    // For mobile devices, show full data immediately (static mode)
    if (isMobileDevice()) {
      datasets[0].data = [...originalData[0]]; // Sample Player
      datasets[1].data = [...originalData[1]]; // League Average
      datasets[2].data = [...originalData[2]]; // Conference Average
      datasets[3].data = [...originalData[3]]; // Elite Threshold
      chart.update("none");
      return;
    }

    // Charts are always visible (structure appears immediately)
    // No need to set hidden = false since charts start visible

    // Desktop progressive data animation sequence:
    // 0-25%: League Average data grows from 0 to full values
    // 25-50%: Conference Average data grows from 0 to full values
    // 50-75%: Elite Threshold data grows from 0 to full values
    // 75-100%: Sample Player data grows from 0 to full values

    // League Average (dataset 1) - 0-25% progress
    const leagueProgress = Math.max(0, Math.min(1, (progress - 0) / 0.25));
    datasets[1].data = originalData[1].map((value) => value * leagueProgress);

    // Conference Average (dataset 2) - 25-50% progress
    const conferenceProgress = Math.max(
      0,
      Math.min(1, (progress - 0.25) / 0.25)
    );
    datasets[2].data = originalData[2].map(
      (value) => value * conferenceProgress
    );

    // Elite Threshold (dataset 3) - 50-75% progress
    const eliteProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.25));
    datasets[3].data = originalData[3].map((value) => value * eliteProgress);

    // Sample Player (dataset 0) - 75-100% progress
    const playerProgress = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));
    datasets[0].data = originalData[0].map((value) => value * playerProgress);

    // Update chart with smooth animation
    chart.update("none"); // Use 'none' to avoid conflicting animations
  } catch (error) {
    console.error(`Error updating ${position} radar chart:`, error);
  }
}

// Legacy function - replaced by Chart.js implementation above
function drawPocketMobilityChart(ctx, progress = 1.0) {
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Chart dimensions
  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const maxRadius = Math.min(width, height) / 3;

  // Draw title
  ctx.fillStyle = "#F4EFEB";
  ctx.font = "bold 16px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Pocket Mobility Analysis", centerX, 25);

  // Mobility metrics with angles around the circle
  const metrics = [
    { label: "Pocket Presence", value: 8.7, angle: 0 },
    { label: "Scramble Ability", value: 7.8, angle: Math.PI / 3 },
    { label: "Evasion", value: 8.2, angle: (2 * Math.PI) / 3 },
    { label: "Rollout Accuracy", value: 8.9, angle: Math.PI },
    { label: "Escape Rate", value: 7.6, angle: (4 * Math.PI) / 3 },
    { label: "Mobility Index", value: 8.7, angle: (5 * Math.PI) / 3 },
  ];

  // Draw concentric circles (rating levels)
  for (let i = 1; i <= 5; i++) {
    const radius = (i / 5) * maxRadius;
    ctx.strokeStyle = "rgba(199, 217, 229, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Add scale numbers
    if (i % 2 === 0) {
      ctx.fillStyle = "rgba(244, 239, 235, 0.6)";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText((i * 2).toString(), centerX + radius + 10, centerY + 3);
    }
  }

  // Draw axis lines from center to each metric
  metrics.forEach((metric) => {
    const endX = centerX + Math.cos(metric.angle) * maxRadius;
    const endY = centerY + Math.sin(metric.angle) * maxRadius;

    ctx.strokeStyle = "rgba(199, 217, 229, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  });

  // Draw comparison overlays (league, conference, elite)
  const overlays = [
    {
      label: "League Avg",
      values: [5.9, 5.2, 5.8, 6.1, 5.4, 5.9],
      color: "rgba(255, 255, 255, 0.1)",
      strokeColor: "rgba(255, 255, 255, 0.3)",
    },
    {
      label: "Conference Avg",
      values: [6.4, 5.8, 6.2, 6.5, 5.9, 6.4],
      color: "rgba(199, 217, 229, 0.1)",
      strokeColor: "rgba(199, 217, 229, 0.4)",
    },
    {
      label: "Elite Threshold",
      values: [8.5, 8.0, 8.3, 8.7, 8.1, 8.5],
      color: "rgba(244, 239, 235, 0.1)",
      strokeColor: "rgba(244, 239, 235, 0.5)",
    },
  ];

  // Draw overlay polygons
  overlays.forEach((overlay) => {
    ctx.beginPath();
    overlay.values.forEach((value, index) => {
      const metric = metrics[index];
      const radius = (value / 10) * maxRadius;
      const x = centerX + Math.cos(metric.angle) * radius;
      const y = centerY + Math.sin(metric.angle) * radius;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();

    // Fill overlay
    ctx.fillStyle = overlay.color;
    ctx.fill();

    // Stroke overlay
    ctx.strokeStyle = overlay.strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Progressive animation based on scroll progress
  // 0-20%: Show attributes and axis lines only
  // 20-30%: Add League Average overlay
  // 30-60%: Add Top 50 QBs overlay
  // 60-90%: Add Conference QBs overlay
  // 90-100%: Add Sample Player polygon

  // Draw League Average overlay (appears at 20% progress)
  if (progress > 0.2) {
    const leagueAlpha = Math.min((progress - 0.2) / 0.1, 1.0);
    const leagueOverlay = overlays[0]; // League Avg

    ctx.globalAlpha = leagueAlpha;
    ctx.beginPath();
    leagueOverlay.values.forEach((value, index) => {
      const metric = metrics[index];
      const radius = (value / 10) * maxRadius;
      const x = centerX + Math.cos(metric.angle) * radius;
      const y = centerY + Math.sin(metric.angle) * radius;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = leagueOverlay.color;
    ctx.fill();
    ctx.strokeStyle = leagueOverlay.strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  // Draw Top 50 QBs overlay (appears at 30% progress)
  if (progress > 0.3) {
    const top50Alpha = Math.min((progress - 0.3) / 0.3, 1.0);
    const top50Overlay = overlays[2]; // Elite Threshold (representing Top 50)

    ctx.globalAlpha = top50Alpha;
    ctx.beginPath();
    top50Overlay.values.forEach((value, index) => {
      const metric = metrics[index];
      const radius = (value / 10) * maxRadius;
      const x = centerX + Math.cos(metric.angle) * radius;
      const y = centerY + Math.sin(metric.angle) * radius;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = top50Overlay.color;
    ctx.fill();
    ctx.strokeStyle = top50Overlay.strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  // Draw Conference QBs overlay (appears at 60% progress)
  if (progress > 0.6) {
    const conferenceAlpha = Math.min((progress - 0.6) / 0.3, 1.0);
    const conferenceOverlay = overlays[1]; // Conference Avg

    ctx.globalAlpha = conferenceAlpha;
    ctx.beginPath();
    conferenceOverlay.values.forEach((value, index) => {
      const metric = metrics[index];
      const radius = (value / 10) * maxRadius;
      const x = centerX + Math.cos(metric.angle) * radius;
      const y = centerY + Math.sin(metric.angle) * radius;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = conferenceOverlay.color;
    ctx.fill();
    ctx.strokeStyle = conferenceOverlay.strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  // Draw Sample Player's performance polygon (appears at 90% progress)
  if (progress > 0.9) {
    const playerAlpha = Math.min((progress - 0.9) / 0.1, 1.0);

    ctx.globalAlpha = playerAlpha;
    ctx.beginPath();
    metrics.forEach((metric, index) => {
      const radius = (metric.value / 10) * maxRadius;
      const x = centerX + Math.cos(metric.angle) * radius;
      const y = centerY + Math.sin(metric.angle) * radius;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();

    // Fill Sample Player's polygon
    ctx.fillStyle = "rgba(199, 217, 229, 0.3)";
    ctx.fill();

    // Stroke Sample Player's polygon
    ctx.strokeStyle = "#C7D9E5";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw metric points
    metrics.forEach((metric) => {
      const radius = (metric.value / 10) * maxRadius;
      const pointX = centerX + Math.cos(metric.angle) * radius;
      const pointY = centerY + Math.sin(metric.angle) * radius;

      // Draw point
      ctx.fillStyle = "#C7D9E5";
      ctx.beginPath();
      ctx.arc(pointX, pointY, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
  }

  // Always draw metric labels (visible from start)
  metrics.forEach((metric) => {
    const labelRadius = maxRadius + 20;
    const labelX = centerX + Math.cos(metric.angle) * labelRadius;
    const labelY = centerY + Math.sin(metric.angle) * labelRadius;

    ctx.fillStyle = "#F4EFEB";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(metric.label, labelX, labelY);

    // Show values only when player polygon is visible
    if (progress > 0.9) {
      ctx.fillText(metric.value.toString(), labelX, labelY + 12);
    }
  });

  // Draw center point
  ctx.fillStyle = "#C7D9E5";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
  ctx.fill();

  // Draw legend
  const legendY = height - 60;
  const legendItems = [
    "League Avg",
    "Conference Avg",
    "Elite Threshold",
    "Sample Player",
  ];
  const legendColors = [
    "rgba(255, 255, 255, 0.5)",
    "rgba(199, 217, 229, 0.7)",
    "rgba(244, 239, 235, 0.8)",
    "#C7D9E5",
  ];

  legendItems.forEach((item, index) => {
    const x = 20 + index * 90;

    // Draw color indicator
    ctx.fillStyle = legendColors[index];
    ctx.fillRect(x, legendY, 12, 12);

    // Draw label
    ctx.fillStyle = "#F4EFEB";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(item, x + 16, legendY + 9);
  });
}

function updateChart(metric) {
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext("2d");

  // Set canvas size if not already set
  if (chartCanvas.width === 0 || chartCanvas.height === 0) {
    chartCanvas.width = 400;
    chartCanvas.height = 300;
  }

  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

  switch (metric) {
    case "completion":
      drawBarChart(ctx, "Completion Rate Analysis", 68.4);
      break;
    case "pressure":
      drawLineChart(ctx, "Under Pressure Trend");
      break;
    case "longball":
      drawNormalDistribution(ctx, "Long Ball Consistency Distribution", 85.2);
      break;
    case "redzone":
      drawPieChart(ctx, "Red Zone Outcome Breakdown", 91.3);
      break;
    case "mobility":
      drawMobilityChart(ctx, "Pocket Mobility Analysis", 8.7);
      break;
    default:
      drawNormalDistribution(ctx, "Long Ball Consistency Distribution", 85.2);
      break;
  }
}

function drawMobilityChart(ctx, title, rating) {
  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const padding = 50;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Inter";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 30);

  // Draw radar chart background
  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const maxRadius = Math.min(width, height) / 3;

  // Mobility metrics
  const metrics = [
    { label: "Pocket Presence", value: 8.7, angle: 0 },
    { label: "Scramble Ability", value: 7.8, angle: Math.PI / 3 },
    { label: "Evasion", value: 8.2, angle: (2 * Math.PI) / 3 },
    { label: "Rollout Accuracy", value: 8.9, angle: Math.PI },
    { label: "Escape Rate", value: 7.6, angle: (4 * Math.PI) / 3 },
    { label: "Mobility Index", value: 8.7, angle: (5 * Math.PI) / 3 },
  ];

  // Draw concentric circles (rating levels)
  for (let i = 1; i <= 5; i++) {
    const radius = (i / 5) * maxRadius;
    ctx.strokeStyle = "#1a237e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw rating labels
    ctx.fillStyle = "#C7D9E5";
    ctx.font = "10px Inter";
    ctx.textAlign = "center";
    ctx.fillText((i * 2).toString(), centerX + radius + 10, centerY + 3);
  }

  // Draw axis lines
  metrics.forEach((metric) => {
    const endX = centerX + Math.cos(metric.angle - Math.PI / 2) * maxRadius;
    const endY = centerY + Math.sin(metric.angle - Math.PI / 2) * maxRadius;

    ctx.strokeStyle = "#1a237e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw labels
    const labelX =
      centerX + Math.cos(metric.angle - Math.PI / 2) * (maxRadius + 20);
    const labelY =
      centerY + Math.sin(metric.angle - Math.PI / 2) * (maxRadius + 20);

    ctx.fillStyle = "#ffffff";
    ctx.font = "11px Inter";
    ctx.textAlign = "center";
    ctx.fillText(metric.label, labelX, labelY);
    ctx.fillText(metric.value.toString(), labelX, labelY + 12);
  });

  // Draw player performance polygon
  ctx.strokeStyle = "#1976d2";
  ctx.fillStyle = "rgba(25, 118, 210, 0.3)";
  ctx.lineWidth = 3;
  ctx.beginPath();

  metrics.forEach((metric, index) => {
    const radius = (metric.value / 10) * maxRadius;
    const x = centerX + Math.cos(metric.angle - Math.PI / 2) * radius;
    const y = centerY + Math.sin(metric.angle - Math.PI / 2) * radius;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    // Draw data points
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Add overall rating
  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 16px Inter";
  ctx.textAlign = "center";
  ctx.fillText(`Overall: ${rating}/10`, centerX, centerY + 5);

  // Add percentile ranking
  ctx.fillStyle = "#C7D9E5";
  ctx.font = "14px Inter";
  ctx.fillText("89th Percentile", centerX, height - 20);
}

function drawBarChart(ctx, title, value) {
  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const padding = 50;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Inter";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 30);

  // Draw axes
  ctx.strokeStyle = "#1a237e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Performance categories with comparative data
  const categories = [
    { label: "Marcus J.", value: value, color: "#1976d2" },
    { label: "League Avg", value: 63.1, color: "#ff6b6b" },
    { label: "Top 10%", value: 78.2, color: "#4caf50" },
    { label: "Elite", value: 85.7, color: "#ffd700" },
  ];

  const barWidth = (width - 2 * padding) / (categories.length * 1.5);
  const maxValue = Math.max(...categories.map((c) => c.value));

  categories.forEach((cat, index) => {
    const barHeight = (cat.value / maxValue) * (height - 2 * padding - 40);
    const barX = padding + index * barWidth * 1.2 + 20;
    const barY = height - padding - barHeight;

    // Draw bar with gradient effect
    const gradient = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
    gradient.addColorStop(0, cat.color);
    gradient.addColorStop(1, cat.color + "80");

    ctx.fillStyle = gradient;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Draw value on top
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Inter";
    ctx.textAlign = "center";
    ctx.fillText(`${cat.value}%`, barX + barWidth / 2, barY - 5);

    // Draw label
    ctx.font = "12px Inter";
    ctx.fillText(cat.label, barX + barWidth / 2, height - padding + 20);
  });

  // Add percentile ranking
  ctx.fillStyle = "#C7D9E5";
  ctx.font = "14px Inter";
  ctx.textAlign = "center";
  ctx.fillText("74th Percentile Performance", width / 2, height - 10);
}

function drawLineChart(ctx, title) {
  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const padding = 50;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Inter";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 30);

  // Draw axes
  ctx.strokeStyle = "#1a237e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Game-by-game performance data
  const gameData = [
    { game: 1, value: 65.2, opponent: "Rice" },
    { game: 2, value: 71.8, opponent: "UTSA" },
    { game: 3, value: 68.9, opponent: "Baylor" },
    { game: 4, value: 74.3, opponent: "TCU" },
    { game: 5, value: 69.1, opponent: "OU" },
    { game: 6, value: 72.6, opponent: "KSU" },
    { game: 7, value: 76.4, opponent: "ISU" },
    { game: 8, value: 71.2, opponent: "TTU" },
  ];

  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding - 40;
  const maxValue = Math.max(...gameData.map((d) => d.value));
  const minValue = Math.min(...gameData.map((d) => d.value));
  const range = maxValue - minValue + 10;

  // Draw trend line
  ctx.strokeStyle = "#1976d2";
  ctx.lineWidth = 3;
  ctx.beginPath();

  gameData.forEach((point, index) => {
    const x = padding + (index / (gameData.length - 1)) * chartWidth;
    const y =
      height - padding - ((point.value - minValue + 5) / range) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw data points with opponent labels
  gameData.forEach((point, index) => {
    const x = padding + (index / (gameData.length - 1)) * chartWidth;
    const y =
      height - padding - ((point.value - minValue + 5) / range) * chartHeight;

    // Draw point
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw value
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px Inter";
    ctx.textAlign = "center";
    ctx.fillText(`${point.value}%`, x, y - 10);

    // Draw opponent
    ctx.fillStyle = "#C7D9E5";
    ctx.fillText(point.opponent, x, height - padding + 15);
  });

  // Draw league average line
  const avgValue = 63.1;
  const avgY =
    height - padding - ((avgValue - minValue + 5) / range) * chartHeight;
  ctx.strokeStyle = "#ff6b6b";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(padding, avgY);
  ctx.lineTo(width - padding, avgY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Average label
  ctx.fillStyle = "#ff6b6b";
  ctx.font = "12px Inter";
  ctx.textAlign = "left";
  ctx.fillText("League Avg", padding + 5, avgY - 5);
}

function drawPieChart(ctx, title, value) {
  const width = chartCanvas.width;
  const height = chartCanvas.height;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Inter";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 30);

  const centerX = width / 2;
  const centerY = height / 2 + 20;
  const radius = 70;

  // Red zone breakdown data
  const segments = [
    { label: "TD Pass", value: 65, color: "#4caf50" },
    { label: "TD Rush", value: 26, color: "#1976d2" },
    { label: "Field Goal", value: 7, color: "#ffd700" },
    { label: "Turnover", value: 2, color: "#f44336" },
  ];

  let currentAngle = -Math.PI / 2; // Start at top

  segments.forEach((segment, index) => {
    const segmentAngle = (segment.value / 100) * 2 * Math.PI;

    // Draw segment
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      radius,
      currentAngle,
      currentAngle + segmentAngle
    );
    ctx.closePath();
    ctx.fill();

    // Draw segment outline
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    const labelAngle = currentAngle + segmentAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius + 25);
    const labelY = centerY + Math.sin(labelAngle) * (radius + 25);

    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";
    ctx.fillText(segment.label, labelX, labelY);
    ctx.fillText(`${segment.value}%`, labelX, labelY + 15);

    currentAngle += segmentAngle;
  });

  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 16px Inter";
  ctx.textAlign = "center";
  ctx.fillText(`${value}%`, centerX, centerY + 5);

  ctx.fillStyle = "#C7D9E5";
  ctx.font = "14px Inter";
  ctx.fillText("96th Percentile", centerX, height - 20);
}

function setupPlayerProfileScrollTrigger() {
  if (!isMobileDevice()) {
    ScrollTrigger.create({
      trigger: "#mission-section",
      start: "top 80%",
      end: "bottom 20%",
      onEnter: () => {
        initPlayerProfile();
      },
    });
  } else {
    initPlayerProfile();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setupPlayerProfileScrollTrigger();
});

function drawNormalDistribution(ctx, title, mean) {
  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const padding = 40;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Draw title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Inter";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 30);

  // Draw axes
  ctx.strokeStyle = "#1a237e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Draw axis labels
  ctx.fillStyle = "#C7D9E5";
  ctx.font = "12px Inter";
  ctx.textAlign = "center";
  ctx.fillText("Performance %", width / 2, height - 10);

  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("Frequency", 0, 0);
  ctx.restore();

  // Draw normal distribution curve
  ctx.strokeStyle = "#ffd700";
  ctx.lineWidth = 3;
  ctx.beginPath();

  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding - 40;
  const stdDev = 12;
  const leagueAverage = 72.3;

  for (let x = 0; x <= chartWidth; x++) {
    const value = (x / chartWidth) * 100;
    const y = Math.exp(-0.5 * Math.pow((value - leagueAverage) / stdDev, 2));
    const normalizedY = y * chartHeight * 0.6;
    const canvasY = height - padding - normalizedY;

    if (x === 0) {
      ctx.moveTo(padding + x, canvasY);
    } else {
      ctx.lineTo(padding + x, canvasY);
    }
  }
  ctx.stroke();

  // Generate "bogey points" - scattered data points showing individual performances
  const bogeyPoints = [];
  for (let i = 0; i < 45; i++) {
    // Generate points around the normal distribution with some randomness
    const baseValue = leagueAverage + (Math.random() - 0.5) * stdDev * 3;
    const jitter = (Math.random() - 0.5) * 8; // Add some vertical jitter
    const value = Math.max(30, Math.min(95, baseValue));
    const normalizedValue = Math.exp(
      -0.5 * Math.pow((value - leagueAverage) / stdDev, 2)
    );
    const y = normalizedValue * chartHeight * 0.6 + jitter;

    bogeyPoints.push({
      x: padding + (value / 100) * chartWidth,
      y: height - padding - y,
      value: value,
    });
  }

  // Draw bogey points
  bogeyPoints.forEach((point) => {
    ctx.fillStyle = "rgba(199, 217, 229, 0.7)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Draw Sample Player's position (blue circle)
  const marcusX = padding + (mean / 100) * chartWidth;
  const marcusNormalizedY = Math.exp(
    -0.5 * Math.pow((mean - leagueAverage) / stdDev, 2)
  );
  const marcusY = height - padding - marcusNormalizedY * chartHeight * 0.6;

  // Blue circle with glow effect
  ctx.shadowColor = "#64b5f6";
  ctx.shadowBlur = 15;
  ctx.fillStyle = "#1976d2";
  ctx.beginPath();
  ctx.arc(marcusX, marcusY, 8, 0, 2 * Math.PI);
  ctx.fill();

  // Inner highlight
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#64b5f6";
  ctx.beginPath();
  ctx.arc(marcusX, marcusY, 5, 0, 2 * Math.PI);
  ctx.fill();

  // Player label
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px Inter";
  ctx.textAlign = "center";
  ctx.fillText("Marcus J.", marcusX, marcusY - 20);
  ctx.font = "12px Inter";
  ctx.fillText(`${mean}%`, marcusX, marcusY - 5);

  // Draw league average line
  ctx.strokeStyle = "#ff6b6b";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  const avgX = padding + (leagueAverage / 100) * chartWidth;
  ctx.beginPath();
  ctx.moveTo(avgX, padding + 40);
  ctx.lineTo(avgX, height - padding);
  ctx.stroke();
  ctx.setLineDash([]);

  // League average label
  ctx.fillStyle = "#ff6b6b";
  ctx.font = "12px Inter";
  ctx.textAlign = "center";
  ctx.fillText(`League Avg: ${leagueAverage}%`, avgX, padding + 35);

  // Add percentile indicators
  ctx.fillStyle = "#C7D9E5";
  ctx.font = "10px Inter";
  ctx.textAlign = "left";

  // 25th percentile
  const p25 = leagueAverage - stdDev * 0.67;
  const p25X = padding + (p25 / 100) * chartWidth;
  ctx.fillText("25th", p25X, height - padding + 15);

  // 75th percentile
  const p75 = leagueAverage + stdDev * 0.67;
  const p75X = padding + (p75 / 100) * chartWidth;
  ctx.fillText("75th", p75X, height - padding + 15);

  // 90th percentile
  const p90 = leagueAverage + stdDev * 1.28;
  const p90X = padding + (p90 / 100) * chartWidth;
  ctx.fillText("90th", p90X, height - padding + 15);
}

// Complete toggle function for analytics boxes
function toggleAnalyticsBox(element) {
  // Disable toggle functionality on mobile devices
  if (isMobileDevice()) {
    return;
  }
  console.log("toggleAnalyticsBox called with:", element);
  console.log("Element dataset:", element.dataset);

  // Get all analytics options
  const allOptions = document.querySelectorAll(".analytics-option");
  console.log("Found all options:", allOptions.length);

  // Close all other boxes
  allOptions.forEach((option) => {
    if (option !== element) {
      console.log("Closing option:", option.dataset.metric);
      option.classList.remove("expanded");
    }
  });

  // Toggle the clicked box
  const wasExpanded = element.classList.contains("expanded");
  console.log("Was expanded before toggle:", wasExpanded);

  element.classList.toggle("expanded");

  const isNowExpanded = element.classList.contains("expanded");
  console.log("Is now expanded after toggle:", isNowExpanded);

  // Update chart based on the metric
  const metric = element.dataset.metric;
  console.log("Metric for chart update:", metric);

  if (element.classList.contains("expanded")) {
    console.log("Updating chart for metric:", metric);
    updateChart(metric);
  }
}

// ===== MOBILE OPTIMIZATIONS JAVASCRIPT =====

// Mobile device detection - ENSURE GLOBAL ACCESS
function isMobileDevice() {
  return (
    window.innerWidth <= 992 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

// Dynamic font scaling based on screen size - DISABLED FOR MOBILE TO PREVENT SCROLL SHRINKING
function adjustFontSizes() {
  // Skip font scaling on mobile devices to prevent scroll-triggered shrinking
  if (isMobileDevice()) {
    return;
  }

  const screenWidth = window.innerWidth;
  const baseSize = 16; // Base font size in px

  // Calculate scaling factor
  let scaleFactor = 1;
  if (screenWidth <= 576) {
    scaleFactor = 0.85; // 85% for very small screens
  } else if (screenWidth <= 768) {
    scaleFactor = 0.9; // 90% for small screens
  } else if (screenWidth <= 992) {
    scaleFactor = 0.95; // 95% for medium screens
  }

  // Apply dynamic scaling to specific elements
  const elementsToScale = [
    ".scroll-section-description",
    ".service-title",
    ".contact-info-title",
    ".form-group label",
  ];

  elementsToScale.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const currentSize = parseFloat(computedStyle.fontSize);
      element.style.fontSize = `${currentSize * scaleFactor}px`;
    });
  });
}

function optimizeBasketballSceneForMobile() {
  if (!isMobileDevice() || !camera || !renderer) return;

  camera.position.set(0, 25, 5); // Closer and lower angle for mobile
  camera.lookAt(0, 0, -5.25);

  // Reduce pillar count for better performance on mobile
  if (pillars.length > 50) {
    // Hide some pillars for better performance
    pillars.slice(50).forEach((pillarObj) => {
      pillarObj.pillar.visible = false;
      pillarObj.glow.visible = false;
    });
  }

  // Adjust renderer settings for mobile
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
  renderer.shadowMap.enabled = false; // Disable shadows on mobile for performance
}

// Mobile-optimized chart sizing
function optimizeChartsForMobile() {
  if (!isMobileDevice()) return;

  // Resize Chart.js radar charts for mobile
  [qbMobilityChart, wrMobilityChart].forEach((chart) => {
    if (chart && chart.canvas) {
      const container = chart.canvas.parentElement;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      // Update chart size
      chart.resize(containerWidth, Math.min(containerHeight, 250));

      // Adjust chart options for mobile
      if (chart.options && chart.options.scales && chart.options.scales.r) {
        chart.options.scales.r.pointLabels.font.size = 10; // Smaller labels
        chart.options.scales.r.ticks.font.size = 9; // Smaller tick labels
        chart.update("none");
      }
    }
  });
}

// Touch gesture handling for mobile
function setupMobileGestures() {
  if (!isMobileDevice()) return;

  // Prevent zoom on double tap for better UX
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (event) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );

  // Smooth scrolling for mobile
  if ("scrollBehavior" in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = "smooth";
  }

  // Optimize scroll performance - COMPLETELY DISABLED FOR MOBILE
  // All scroll event listeners are now conditionally added only for desktop
  // This prevents any scroll-triggered JavaScript from causing issues on mobile
}

// Mobile-specific particle configuration
function initMobileParticles() {
  if (!isMobileDevice()) return;

  // Lighter particle configuration for mobile devices
  const mobileParticlesConfig = {
    particles: {
      number: {
        value: 30, // Significantly reduced for mobile performance
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#1e3a8a",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.3, // Reduced opacity
        random: false,
      },
      size: {
        value: 2, // Smaller particles
        random: true,
      },
      line_linked: {
        enable: true,
        distance: 100, // Shorter connections
        color: "#1e3a8a",
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2, // Slower movement
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false, // Disable hover on mobile
        },
        onclick: {
          enable: false, // Disable click effects on mobile
        },
        resize: true,
      },
    },
    retina_detect: false, // Disable retina detection for performance
  };

  // Reinitialize particles with mobile config
  particlesJS("particles-scroll-section", mobileParticlesConfig);
  particlesJS("particles-mission-vision", mobileParticlesConfig);
  particlesJS("particles-contact", mobileParticlesConfig);
}

// Responsive resize handler
function handleMobileResize() {
  if (!isMobileDevice()) return;

  // Debounce resize events
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    // Skip font size adjustments on mobile to prevent scaling issues
    // adjustFontSizes(); // DISABLED FOR MOBILE

    // Optimize charts
    optimizeChartsForMobile();

    // Optimize basketball scene
    optimizeBasketballSceneForMobile();

    // Update Three.js renderer if it exists
    if (renderer && camera) {
      onWindowResize();
    }
  }, 250);
}

// Mobile performance monitoring
function monitorMobilePerformance() {
  if (!isMobileDevice()) return;

  // Monitor frame rate and adjust quality accordingly
  let frameCount = 0;
  let lastTime = performance.now();

  function checkPerformance() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      // Check every second
      const fps = frameCount;
      frameCount = 0;
      lastTime = currentTime;

      // If FPS is too low, reduce quality
      if (fps < 30 && renderer) {
        renderer.setPixelRatio(1); // Reduce pixel ratio

        // Hide some visual effects
        pillars.forEach((pillarObj, index) => {
          if (index % 2 === 0) {
            // Hide every other glow effect
            pillarObj.glow.visible = false;
          }
        });
      }
    }

    requestAnimationFrame(checkPerformance);
  }

  requestAnimationFrame(checkPerformance);
}

// Initialize mobile optimizations
function initMobileOptimizations() {
  if (!isMobileDevice()) return;

  console.log("Initializing mobile optimizations...");

  // Setup mobile-specific configurations
  setupMobileGestures();
  // adjustFontSizes(); // DISABLED FOR MOBILE TO PREVENT SCROLL SHRINKING
  initMobileParticles();
  monitorMobilePerformance();

  // Add mobile-specific event listeners
  window.addEventListener("resize", handleMobileResize, { passive: true });
  window.addEventListener("orientationchange", () => {
    setTimeout(handleMobileResize, 100); // Delay to ensure orientation change is complete
  });

  // Optimize existing components for mobile
  setTimeout(() => {
    optimizeBasketballSceneForMobile();
    optimizeChartsForMobile();
  }, 1000);
}

// Initialize mobile optimizations when DOM is ready
document.addEventListener("DOMContentLoaded", initMobileOptimizations);

// Also initialize on window load as backup
window.addEventListener("load", () => {
  setTimeout(initMobileOptimizations, 500);
});
