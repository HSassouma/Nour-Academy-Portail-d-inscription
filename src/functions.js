// chargement des cours, une seule fois
let tousLesCours = null;

function formaterMad(montant) {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(montant)} MAD`;
}

async function chargerCours() {
  if (tousLesCours === null) {
    const response = await fetch(new URL("./courses.json", import.meta.url));

    if (!response.ok) {
      throw new Error("Impossible de charger les cours");
    }

    tousLesCours = await response.json();
  }

  return tousLesCours;
}

// function afficherCours
const catalogueContainer = document.querySelector(".cards");

catalogueContainer.addEventListener("click", async (event) => {
  const bouton = event.target.closest("button");
  const carte = bouton?.closest("[data-id]");

  if (!bouton || !carte) return;

  const id = Number(carte.dataset.id);

  if (bouton.matches(".btn-details")) {
    afficherDetailsCours(id);
  } else if (bouton.matches(".btn-ajouter")) {
    const cours = (await chargerCours()).find((element) => element.id === id);
    ajouterCoursAuPanier(cours);
  }
});

export async function afficherCours(tab) {
  try {
    const courses = tab ?? (await chargerCours());
    const container = document.querySelector(".cards");
    const tabCours = tab ?? courses;

    container.innerHTML = "";

    tabCours.forEach((course) => {
      const card = document.createElement("div");
      const complet = course.seats === 0;
      const places = `${course.seats} place${course.seats > 1 ? "s" : ""} restante${course.seats > 1 ? "s" : ""}`;

      card.className =
        "w-full space-y-3 rounded-2xl border border-[#E6F0E9] bg-white p-4 shadow-sm";
      card.dataset.id = course.id;

      card.innerHTML = `
        <header class="flex items-start gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E6F0E9] text-[#174A3A]"
          >
            <i class="fa-solid fa-${course.icon} text-2xl" aria-hidden="true"></i>
          </div>

          <div class="min-w-0">
            <h2 class="text-lg font-bold text-[#174A3A]">
              ${course.title}
            </h2>

            <p class="text-sm text-[#65716A]">
              ${course.level}
            </p>

            <p class="mt-1 text-xs text-[#65716A]">
              <i class="fa-regular fa-clock mr-1" aria-hidden="true"></i>
              ${course.schedule}
            </p>
          </div>
        </header>

        <p class="line-clamp-2 text-sm text-[#65716A]">
          ${course.description}
        </p>

        <div class="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
          <p class="text-sm text-[#1D2924]">
            <strong class="text-lg text-[#174A3A]">${formaterMad(course.price * 4)}</strong>
            <span class="text-xs text-[#65716A]">/ mois</span>
          </p>
          <p class="text-xs text-[#65716A]">${formaterMad(course.price)} / séance</p>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2">
          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              complet
                ? "bg-red-50 text-red-700"
                : "bg-[#E6F0E9] text-[#174A3A]"
            }"
          >
            ${complet ? "Complet" : places}
          </span>
          <span class="text-xs text-[#65716A]">${course.duration}</span>
        </div>

        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="btn-details min-h-11 w-full rounded-xl border border-[#174A3A] px-4 py-2 text-sm font-medium text-[#174A3A] transition hover:bg-[#E6F0E9]"
          >
            Voir les détails
          </button>

          <button
            type="button"
            data-id="${course.id}"
            data-complet="${complet}"
            class="btn-ajouter min-h-11 w-full rounded-xl px-4 py-2 text-sm font-medium transition ${
              complet
                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                : "bg-[#174A3A] text-white hover:bg-[#10372C] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            }"
            ${complet ? "disabled" : ""}
          >
            ${complet ? "Complet" : "Ajouter au panier +"}
          </button>
        </div>
      `;

      container.append(card);
    });

    mettreAJourBoutonsCatalogue();

    document.querySelector("#resultats_count").textContent =
      `${tabCours.length} cours`;
    document
      .querySelector("#etat_vide")
      .classList.toggle("hidden", tabCours.length > 0);
  } catch (error) {
    console.error("Erreur :", error);
  }
}
// filtres niveau + matière + recherche par titre
const filter_niveau = document.querySelector("#niveau");
const filter_matier = document.querySelector("#matiere");
const filter_recherche = document.querySelector("#recherche");

function sansAccents(texte) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filtrerListe(courses) {
  const recherche = sansAccents(filter_recherche.value.trim());

  return courses.filter(
    (cour) =>
      (filter_niveau.value === "" ||
        cour.levelValue === filter_niveau.value) &&
      (filter_matier.value === "" || cour.subject === filter_matier.value) &&
      (recherche === "" ||
        sansAccents(`${cour.title} ${cour.subject}`).includes(recherche)),
  );
}

export async function appliquerFiltres() {
  try {
    const courses = await chargerCours();
    afficherCours(filtrerListe(courses));
  } catch (error) {
    console.error("Erreur :", error);
  }
}

// afficherDetailsCours
const detailCard = document.querySelector("#detail_card");
const detailOverlay = document.querySelector("#overlay_detail");
const detailIcone = document.querySelector("#detail_icone");
const detailTitre = document.querySelector("#detail_titre");
const detailNiveau = document.querySelector("#detail_niveau");
const detailDescription = document.querySelector("#detail_description");
const detailProgramme = document.querySelector("#detail_programme");
const detailCreneau = document.querySelector("#detail_creneau");
const detailPlaces = document.querySelector("#detail_places");
const detailPrix = document.querySelector("#detail_prix");
const detailPrixMensuel = document.querySelector("#detail_prix_mensuel");

const panierContainer = document.querySelector("#cours_panier");
const nombreCoursPanier = document.querySelector("#nombre-cour");
const totalPanier = document.querySelector("#total");

const panier = [];
let coursSelectionne = null;

export function fermerDetailsCours() {
  detailCard.classList.add("hidden");
  detailOverlay.classList.add("hidden");
}

function estDansPanier(id) {
  return panier.some((cours) => cours.id === id);
}

function mettreAJourBoutonsCatalogue() {
  document.querySelectorAll(".btn-ajouter").forEach((bouton) => {
    if (bouton.dataset.complet === "true") {
      return;
    }

    const dejaAjoute = estDansPanier(Number(bouton.dataset.id));

    bouton.disabled = dejaAjoute;
    bouton.textContent = dejaAjoute
      ? "Déjà dans le panier"
      : "Ajouter au panier +";
  });
}

export function afficherPanier() {
  if (panier.length === 0) {
    panierContainer.innerHTML = `
      <p class="py-4 text-center text-sm leading-6 text-[#65716A]">
        Votre panier est vide.<br />
        Ajoutez un cours pour commencer.
      </p>
    `;
  } else {
    panierContainer.innerHTML = panier
      .map(
        (cours) => `
        <div class="flex items-start justify-between gap-2 border-b border-[#E6F0E9] py-3 first:pt-0 last:border-b-0 last:pb-0">
          <div class="min-w-0">
            <p class="text-xs font-semibold uppercase tracking-wide text-[#65716A]">
              ${cours.subject}
            </p>
            <h3 class="truncate text-sm font-bold text-[#174A3A]">
              ${cours.title}
            </h3>
            <p class="mt-0.5 text-xs text-[#65716A]">${cours.level}</p>
            <p class="mt-1 text-xs text-[#65716A]">${cours.schedule}</p>
            <p class="mt-1 text-sm font-semibold text-[#174A3A]">
              ${formaterMad(cours.price * 4)}
              <span class="text-xs font-normal text-[#65716A]">/ mois</span>
            </p>
          </div>

          <button
            type="button"
            data-id="${cours.id}"
            class="btn-supprimer flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#65716A] transition hover:bg-red-50 hover:text-red-700"
            aria-label="Retirer ${cours.title} du panier"
          >
            <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
          </button>
        </div>
      `,
      )
      .join("");

    panierContainer.querySelectorAll(".btn-supprimer").forEach((bouton) => {
      bouton.addEventListener("click", () => {
        supprimerDuPanier(Number(bouton.dataset.id));
      });
    });
  }

  nombreCoursPanier.textContent = panier.length;
  totalPanier.textContent = formaterMad(panier.reduce(
    (total, cours) => total + cours.price * 4,
    0,
  ));

  document.querySelector("#continuer").disabled = panier.length === 0;

  mettreAJourBoutonsCatalogue();
}

export function supprimerDuPanier(id) {
  const index = panier.findIndex((cours) => cours.id === id);

  if (index !== -1) {
    panier.splice(index, 1);
    afficherPanier();
  }
}

export function viderPanier() {
  panier.splice(0, panier.length);
  afficherPanier();
}

export function ajouterCoursAuPanier(cours) {
  if (!cours || cours.seats === 0 || estDansPanier(cours.id)) {
    return false;
  }

  panier.push(cours);
  afficherPanier();
  return true;
}

export function ajouterAuPanier() {
  if (!coursSelectionne) {
    return;
  }

  if (ajouterCoursAuPanier(coursSelectionne)) {
    fermerDetailsCours();
  }
}

export async function afficherDetailsCours(idcard) {
  try {
    const response = await fetch(new URL("./courses.json", import.meta.url));

    if (!response.ok) {
      throw new Error("Impossible de charger les cours");
    }

    const courses = await response.json();

    const result = courses.find((cour) => cour.id === Number(idcard));

    if (!result) {
      throw new Error("Cours introuvable");
    }

    coursSelectionne = result;

    detailTitre.textContent = result.title;
    detailNiveau.textContent = `${result.level} · ${result.duration}`;
    detailDescription.textContent = result.description;
    detailCreneau.textContent = result.schedule;
    detailPlaces.textContent =
      result.seats === 0
        ? "Complet"
        : `${result.seats} place${result.seats > 1 ? "s" : ""} restante${result.seats > 1 ? "s" : ""}`;
    detailPrix.textContent = formaterMad(result.price);
    detailPrixMensuel.textContent = formaterMad(result.price * 4);

    const boutonAjouter = document.querySelector("#ajouter_panier");
    const complet = result.seats === 0;
    const dejaAjoute = estDansPanier(result.id);
    const indisponible = complet || dejaAjoute;

    boutonAjouter.disabled = indisponible;
    boutonAjouter.className = `w-full rounded-xl px-4 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#174A3A] focus:ring-offset-2 ${
      indisponible
        ? "cursor-not-allowed bg-gray-200 text-gray-500"
        : "bg-[#174A3A] text-white hover:bg-[#10372C]"
    }`;
    boutonAjouter.innerHTML = complet
      ? "Complet"
      : dejaAjoute
        ? "Déjà dans le panier"
        : 'Ajouter au panier <i class="fa-solid fa-basket-shopping ml-2" aria-hidden="true"></i>';

    const chapitres = result.programme ?? [];

    detailProgramme.replaceChildren(
      ...chapitres.map((chapitre) => {
        const item = document.createElement("li");

        item.className = "flex items-start gap-3";
        item.innerHTML = `
          <i class="fa-solid fa-check mt-1 text-[#174A3A]" aria-hidden="true"></i>
          <span></span>
        `;
        item.querySelector("span").textContent = chapitre;

        return item;
      }),
    );

    const classesIcone = Array.from(detailIcone.classList).filter((classe) =>
      classe.startsWith("fa-"),
    );

    detailIcone.classList.remove(...classesIcone);
    detailIcone.classList.add("fa-solid", `fa-${result.icon}`);

    detailCard.classList.remove("hidden");
    detailOverlay.classList.remove("hidden");
    detailCard.scrollTop = 0;
  } catch (error) {
    console.error("Erreur :", error);
  }
}
// formulaire d'inscription
const formulaire = document.querySelector(".contenainer_form form");
const etape1 = document.querySelector("#etape_1");
const etape2 = document.querySelector("#etape_2");
const indicateur1 = document.querySelector("#indicateur_etape_1");
const indicateur2 = document.querySelector("#indicateur_etape_2");
const ligneEtapes = document.querySelector("#ligne_etapes");
const boutonRetour = document.querySelector("#etape_retour");
const boutonSuivant = document.querySelector("#etape_suivante");
const boutonEnvoyer = document.querySelector("#send");

const champs = [
  "nom_pere",
  "email_pere",
  "telephone",
  "nom_etudiant",
  "niveaux",
  "mot_pass",
  "confirme_motPass",
  "consentement",
];

function champParId(id) {
  return document.querySelector(`#${id}`);
}

function afficherErreur(champ, message, succes = "") {
  champ.setCustomValidity(message);

  const erreur = document.querySelector(`#erreur_${champ.id}`);

  if (erreur) {
    erreur.textContent = message || succes;
    erreur.classList.toggle("hidden", message === "" && succes === "");
    erreur.classList.toggle("text-red-600", message !== "");
    erreur.classList.toggle("text-green-700", message === "" && succes !== "");
  }

  if (champ.type !== "checkbox") {
    champ.classList.toggle("border-red-500", message !== "");
    champ.classList.toggle("border-green-600", message === "" && succes !== "");
  }

  if (message !== "") {
    champ.setAttribute("aria-invalid", "true");
  } else {
    champ.removeAttribute("aria-invalid");
  }
}

export function validerChamp(champ) {
  let message = "";
  const valeur = champ.value.trim();

  switch (champ.id) {
    case "nom_pere":
      if (valeur === "") {
        message = "Veuillez saisir le nom du responsable.";
      }
      break;

    case "email_pere":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur)) {
        message = "Veuillez saisir une adresse e-mail valide.";
      }
      break;

    case "telephone": {
      const telephone = valeur.replace(/[\s.-]/g, "");

      if (
        !/^(06|07)\d{8}$/.test(telephone) &&
        !/^\+212[67]\d{8}$/.test(telephone)
      ) {
        message =
          "Saisissez un numéro marocain valide (06…, 07… ou +2126/7…).";
      }
      break;
    }

    case "nom_etudiant":
      if (valeur === "") {
        message = "Veuillez saisir le nom de l’élève.";
      }
      break;

    case "niveaux":
      if (valeur === "") {
        message = "Veuillez choisir un niveau scolaire.";
      }
      break;

    case "mot_pass": {
      const motDePasseValide =
        valeur.length >= 8 &&
        /[A-Z]/.test(valeur) &&
        /[0-9]/.test(valeur) &&
        /[^A-Za-z0-9\s]/.test(valeur);

      if (!motDePasseValide) {
        message =
          "8 caractères minimum, avec une majuscule, un chiffre et un caractère spécial.";
      }
      break;
    }

    case "confirme_motPass":
      if (valeur === "") {
        message = "Veuillez confirmer le mot de passe.";
      } else if (valeur !== champParId("mot_pass").value) {
        message = "Les mots de passe ne correspondent pas.";
      }
      break;

    case "consentement":
      if (!champ.checked) {
        message = "Vous devez accepter le traitement de vos données.";
      }
      break;
  }

  const messagesSucces = {
    nom_pere: "Nom renseigné.",
    email_pere: "Adresse e-mail valide.",
    telephone: "Numéro marocain valide.",
    nom_etudiant: "Nom de l’élève renseigné.",
    niveaux: "Niveau sélectionné.",
    mot_pass: "Mot de passe conforme.",
    confirme_motPass: "Les mots de passe correspondent.",
    consentement: "Consentement enregistré.",
  };
  const estRenseigne = champ.type === "checkbox" ? champ.checked : valeur !== "";
  afficherErreur(champ, message, estRenseigne ? messagesSucces[champ.id] : "");

  if (champ.id === "mot_pass") {
    mettreAJourJauge();

    const confirmation = champParId("confirme_motPass");

    if (confirmation.value !== "") {
      validerChamp(confirmation);
    }
  }

  return message === "";
}

function mettreAJourJauge() {
  const motPasse = champParId("mot_pass").value;
  const score = [
    motPasse.length >= 8,
    /[A-Z]/.test(motPasse),
    /[0-9]/.test(motPasse),
    /[^A-Za-z0-9\s]/.test(motPasse),
  ].filter(Boolean).length;

  const etats = [
    ["w-0 bg-red-500", "Trop faible", "text-red-600"],
    ["w-1/4 bg-red-500", "Faible", "text-red-600"],
    ["w-2/4 bg-orange-500", "Moyen", "text-orange-600"],
    ["w-3/4 bg-yellow-500", "Bon", "text-yellow-700"],
    ["w-full bg-green-600", "Fort", "text-green-700"],
  ];

  const [largeur, texte, couleur] = etats[score];

  document.querySelector("#jauge_barre").className =
    `h-full rounded-full transition-all ${largeur}`;
  document.querySelector("#jauge_texte").className =
    `text-xs font-semibold ${couleur}`;
  document.querySelector("#jauge_texte").textContent = texte;
  document.querySelector("#jauge").setAttribute("aria-valuenow", score);
}

function stylerIndicateur(indicateur, actif) {
  const [cercle, texte] = indicateur.querySelectorAll("span");

  cercle.classList.toggle("bg-[#174A3A]", actif);
  cercle.classList.toggle("text-white", actif);
  cercle.classList.toggle("bg-[#E6F0E9]", !actif);
  cercle.classList.toggle("text-[#174A3A]", !actif);

  texte.classList.toggle("text-[#174A3A]", actif);
  texte.classList.toggle("font-semibold", actif);
  texte.classList.toggle("text-[#65716A]", !actif);
}

export function afficherEtape(numero) {
  const deuxieme = numero === 2;

  etape1.classList.toggle("hidden", deuxieme);
  etape2.classList.toggle("hidden", !deuxieme);
  boutonRetour.classList.toggle("hidden", !deuxieme);
  boutonSuivant.classList.toggle("hidden", deuxieme);
  boutonEnvoyer.classList.toggle("hidden", !deuxieme);
  stylerIndicateur(indicateur1, true);
  stylerIndicateur(indicateur2, deuxieme);
  ligneEtapes.classList.toggle("bg-[#174A3A]", deuxieme);
  ligneEtapes.classList.toggle("bg-[#E6F0E9]", !deuxieme);

  document.querySelector("#formulaire_inscription").scrollTop = 0;
}

function validerEtape1() {
  let valide = true;

  ["nom_pere", "email_pere", "telephone", "nom_etudiant", "niveaux"].forEach(
    (id) => {
      if (!validerChamp(champParId(id))) {
        valide = false;
      }
    },
  );

  return valide;
}

export function validerFormulaire() {
  let valide = true;

  champs.forEach((id) => {
    if (!validerChamp(champParId(id))) {
      valide = false;
    }
  });

  return valide;
}

export function focusPremierChampInvalide() {
  const champ = champs
    .map((id) => champParId(id))
    .find((champ) => !champ.validity.valid);

  if (!champ) {
    return;
  }

  if (champ.closest("#etape_2")) {
    afficherEtape(2);
  } else {
    afficherEtape(1);
  }

  champ.focus();
}

export function passerEtape2() {
  if (validerEtape1()) {
    afficherEtape(2);
    champParId("mot_pass").focus();
  } else {
    focusPremierChampInvalide();
  }
}

export function revenirEtape1() {
  afficherEtape(1);
  champParId("nom_pere").focus();
}

export function reinitialiserFormulaire() {
  formulaire.reset();
  champs.forEach((id) => afficherErreur(champParId(id), ""));
  afficherEtape(1);
  mettreAJourJauge();
  document.querySelector("#recap_formulaire").textContent = "";
}

export function afficherform() {
  const messagePanier = document.querySelector("#message_panier");

  if (panier.length === 0) {
    messagePanier.textContent =
      "Ajoutez au moins un cours avant de vous inscrire.";
    messagePanier.classList.remove("hidden");
    return false;
  }

  messagePanier.classList.add("hidden");
  messagePanier.textContent = "";
  reinitialiserFormulaire();

  const total = panier.reduce((somme, cours) => somme + cours.price * 4, 0);

  document.querySelector("#recap_formulaire").textContent =
    `${panier.length} cours sélectionné${panier.length > 1 ? "s" : ""} · ${formaterMad(total)} / mois`;

  document.querySelector("#formulaire_inscription").classList.remove("hidden");
  document.querySelector("#overlay_form").classList.remove("hidden");
  champParId("nom_pere").focus();

  return true;
}

export function fermerform() {
  document.querySelector("#formulaire_inscription").classList.add("hidden");
  document.querySelector("#overlay_form").classList.add("hidden");
  reinitialiserFormulaire();
  document.querySelector("#continuer").focus();
}

export function panierEstVide() {
  return panier.length === 0;
}
