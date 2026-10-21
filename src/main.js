import './style.css'
import './courses.json'
import {
  afficherCours,
  afficherPanier,
  ajouterAuPanier,
  fermerDetailsCours,
  filtrerParMatiere,
  filtrerParNiveau,
} from './functions.js'

afficherCours()
afficherPanier()

const niveauSelect = document.querySelector('#niveau')
niveauSelect.addEventListener('change', filtrerParNiveau)

const matierSelect=document.querySelector("#matiere")
matierSelect.addEventListener("change",filtrerParMatiere)

const fermerDetail = document.querySelector('#fermer_detail')
fermerDetail.addEventListener('click', fermerDetailsCours)

const overlayDetail = document.querySelector('#overlay_detail')
overlayDetail.addEventListener('click', fermerDetailsCours)

const boutonAjouterPanier = document.querySelector('#ajouter_panier')
boutonAjouterPanier.addEventListener('click', ajouterAuPanier)