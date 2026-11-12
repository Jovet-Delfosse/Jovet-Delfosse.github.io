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

const prefersReducedMotion = window.matchMedia("(prefer-reduced-motion: reduce)").matches;

let isNavigating = false;

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
           const section = target.closest(".section") || target;

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