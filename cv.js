// Récupération du sélecteur et des sections du CV
const cvSelect = document.querySelector("#cv-section-select");
const cvSections = document.querySelectorAll("[data-cv-section]");

// Préférences d'accessibilité
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

let transitionTimeout;

// Réaction au changement de sélection
cvSelect.addEventListener("change", () => {
    const selectedValue = cvSelect.value;

    clearTimeout(transitionTimeout);

    cvSections.forEach((section) => {
        section.classList.remove("cv-fade-out", "cv-fade-in");
    });

    // Appliquer le filtre et faire apparaître les sections
    const showSelectedSections = () => {
        cvSections.forEach((section) => {
            const shouldShow =
            selectedValue === "all" ||
            section.dataset.cvSection === selectedValue;

            section.hidden = !shouldShow;

            if (shouldShow && !prefersReducedMotion) {
                section.classList.add("cv-fade-in");
            }
        });

        // Actualiser la visibilité de la flèche
        requestAnimationFrame(updateCvBackToTop);
    };

    // Sans animation si l'utilisateur préfère réduire les mouvements
    if (prefersReducedMotion) {
        showSelectedSections();
        return;
    }

    // Faire disparaître les sections actuellement visibles
    cvSections.forEach((section) => {
        if (!section.hidden) {
            section.classList.add("cv-fade-out");
        }
    });

    // Changer les sections après leur sélection
    transitionTimeout = setTimeout(showSelectedSections, 200);
});

// Afficher la flèche uniquement lorsque le défilement est utile
const cvBackToTop = document.querySelector(".cv-back-to-top");

function updateCvBackToTop() {
    const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

    const shouldShow =
    scrollableHeight > 300 && window.scrollY > 200;

    cvBackToTop.classList.toggle("is-visible", shouldShow);
}
window.addEventListener("scroll", updateCvBackToTop, { passive: true });
window.addEventListener("resize", updateCvBackToTop);

updateCvBackToTop();