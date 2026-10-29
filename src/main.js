import './style.css'
import './courses.json'
import {
  afficherCours,
  afficherFormulaire,
  afficherPanier,
  ajouterAuPanier,
  fermerDetailsCours,
  fermerFormulaire,
  fermerConfirmation,
  filtrerParMatiere,
  filtrerParNiveau,
  rechercherParMatiere,
  terminerConfirmation,
  validerFormulaire
} from './functions.js'

afficherCours()
afficherPanier()

const niveauSelect = document.querySelector('#niveau')
niveauSelect.addEventListener('change', filtrerParNiveau)

const matierSelect = document.querySelector('#matiere')
matierSelect.addEventListener('change', filtrerParMatiere)

const rechercheInput = document.querySelector('#recherche')
rechercheInput.addEventListener('input', rechercherParMatiere)

const fermerDetail = document.querySelector('#fermer_detail')
fermerDetail.addEventListener('click', fermerDetailsCours)

const overlayDetail = document.querySelector('#overlay_detail')
overlayDetail.addEventListener('click', fermerDetailsCours)

const boutonAjouterPanier = document.querySelector('#ajouter_panier')
boutonAjouterPanier.addEventListener('click', ajouterAuPanier)

const btnsPanier = document.querySelector('#btn-panier')
btnsPanier.addEventListener('click', afficherFormulaire)

const btnRetourCours = document.querySelector('#btn_retour_cours')
btnRetourCours.addEventListener('click', fermerFormulaire)

// Popup de confirmation : Retour au catalogue (ferme sans terminer le parcours)
const btnRetourCatalogue = document.querySelector('#retour_catalogue')
btnRetourCatalogue.addEventListener('click', fermerConfirmation)

// Popup de confirmation : Terminer (action locale, aucun envoi réseau)
const btnEnvoyer = document.querySelector('#btn_envoyer')
btnEnvoyer.addEventListener('click', terminerConfirmation)


validerFormulaire()