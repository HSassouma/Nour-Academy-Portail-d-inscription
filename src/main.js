import './style.css'
import './courses.json'
import {
  afficherCours,
  afficherPanier,
  ajouterAuPanier,
  fermerDetailsCours,
  appliquerFiltres,
  afficherform,
  fermerform,
  focusPremierChampInvalide,
  passerEtape2,
  revenirEtape1,
  reinitialiserFormulaire,
  validerFormulaire,
  validerChamp,
  viderPanier,
} from './functions.js'

afficherCours()
afficherPanier()

const niveauSelect = document.querySelector('#niveau')
niveauSelect.addEventListener('change', appliquerFiltres)

const matierSelect = document.querySelector('#matiere')
matierSelect.addEventListener('change', appliquerFiltres)

const rechercheInput = document.querySelector('#recherche')
rechercheInput.addEventListener('input', appliquerFiltres)

const boutonReinitialiser = document.querySelector('#reinitialiser_filtres')
boutonReinitialiser.addEventListener('click', () => {
  niveauSelect.value = ''
  matierSelect.value = ''
  rechercheInput.value = ''
  appliquerFiltres()
})

const fermerDetail = document.querySelector('#fermer_detail')
fermerDetail.addEventListener('click', fermerDetailsCours)

const overlayDetail = document.querySelector('#overlay_detail')
overlayDetail.addEventListener('click', fermerDetailsCours)

const boutonAjouterPanier = document.querySelector('#ajouter_panier')
boutonAjouterPanier.addEventListener('click', ajouterAuPanier)
const continuer = document.querySelector("#continuer");
continuer.addEventListener("click",afficherform)
document.querySelector("#fermer_form").addEventListener("click", fermerform)
document.querySelector("#overlay_form").addEventListener("click", fermerform)
document.querySelector("#etape_suivante").addEventListener("click", passerEtape2)
document.querySelector("#etape_retour").addEventListener("click", revenirEtape1)
const formulaire = document.querySelector(".contenainer_form form");

formulaire.noValidate = true;
formulaire.querySelectorAll("input, select").forEach((champ) => {
  champ.addEventListener("input", () => validerChamp(champ));
  champ.addEventListener("change", () => validerChamp(champ));
});
formulaire.addEventListener("submit", (event) => {
  event.preventDefault();

  if (validerFormulaire()) {
    const nomEleve = document.querySelector("#nom_etudiant").value.trim();
    const niveau = document.querySelector("#niveaux").value;
    const coursChoisis = Array.from(document.querySelectorAll("#cours_panier h3"), (element) => element.textContent.trim());
    const total = document.querySelector("#total").textContent;
    const numeroDossier = `NA-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    document.querySelector("#resume_confirmation").innerHTML = `
      <p class="text-sm text-[#65716A]">Numéro de dossier</p>
      <p class="mt-1 text-xl font-bold text-[#174A3A]">${numeroDossier}</p>
      <dl class="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div><dt class="font-semibold text-[#174A3A]">Élève</dt><dd>${echapperHtml(nomEleve)}</dd></div>
        <div><dt class="font-semibold text-[#174A3A]">Niveau</dt><dd>${echapperHtml(niveau)}</dd></div>
        <div><dt class="font-semibold text-[#174A3A]">Cours</dt><dd>${coursChoisis.map(echapperHtml).join(", ")}</dd></div>
        <div><dt class="font-semibold text-[#174A3A]">Total mensuel</dt><dd>${echapperHtml(total)}</dd></div>
      </dl>`;

    document.querySelector("#confirmation").classList.remove("hidden");
    document.querySelector("#formulaire_inscription").classList.add("hidden");
    document.querySelector("#overlay_form").classList.add("hidden");
    reinitialiserFormulaire();
    viderPanier();
    document.querySelector("#confirmation").focus();
  } else {
    focusPremierChampInvalide();
  }
});

document.querySelector("#fermer_confirmation").addEventListener("click", () => {
  document.querySelector("#confirmation").classList.add("hidden");
  document.querySelector("#resume_confirmation").replaceChildren();
  document.querySelector("#cards_and_panier").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (!document.querySelector("#confirmation").classList.contains("hidden")) {
    document.querySelector("#fermer_confirmation").click();
  } else if (!document.querySelector("#formulaire_inscription").classList.contains("hidden")) {
    fermerform();
  } else if (!document.querySelector("#detail_card").classList.contains("hidden")) {
    fermerDetailsCours();
  }
});

function echapperHtml(texte) {
  const element = document.createElement("span");
  element.textContent = texte;
  return element.innerHTML;
}
