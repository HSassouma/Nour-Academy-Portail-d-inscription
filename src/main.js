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
  validerFormulaire,
}
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
const reset=document.querySelector("#reset")
reset.addEventListener("click",fermerform)
const continuer = document.querySelector("#continuer");
continuer.addEventListener("click",afficherform)
const formulaire = document.querySelector(".contenainer_form form");

formulaire.noValidate = true;
formulaire.querySelectorAll("input, select").forEach(function (champ) {
  champ.addEventListener("input", function () {
    validerFormulaire();
  });

  champ.addEventListener("change", function () {
    validerFormulaire();
  });
});
formulaire.addEventListener("submit", function (event) {
  event.preventDefault();

  if (validerFormulaire()) {
    alert("Formulaire valide !");
  } else {
    formulaire.reportValidity();
  }
});
