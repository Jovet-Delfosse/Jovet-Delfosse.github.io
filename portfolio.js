const realisationsAccordion = document.querySelector(".realisations-accordion");
const realisationsToggle = document.querySelector(".realisations-toggle");

realisationsToggle.addEventListener("click", () => {
    const isOpen = realisationsAccordion.classList.toggle("is-open");

    realisationsToggle.setAttribute("aria-expanded", String(isOpen));
})