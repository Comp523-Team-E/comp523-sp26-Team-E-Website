// Shared navigation component — renders the nav bar on every page.
// Each HTML file has <nav class="navbar" id="main-nav" data-nav-root="."></nav>
// (use data-nav-root=".." for pages one directory level deep)
function initNav() {
    const nav = document.getElementById("main-nav");
    if (!nav) return;

    const root = nav.dataset.navRoot || ".";
    // idx is the prefix for links that target sections on index.html
    // On the root page (root=".") we use bare hash anchors; on subpages we prefix with ../index.html
    const idx = root === "." ? "" : `${root}/index.html`;

    nav.innerHTML = `
        <div class="container">
            <div class="nav-brand">Team E Project</div>
            <button class="hamburger" aria-label="Toggle menu" aria-expanded="false">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
            <ul class="nav-menu">
                <li><a href="${idx}#intro">Home</a></li>
                <li><a href="${idx}#weekly-reports">Weekly Reports</a></li>

                <li class="nav-dropdown">
                    <a href="${idx}#deliverables" class="nav-dropdown-trigger">Deliverables ▾</a>
                    <ul class="nav-dropdown-menu">
                        <li><a href="${root}/deliverables/d1-specifications.html">D1: Specifications</a></li>
                        <li><a href="${root}/deliverables/d2-design.html">D2: Design Document</a></li>
                        <li><a href="${root}/deliverables/d3-testing.html">D3: Test Plan</a></li>
                    </ul>
                </li>

                <li class="nav-dropdown">
                    <a href="${idx}#assignments" class="nav-dropdown-trigger">Assignments ▾</a>
                    <ul class="nav-dropdown-menu">
                        <li><a href="${root}/assignments/ethics1.html">Ethics 1</a></li>
                        <li><a href="${root}/assignments/platform_selection.html">Platform Selection</a></li>
                        <li><a href="${root}/assignments/architecture_diagram.html">Architecture Diagram</a></li>
                        <li><a href="${root}/assignments/midterm_presentation.html">Midterm Presentation</a></li>
                        <li><a href="${root}/assignments/tech_talk.html">Tech Talk</a></li>
                    </ul>
                </li>

                <li class="nav-dropdown">
                    <a href="${idx}#team" class="nav-dropdown-trigger">Team ▾</a>
                    <ul class="nav-dropdown-menu">
                        <li><a href="${idx}#contact">Contact</a></li>
                        <li><a href="${idx}#client">Client</a></li>
                    </ul>
                </li>

                <li><a href="${idx}#schedule">Schedule</a></li>
                <li><a href="${idx}#rules">Team Rules</a></li>
                <li><a href="https://github.com/Comp523-Team-E/Media-Markup" target="_blank">GitHub Repo</a></li>
            </ul>
        </div>
    `;
}
initNav();

// Smooth scrolling for navigation links (only for non-dropdown links, and not on mobile dropdown sub-links)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        // Skip dropdown triggers - they're handled separately
        if (this.classList.contains("nav-dropdown-trigger")) {
            return;
        }

        // Skip dropdown menu links on mobile - they're handled in DOMContentLoaded
        if (window.innerWidth <= 1024 && this.closest(".nav-dropdown-menu")) {
            return;
        }

        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            const nav = document.querySelector(".navbar");
            const navHeight = nav ? nav.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        }
    });
});

// Add active class to navigation items on scroll
window.addEventListener("scroll", () => {
    let current = "";
    const sections = document.querySelectorAll("section[id], .hero");
    const navLinks = document.querySelectorAll(".nav-menu a");

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (current && link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// Fade-in animation for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(
        ".person-card, .schedule-card, .rules-card, .deliverable-card, .weekly-report-card"
    );

    cards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(card);
    });

    // Helper function to close hamburger menu
    const closeHamburgerMenu = () => {
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        if (hamburger && navMenu) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            // Close all dropdowns
            document.querySelectorAll(".nav-dropdown-menu.active").forEach((menu) => {
                menu.classList.remove("active");
            });
        }
    };

    // Hamburger menu toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            const isExpanded = hamburger.classList.contains("active");
            hamburger.setAttribute("aria-expanded", isExpanded);
        });

        // Mobile dropdown toggle - handle BEFORE other click handlers
        const dropdownTriggers = document.querySelectorAll(".nav-dropdown-trigger");
        dropdownTriggers.forEach((trigger) => {
            trigger.addEventListener(
                "click",
                (e) => {
                    const isMobile = window.innerWidth <= 1024;

                    if (isMobile) {
                        e.preventDefault();
                        e.stopPropagation();

                        const dropdown = trigger.closest(".nav-dropdown");
                        const dropdownMenu = dropdown ? dropdown.querySelector(".nav-dropdown-menu") : null;

                        if (dropdownMenu) {
                            const isActive = dropdownMenu.classList.contains("active");

                            // Close all other dropdowns
                            document.querySelectorAll(".nav-dropdown-menu.active").forEach((menu) => {
                                if (menu !== dropdownMenu) {
                                    menu.classList.remove("active");
                                }
                            });

                            // Toggle current dropdown
                            if (isActive) {
                                dropdownMenu.classList.remove("active");
                            } else {
                                dropdownMenu.classList.add("active");
                            }
                        }
                    }
                },
                true
            ); // Capture phase - runs first
        });

        // Handle clicks on dropdown sub-links (scroll and close menu)
        const dropdownLinks = document.querySelectorAll(".nav-dropdown-menu a");
        dropdownLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const isMobile = window.innerWidth <= 1024;
                if (isMobile) {
                    const href = link.getAttribute("href");
                    if (href && href.startsWith("#")) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            const nav = document.querySelector(".navbar");
                            const navHeight = nav ? nav.offsetHeight : 0;
                            const targetPosition = target.offsetTop - navHeight;

                            window.scrollTo({
                                top: targetPosition,
                                behavior: "smooth",
                            });
                        }
                    }
                    // Close hamburger menu after navigation
                    closeHamburgerMenu();
                }
            });
        });

        // Close menu when clicking on regular nav links (mobile)
        const regularNavLinks = document.querySelectorAll(".nav-menu > li > a:not(.nav-dropdown-trigger)");
        regularNavLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 1024) {
                    closeHamburgerMenu();
                }
            });
        });

        // Close menu when clicking outside (mobile)
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 1024) {
                const isClickInsideNav = navMenu.contains(e.target);
                const isClickOnHamburger = hamburger.contains(e.target);

                if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains("active")) {
                    closeHamburgerMenu();
                }
            }
        });
    }
});
