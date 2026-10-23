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
  envoyerInscription,
  filtrerParMatiere,
  filtrerParNiveau,
  rechercherParMatiere,
  validerFormulaire,
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

const reste = document.querySelector('#reset')
reste.addEventListener('click', fermerFormulaire)

// Popup de confirmation : Retour au catalogue (ferme sans enregistrer)
const btnRetourCatalogue = document.querySelector('#retour_catalogue')
btnRetourCatalogue.addEventListener('click', fermerConfirmation)

// Popup de confirmation : Envoyer (enregistre dans inscription.json)
const btnEnvoyer = document.querySelector('#btn_envoyer')
btnEnvoyer.addEventListener('click', envoyerInscription)

validerFormulaire()