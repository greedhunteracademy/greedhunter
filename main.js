/* ═══════════════════════════════════════════════════════════════
   GREEDHUNTERACADEMY — ANIMATION ENGINE
   GSAP + ScrollTrigger + Custom Cursor + Typewriter
   ═══════════════════════════════════════════════════════════════ */

// Wait for DOM + GSAP
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    initCurtainAnimation();
});

/* ═══════════════════════════════════════════════════════════════
   1. CURTAIN OPENING ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function initCurtainAnimation() {
    const tl = gsap.timeline({
        onComplete: () => {
            document.getElementById('curtain').style.display = 'none';
            initAllAnimations();
        }
    });

    tl.to('.curtain-left', {
        xPercent: -100,
        duration: 1.6,
        ease: 'power4.inOut',
        delay: 0.4
    }, 0)
    .to('.curtain-right', {
        xPercent: 100,
        duration: 1.6,
        ease: 'power4.inOut'
    }, 0)
    // Fade in hero content behind the curtain
    .to('.hero-content', {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
    }, 0.8)
    .to('.hero-gradient-orb', {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.2
    }, 0.6);
}

/* ═══════════════════════════════════════════════════════════════
   2. MASTER INIT — Everything starts after curtain opens
   ═══════════════════════════════════════════════════════════════ */
function initAllAnimations() {
    initCustomCursor();
    initHeroCanvas();
    initHeroSequence();
    initOrbFloat();
    initNavigation();
    initLearnSection();
    initHackSection();
    initBuildSection();
    initGrowSection();
    initClosingSection();
    initCursorSectionColors();
    /* UPDATED */
    initSectionDescriptionTyping();
}

/* ═══════════════════════════════════════════════════════════════
   3. CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════════ */
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    // Check for touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    const speed = 0.12;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower with requestAnimationFrame
    function updateFollower() {
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-dot, .footer-email');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

/* ═══════════════════════════════════════════════════════════════
   4. CURSOR SECTION COLOR CHANGES
   ═══════════════════════════════════════════════════════════════ */
function initCursorSectionColors() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const sections = ['learn', 'hack', 'build', 'grow'];

    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: `#${section}`,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => setAccent(section),
            onEnterBack: () => setAccent(section),
            onLeave: () => clearAccent(section),
            onLeaveBack: () => clearAccent(section),
        });
    });

    function setAccent(name) {
        sections.forEach(s => {
            cursor.classList.remove(`accent-${s}`);
            follower.classList.remove(`accent-${s}`);
        });
        cursor.classList.add(`accent-${name}`);
        follower.classList.add(`accent-${name}`);
    }

    function clearAccent(name) {
        cursor.classList.remove(`accent-${name}`);
        follower.classList.remove(`accent-${name}`);
    }
}

/* ═══════════════════════════════════════════════════════════════
   5. HERO CANVAS — Animated dot grid
   ═══════════════════════════════════════════════════════════════ */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let dots = [];
    let mouse = { x: -1000, y: -1000 };
    const dotSpacing = 50;
    const dotRadius = 1;
    const connectionDistance = 120;
    let animationId;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        createDots();
    }

    function createDots() {
        dots = [];
        for (let x = 0; x < width; x += dotSpacing) {
            for (let y = 0; y < height; y += dotSpacing) {
                dots.push({
                    x: x + Math.random() * 10,
                    y: y + Math.random() * 10,
                    baseX: x,
                    baseY: y,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }

    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        dots.forEach(dot => {
            // Mouse repulsion
            const dx = mouse.x - dot.x;
            const dy = mouse.y - dot.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                const force = (connectionDistance - dist) / connectionDistance;
                dot.vx -= (dx / dist) * force * 0.5;
                dot.vy -= (dy / dist) * force * 0.5;
            }

            // Spring back to base
            dot.vx += (dot.baseX - dot.x) * 0.03;
            dot.vy += (dot.baseY - dot.y) * 0.03;

            // Damping
            dot.vx *= 0.92;
            dot.vy *= 0.92;

            dot.x += dot.vx;
            dot.y += dot.vy;

            // Draw dot
            const proximity = Math.min(dist / 300, 1);
            const alpha = 0.15 + (1 - proximity) * 0.35;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.strokeStyle = `rgba(255, 193, 7, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    window.addEventListener('resize', resize);

    // Kill canvas animation when hero scrolls away
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'bottom top',
        onEnter: () => cancelAnimationFrame(animationId),
        onLeaveBack: () => animate(),
    });
}

/* ═══════════════════════════════════════════════════════════════
   6. HERO ENTRANCE SEQUENCE
   ═══════════════════════════════════════════════════════════════ */
function initHeroSequence() {
    // const tl = gsap.timeline({ delay: 0.3 });
    /* UPDATED: Faster hero start */
    const tl = gsap.timeline({ delay: 0.05 });
    // Typewriter starts after hero content is visible
    tl.call(() => initTypewriter(), null, 0.15) // --> 0.6 ==> 0.15
      .to('#hero-subtitle', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
      }, 2.2) //==> 3.8 => 2.2
      .to('#scroll-indicator', {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
      }, 2.6); //==> 4.2 => 2.2

    // Fade out hero on scroll
    gsap.to('.hero-content', {
        opacity: 0,
        y: -80,
        scrollTrigger: {
            trigger: '#hero',
            start: '60% top',
            end: 'bottom top',
            scrub: 1,
        }
    });

    gsap.to('#scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
            trigger: '#hero',
            start: '20% top',
            end: '40% top',
            scrub: 1,
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   7. TYPEWRITER
   ═══════════════════════════════════════════════════════════════ */
// function initTypewriter() {
//     const element = document.getElementById('typewriter');
//     const words = ['Learn.', 'Hack.', 'Build.', 'Grow.'];
//     let fullText = '';
//     let wordIndex = 0;
//     let charIndex = 0;
//     let isDeleting = false;
//     let isPausing = false;
//     const typeSpeed = 70;
//     const deleteSpeed = 50;
//     const pauseAfterWord = 500;
//     const pauseAfterAll = 1000;

//     function type() {
//         if (isPausing) return;

//         const currentWord = words[wordIndex];

//         if (!isDeleting) {
//             // Typing
//             if (charIndex <= currentWord.length) {
//                 const partial = currentWord.substring(0, charIndex);
//                 if (wordIndex === 0) {
//                     element.textContent = partial;
//                 } else {
//                     element.textContent = fullText + partial;
//                 }
//                 charIndex++;
//                 setTimeout(type, typeSpeed + Math.random() * 40);
//             } else {
//                 // Word complete
//                 if (wordIndex < words.length - 1) {
//                     // Add space after word, move to next
//                     fullText += currentWord + '  ';
//                     wordIndex++;
//                     charIndex = 0;
//                     isPausing = true;
//                     setTimeout(() => {
//                         isPausing = false;
//                         type();
//                     }, pauseAfterWord);
//                 } else {
//                     // All words typed — hold, then restart
//                     isPausing = true;
//                     setTimeout(() => {
//                         isPausing = false;
//                         // Reset and retype
//                         fullText = '';
//                         wordIndex = 0;
//                         charIndex = 0;
//                         element.textContent = '';
//                         type();
//                     }, pauseAfterAll);
//                 }
//             }
//         }
//     }

//     type();
// }

/* ======================================================
   UPDATED: Faster Hero Typewriter
   ====================================================== */

function initTypewriter() {

    const element = document.getElementById('typewriter');

    const words = [
        'Learn.',
        'Hack.',
        'Build.',
        'Grow.'
    ];

    let currentWord = 0;
    let currentChar = 0;

    const typingSpeed = 35;      // UPDATED
    const wordPause = 250;       // UPDATED
    const cyclePause = 700;      // UPDATED

    function typeWord() {

        const word = words[currentWord];

        if (currentChar <= word.length) {

            element.textContent =
                words.slice(0, currentWord).join(' ') +
                (currentWord > 0 ? ' ' : '') +
                word.substring(0, currentChar);

            currentChar++;

            setTimeout(typeWord, typingSpeed);

        } else {

            currentWord++;

            if (currentWord < words.length) {

                currentChar = 0;

                setTimeout(typeWord, wordPause);

            } else {

                setTimeout(() => {

                    currentWord = 0;
                    currentChar = 0;
                    element.textContent = '';

                    typeWord();

                }, cyclePause);
            }
        }
    }

    typeWord();
}

/* ═══════════════════════════════════════════════════════════════
   8. FLOATING GRADIENT ORBS
   ═══════════════════════════════════════════════════════════════ */
function initOrbFloat() {
    gsap.to('.hero-orb-1', {
        x: 40,
        y: -30,
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
    });

    gsap.to('.hero-orb-2', {
        x: -30,
        y: 40,
        duration: 10,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
    });
}

/* ═══════════════════════════════════════════════════════════════
   9. NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
function initNavigation() {
    const nav = document.getElementById('nav');
    const dots = document.querySelectorAll('.nav-dot');
    const sectionIds = ['hero', 'learn', 'hack', 'build', 'grow'];

    // Show nav after scroll
    ScrollTrigger.create({
        trigger: '#hero',
        start: '80% top',
        onEnter: () => nav.classList.add('visible'),
        onLeaveBack: () => nav.classList.remove('visible'),
    });

    // Update active dot based on section
    sectionIds.forEach((id, index) => {
        ScrollTrigger.create({
            trigger: `#${id}`,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => updateActiveDot(index),
            onEnterBack: () => updateActiveDot(index),
        });
    });

    function updateActiveDot(activeIndex) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);

            // Color the active dot based on section
            const colors = ['#fff', '#FFD700', '#fff', '#4FC3F7', '#00E676'];
            if (i === activeIndex) {
                dot.style.background = colors[activeIndex];
            } else {
                dot.style.background = '';
            }
        });
    }
}

/* ═══════════════════════════════════════════════════════════════
   10. LEARN SECTION — Gold constellation
   ═══════════════════════════════════════════════════════════════ */
function initLearnSection() {
    const section = '#learn';

    // Parallax text
    gsap.fromTo(`${section} .parallax-text`, {
        y: 200,
        opacity: 0,
    }, {
        y: -100,
        opacity: 0.04,
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    // Section content timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'center center',
            scrub: false,
            toggleActions: 'play none none reverse',
        }
    });

    tl.to(`${section} .section-number`, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
    }, 0)
    .to(`${section} .section-body`, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
    }, 0.2)
    .to(`${section} .section-title`, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
    }, 0.2)
    .to(`${section} .section-line`, {
        opacity: 1,
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.out',
    }, 0.4)
    .to(`${section} .section-description`, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
    }, 0.5)
    .to(`${section} .section-visual`, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
    }, 0.3);

    // SVG node animations
    gsap.fromTo(`${section} .svg-node`, {
        scale: 0,
        opacity: 0,
    }, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(2)',
        scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
        }
    });

    gsap.fromTo(`${section} .svg-ring`, {
        scale: 0,
        opacity: 0,
    }, {
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
        }
    });

    // Line draw animation
    gsap.to(`${section} .svg-line`, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
        }
    });

    gsap.to(`${section} .svg-line-secondary`, {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
        }
    });

    // Pulsing glow on central node
    gsap.to(`${section} .svg-center`, {
        filter: 'drop-shadow(0 0 12px #FFD700)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });
}

/* ═══════════════════════════════════════════════════════════════
   11. HACK SECTION — Black terminal
   ═══════════════════════════════════════════════════════════════ */
function initHackSection() {
    const section = '#hack';

    // Parallax text
    gsap.fromTo(`${section} .parallax-text`, {
        y: 200,
        opacity: 0,
    }, {
        y: -100,
        opacity: 0.08,
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    // Section content timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'center center',
            scrub: false,
            toggleActions: 'play none none reverse',
        }
    });

    tl.to(`${section} .section-number`, {
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
    }, 0)
    .to(`${section} .section-body`, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
    }, 0.2)
    .to(`${section} .section-line`, {
        opacity: 1,
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.out',
    }, 0.4)
    .to(`${section} .section-description`, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
    }, 0.5)
    .to(`${section} .section-visual`, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
    }, 0.3);

    // Code lines appearing one by one
    gsap.fromTo(`${section} .svg-code-line`, {
        opacity: 0,
        scaleX: 0,
    }, {
        opacity: 1,
        scaleX: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        transformOrigin: 'left center',
        scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
        }
    });

    // Terminal frame draw
    gsap.fromTo(`${section} .svg-terminal-frame`, {
        strokeDasharray: 1200,
        strokeDashoffset: 1200,
    }, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
        }
    });

    // Periodic glitch on hack title
    ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => startGlitch(),
        onLeave: () => stopGlitch(),
        onEnterBack: () => startGlitch(),
        onLeaveBack: () => stopGlitch(),
    });

    let glitchInterval;
    function startGlitch() {
        glitchInterval = setInterval(() => {
            const title = document.querySelector('.hack-title');
            if (!title) return;
            title.classList.add('glitch-active');
            setTimeout(() => title.classList.remove('glitch-active'), 300);
        }, 3000 + Math.random() * 2000);
    }

    function stopGlitch() {
        clearInterval(glitchInterval);
    }
}

/* ═══════════════════════════════════════════════════════════════
   12. BUILD SECTION — Blue construction
   ═══════════════════════════════════════════════════════════════ */
function initBuildSection() {
    const section = '#build';

    // Parallax text
    gsap.fromTo(`${section} .parallax-text`, {
        y: 200,
        opacity: 0,
    }, {
        y: -100,
        opacity: 0.04,
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    // Section content timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'center center',
            scrub: false,
            toggleActions: 'play none none reverse',
        }
    });

    tl.to(`${section} .section-number`, {
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
    }, 0)
    .to(`${section} .section-body`, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
    }, 0.2)
    .to(`${section} .section-line`, {
        opacity: 1,
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.out',
    }, 0.4)
    .to(`${section} .section-description`, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
    }, 0.5)
    .to(`${section} .section-visual`, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
    }, 0.3);

    // Blocks stacking animation (bottom to top)
    const blocks = [`${section} .block-1`, `${section} .block-2`, `${section} .block-3`, `${section} .block-4`, `${section} .block-5`];

    // blocks.forEach((block, i) => {
    //     gsap.fromTo(block, {
    //         opacity: 0,
    //         y: 50 + (i * 20),
    //     }, {
    //         opacity: 1,
    //         y: 0,
    //         duration: 0.6,
    //         delay: i * 0.15,
    //         ease: 'bounce.out',
    //         scrollTrigger: {
    //             trigger: section,
    //             start: 'top 55%',
    //             toggleActions: 'play none none reverse',
    //         }
    //     });
    // });

    // Gear rotation
   
   
    /* ======================================================
   UPDATED: Smooth Sequential Block Construction
   ====================================================== */

    const buildTimeline = gsap.timeline({

        scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play reverse play reverse'
        }

    });

    buildTimeline.fromTo(

        `${section} .svg-block`,

        {
            opacity: 0,
            y: 80,
            scale: 0.95
        },

        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.18,
            ease: 'power3.out'
        }

    );
    gsap.to(`${section} .svg-gear`, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center center',
        svgOrigin: '200 100',
    });

    // Grid lines fade in
    gsap.fromTo(`${section} .svg-grid`, {
        opacity: 0,
    }, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   13. GROW SECTION — Green → Gold tree
   ═══════════════════════════════════════════════════════════════ */
function initGrowSection() {
    const section = '#grow';

    // Parallax text (scales up as you scroll!)
    gsap.fromTo(`${section} .parallax-text`, {
        y: 200,
        opacity: 0,
        scale: 0.8,
    }, {
        y: -100,
        opacity: 0.04,
        scale: 1.1,
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    // Section content timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'center center',
            scrub: false,
            toggleActions: 'play none none reverse',
        }
    });

    tl.to(`${section} .section-number`, {
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
    }, 0)
    .to(`${section} .section-body`, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
    }, 0.2)
    .to(`${section} .section-line`, {
        opacity: 1,
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.out',
    }, 0.4)
    .to(`${section} .section-description`, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
    }, 0.5)
    .to(`${section} .section-visual`, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
    }, 0.3);

    // Trunk drawing upward
    gsap.fromTo(`${section} .svg-trunk`, {
        strokeDasharray: 200,
        strokeDashoffset: 200,
    }, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
        }
    });

    // Branches growing
    gsap.to(`${section} .svg-branch`, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
        }
    });

    // Leaves appearing
    gsap.fromTo(`${section} .svg-leaf`, {
        scale: 0,
        opacity: 0,
    }, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(3)',
        scrollTrigger: {
            trigger: section,
            start: 'top 45%',
            toggleActions: 'play none none reverse',
        }
    });

    // Crown appear
    gsap.fromTo(`${section} .svg-crown, ${section} .svg-crown-center`, {
        scale: 0,
        opacity: 0,
    }, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(2)',
        scrollTrigger: {
            trigger: section,
            start: 'top 40%',
            toggleActions: 'play none none reverse',
        }
    });

    // Floating particles
    gsap.fromTo(`${section} .svg-particle`, {
        opacity: 0,
        y: 0,
    }, {
        opacity: 0.5,
        y: -15,
        duration: 2,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            toggleActions: 'play pause resume pause',
        }
    });

    // Crown glow pulse
    gsap.to(`${section} .svg-crown-center`, {
        filter: 'drop-shadow(0 0 15px #FFD700)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
    });
}

/* ═══════════════════════════════════════════════════════════════
   14. CLOSING SECTION — Words converge
   ═══════════════════════════════════════════════════════════════ */
function initClosingSection() {
    const words = document.querySelectorAll('.closing-word');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#closing',
            start: 'top 60%',
            end: 'center center',
            scrub: false,
            toggleActions: 'play none none reverse',
        }
    });

    words.forEach((word, i) => {
        const directions = [
            { x: -100, y: -60 },   // Learn from top-left
            { x: 100, y: -60 },    // Hack from top-right
            { x: -100, y: 60 },    // Build from bottom-left
            { x: 100, y: 60 },     // Grow from bottom-right
        ];

        tl.fromTo(word, {
            x: directions[i].x,
            y: directions[i].y + 60,
            opacity: 0,
            scale: 0.8,
        }, {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
        }, i * 0.15);
    });

    tl.fromTo('#closing-tagline', {
        opacity: 0,
        y: 30,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
    }, 0.8);
}


/* ======================================================
   UPDATED: Section Description Typewriter
   ====================================================== */

function animateDescription(element) {

    if (element.dataset.typed) return;

    element.dataset.typed = "true";

    const originalText = element.textContent.trim();

    element.textContent = '';

    element.classList.add('typing');

    let index = 0;

    const speed = 12; // UPDATED: much faster for long paragraphs

    function type() {

        if (index < originalText.length) {

            element.textContent += originalText.charAt(index);

            index++;

            setTimeout(type, speed);

        } else {

            element.classList.remove('typing');
        }
    }

    type();
}

/* ======================================================
   UPDATED: Trigger Description Typewriter
   ====================================================== */

function initSectionDescriptionTyping() {

    document
        .querySelectorAll('.typewriter-description')
        .forEach(desc => {

            ScrollTrigger.create({

                trigger: desc,

                start: 'top 75%',

                once: true,

                onEnter: () => {
                    animateDescription(desc);
                }
            });
        });
}
/* ═══════════════════════════════════════════════════════════════
   15. PERFORMANCE — Clean up on page hide
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});
