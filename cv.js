// Récupération du sélecteur
const cvSelect = document.querySelector("#cv-section-select");

// Récupération des sections du CV
const cvSections = document.querySelectorAll("[data-cv-section]");

// Réaction au changement de sélection
cvSelect.addEventListener("change", () => {
    const selectedValue = cvSelect.value;

    cvSections.forEach((section) => {
        section.hidden =
        selectedValue !== "all" &&
        section.dataset.cvSection !== selectedValue;
    });
});