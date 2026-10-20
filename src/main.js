import './style.css'
import './courses.json'
import { afficherCours, filtrerParMatiere, filtrerParNiveau } from './functions.js'

afficherCours()

const niveauSelect = document.querySelector('#niveau')
niveauSelect.addEventListener('change', filtrerParNiveau)

const matierSelect=document.querySelector("#matiere")
matierSelect.addEventListener("change",filtrerParMatiere)