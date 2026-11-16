const realisationsAccordion = document.querySelector(".realisations-accordion");
const realisationsToggle = document.querySelector(".realisations-toggle");

realisationsToggle.addEventListener("click", () => {
    const isOpen = realisationsAccordion.classList.toggle("is-open");

    realisationsToggle.setAttribute("aria-expanded", String(isOpen));
})

// Transition lors de la navigation entre les sections
const transitionOverlay = document.createElement("div");
transitionOverlay.classList.add("page-transition-overlay");
transitionOverlay.setAttribute("aria-hidden", "true");
document.body.appendChild(transitionOverlay);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let isNavigating = false;

// Sections du portfolio
const portfolioSections = document.querySelectorAll(".portfolio-page .hero, .portfolio-page .section");

const navLinks = document.querySelectorAll(".site-nav a");

let focusedSection = null;
let isSectionFocused = false;

// Afficher uniquement la section selectionnée
function focusSection(target) {
    const section = target.closest(".section, .hero");

    if(!section) {
        restoreSections();
        return target;
    }

    portfolioSections.forEach((item) => {
        item.classList.toggle("is-current-section", item === section);
    });

    document.body.classList.add("is-section-focused");
    focusedSection = section;
    isSectionFocused = true;

    // Mettre en évidence le lien correspondant
    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${target.id}`;

        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    return section;
}

// réaffichez toutes les sections
function restoreSections() {
    if (!focusedSection) return;

    const previousTop = focusedSection.getBoundingClientRect().top;

    document.body.classList.remove("is-section-focused");

    portfolioSections.forEach((item) => {
        item.classList.remove("is-current-section");
    });

    const offset = focusedSection.getBoundingClientRect().top - previousTop;

    window.scrollBy({ top: offset, behavior: "instant"});

    // Retirer l'état actif des liens
    navLinks.forEach((link) => {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
    });

    focusedSection = null;
    isSectionFocused = false;
}

// Transition lors du retour à la page complète
let isRestoring = false;

function restoreSectionsWithTransition() {
    if (!isSectionFocused || !focusedSection || isRestoring || isNavigating) return;

    // La transition ne pourra être déclenchée qu'une seule fois
    isSectionFocused = false;

    if (prefersReducedMotion) {
        restoreSections();
        return;
    }

    isRestoring = true;
    transitionOverlay.classList.add("is-visible");

    setTimeout(() => {
        restoreSections();
        transitionOverlay.classList.remove("is-visible");

        setTimeout(() => {
            isRestoring = false;
        }, 250);
    }, 250);
}

// Restaurer les sections lors du défilement manuel
window.addEventListener("wheel", restoreSectionsWithTransition, { passive: true });
window.addEventListener("touchmove", restoreSectionsWithTransition, { passive: true });

window.addEventListener("keydown", (event) => {
    const scrollKeys = [
        "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "
    ];

if (
    scrollKeys.includes(event.key) &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
) {
    restoreSectionsWithTransition();
}
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");

        if (!hash || hash === "#") return;

        const target = document.getElementById(hash.slice(1));
        if (!target) return;

        event.preventDefault();

        if (isNavigating) return;
        isNavigating = true;

        const navigate = () => {
           const section = focusSection(target);

           section.scrollIntoView({
            behavior: "instant",
            block: "start",
           });

            if (window.location.hash !== hash) {
                history.pushState(null, "", hash);
            }

            transitionOverlay.classList.remove("is-visible");

            setTimeout(() => {
                isNavigating = false;
            }, prefersReducedMotion ? 0 : 250);
        };

        if (prefersReducedMotion) {
            navigate();
        } else {
            transitionOverlay.classList.add("is-visible");
            setTimeout(navigate, 250);
        }
    });
});

// Gérer nous-même la position de défilement dans l'historique
history.scrollRestoration = "manual";

// Boutons Précédent et Suivant du navigateur
window.addEventListener("popstate", () => {
    const hash = window.location.hash;
    const target = hash
        ? document.getElementById(decodeURIComponent(hash.slice(1)))
        : null;

    // Retour à la page complète
    if (!target) {
        restoreSections();
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
    }

    // Afficher la section correspondant à l'URL
    const section = focusSection(target);

    // Repositionner la page après la modification de l'affichage
    window.scrollTo({ top: 0, behavior: "instant" });

    requestAnimationFrame(() => {
        section.scrollIntoView({
            behavior: "instant",
            block: "start",
        });
    });
});