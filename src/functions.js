const SEANCES_PAR_MOIS = 4;
const REGEX_NOM = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.-]*$/u;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_MOT_DE_PASSE = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;
const NIVEAUX_AUTORISES = ["college", "tronc-commun", "1bac", "2bac"];

function nomValide(valeur) {
  const nom = valeur.trim();
  return nom.length >= 2 && nom.length <= 80 && REGEX_NOM.test(nom);
}

function emailValide(valeur) {
  const email = valeur.trim();
  return email.length <= 254 && REGEX_EMAIL.test(email);
}

// function afficherCours
export async function afficherCours(tab) {
  try {
    const response = await fetch(new URL("./courses.json", import.meta.url));

    if (!response.ok) {
      throw new Error("Impossible de charger les cours");
    }

    const courses = await response.json();
    const container = document.querySelector(".cards");
    const tabCours = tab ?? courses;

    container.innerHTML = "";

    tabCours.forEach((course) => {
      const card = document.createElement("div");

      card.className =
        "w-full space-y-3 rounded-2xl border border-[#E6F0E9] bg-white p-4 shadow-sm";
      card.dataset.id = course.id;

      card.innerHTML = `
        <main class="flex items-start gap-3">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E6F0E9] text-[#174A3A]"
          >
            <i class="fa-solid fa-${course.icon} text-2xl" aria-hidden="true"></i>
          </div>

          <div>
            <h2 class="text-lg font-bold text-[#174A3A]">
              ${course.title}
            </h2>

            <p class="text-sm text-[#65716A]">
              ${course.level}
            </p>

            <p class="mt-1 text-xs text-[#65716A]">
              ${course.duration}
            </p>
          </div>
        </main>

        <p class="text-sm text-[#65716A]">
          ${course.description}
        </p>

        <p class="text-sm text-[#1D2924]">
          <strong class="text-[#174A3A]">${course.price} DH</strong> / séance
        </p>

        <a
          href="#"
          class="block text-right text-sm text-[#174A3A] underline"
        >
          Voir les détails
        </a>

        <button
          id="btn${course.id}"
          data-course-id="${course.id}"
          type="button"
          class="w-full rounded-xl bg-[#174A3A] p-2 text-sm font-medium text-white hover:bg-[#10372C]"
          aria-pressed="false"
        >
          Ajouter au panier +
        </button>
      `;

      card.addEventListener("click", (event) => {
        event.preventDefault();
        afficherDetailsCours(course.id);
      });
      const btncard = card.querySelector(`#btn${course.id}`);
      btncard.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        ajouterCoursAuPanier(course);
      });

      container.append(card);
    });

    mettreAJourBoutonsPanier();
  } catch (error) {
    console.error("Erreur :", error);
  }
}
// filtres niveau, matière et recherche
const filter_niveau = document.querySelector("#niveau");
const filter_matier = document.querySelector("#matiere");
const filter_recherche = document.querySelector("#recherche");

function filtrerCours(courses) {
  const recherche = filter_recherche.value.trim().toLowerCase();

  return courses.filter(
    (cour) =>
      (filter_niveau.value === "" || cour.levelValue === filter_niveau.value) &&
      (filter_matier.value === "" || cour.subject === filter_matier.value) &&
      (recherche === "" || cour.subject.toLowerCase().includes(recherche)),
  );
}

export async function filtrerParNiveau() {
  try {
    const response = await fetch(new URL("./courses.json", import.meta.url));

    if (!response.ok) {
      throw new Error("Impossible de charger les cours");
    }

    const courses = await response.json();
    const result = filtrerCours(courses);

    afficherCours(result);
  } catch (error) {
    console.error("Erreur :", error);
  }
}
// filtrerParMatiere
export async function filtrerParMatiere() {
  try {
    const response = await fetch(new URL("./courses.json", import.meta.url));

    if (!response.ok) {
      throw new Error("Impossible de charger les cours");
    }

    const courses = await response.json();
    const result = filtrerCours(courses);

    afficherCours(result);
  } catch (error) {
    console.error("Erreur :", error);
  }
}
// rechercherParMatiere
export async function rechercherParMatiere() {
  try {
    const response = await fetch(new URL("./courses.json", import.meta.url));

    if (!response.ok) {
      throw new Error("Impossible de charger les cours");
    }

    const courses = await response.json();
    const result = filtrerCours(courses);

    afficherCours(result);
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
const detailDuree = document.querySelector("#detail_duree");
const detailPrix = document.querySelector("#detail_prix");
const detailPrixMensuel = document.querySelector("#detail_prix_mensuel");

const panierContainer = document.querySelector("#cours_panier");
const nombreCoursPanier = document.querySelector("#nombre-cour");
const totalPanier = document.querySelector("#total");

const panier = [];
let coursSelectionne = null;

function coursEstDansPanier(coursId) {
  return panier.some((cours) => cours.id === coursId);
}

function mettreAJourBoutonsPanier() {
  document.querySelectorAll(".cards button[data-course-id]").forEach((bouton) => {
    const estAjoute = coursEstDansPanier(Number(bouton.dataset.courseId));

    bouton.textContent = estAjoute ? "Ajouté au panier" : "Ajouter au panier +";
    bouton.setAttribute("aria-pressed", String(estAjoute));
  });
}

function ajouterCoursAuPanier(cours) {
  if (!cours || coursEstDansPanier(cours.id)) return false;

  panier.push(cours);
  afficherPanier();
  return true;
}

export function fermerDetailsCours() {
  detailCard.classList.add("hidden");
  detailOverlay.classList.add("hidden");
}

export function afficherPanier() {
  panierContainer.replaceChildren(
    ...panier.map((cours) => {
      const item = document.createElement("div");

      item.className =
        "flex items-start  max-h-20 overflow-y-auto justify-between gap-3 border-b border-[#E6F0E9] py-3 first:pt-0 last:border-b-0 last:pb-0";

      const infos = document.createElement("div");
      infos.className = "min-w-0    ";

      const matiere = document.createElement("p");
      matiere.className =
        "text-xs font-semibold uppercase tracking-wide text-[#65716A]";
      matiere.textContent = cours.subject;

      const titre = document.createElement("h3");
      titre.className = "truncate text-sm font-bold text-[#174A3A]";
      titre.textContent = cours.title;

      const niveau = document.createElement("p");
      niveau.className = "mt-0.5 text-xs text-[#65716A]";
      niveau.textContent = cours.level;

      infos.append(matiere, titre, niveau);

      const prix = document.createElement("div");
      prix.className = "shrink-0 text-right";

      const prixSeance = document.createElement("p");
      prixSeance.className = "text-sm text-[#1D2924]";

      const montant = document.createElement("strong");
      montant.className = "text-[#174A3A]";
      montant.textContent = `${cours.price} DH`;

      const unite = document.createElement("span");
      unite.className = "text-xs text-[#65716A]";
      unite.textContent = " / séance";

      prixSeance.append(montant, unite);

      const prixMensuel = document.createElement("p");
      prixMensuel.className = "mt-1 text-xs text-[#65716A]";
      prixMensuel.textContent = `${cours.price * SEANCES_PAR_MOIS} DH / mois`;

      prix.append(prixSeance, prixMensuel);
      const btnSup = document.createElement("button");
      btnSup.type = "button";
      btnSup.className =
        "shrink-0 text-[#65716A] hover:text-red-600 transition-colors";
      btnSup.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      btnSup.addEventListener("click", () => supprimerDuPanier(cours.id));
      const droite = document.createElement("div");
      droite.className = "flex items-center gap-2";
      droite.append(prix, btnSup);
      item.append(infos, droite);

      return item;
    }),
  );

  nombreCoursPanier.textContent = panier.length;
  totalPanier.textContent = `${panier.reduce(
    (total, cours) => total + cours.price * SEANCES_PAR_MOIS,
    0,
  )} DH`;

  mettreAJourBoutonsPanier();
}

export function ajouterAuPanier() {
  if (!coursSelectionne || !ajouterCoursAuPanier(coursSelectionne)) {
    return;
  }

  fermerDetailsCours();
}

export function supprimerDuPanier(coursId) {
  const index = panier.findIndex((cours) => cours.id === coursId);

  if (index !== -1) {
    panier.splice(index, 1);
    afficherPanier();
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
    detailNiveau.textContent = result.level;
    detailDescription.textContent = result.description;
    detailDuree.textContent = result.duration;
    detailPrix.textContent = `${result.price} DH`;
    detailPrixMensuel.textContent = `${result.price * SEANCES_PAR_MOIS} DH`;

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
export function afficherFormulaire() {
  document.querySelector(".contenainer_form").classList.remove("hidden");

  document.querySelector("#overlay_details").classList.remove("hidden");
}
export function fermerFormulaire() {
  document.querySelector(".contenainer_form").classList.add("hidden");
  document.querySelector("#overlay_details").classList.add("hidden");
}
function reinitialiserValidationFormulaire() {
  const formulaire = document.querySelector("#form_inscription");
  if (!formulaire) return;

  formulaire.querySelectorAll('[id^="erreur_"]').forEach((element) => {
    element.textContent = "";
    if (element.id === "erreur_cours") {
      element.classList.add("hidden");
    }
  });

  formulaire.querySelectorAll("input, select").forEach((champ) => {
    champ.classList.remove("border-red-500", "border-[#269b65]");
  });
}

export function validerFormulaire() {
  const formulaire = document.querySelector("#form_inscription");

  if (!formulaire) return;

  const nomPere = document.querySelector("#nom_pere");
  const emailPere = document.querySelector("#email_pere");
  const nomEtudiant = document.querySelector("#nom_etudiant");
  const prenomEtudiant = document.querySelector("#prenom_etudiant");
  const niveaux = document.querySelector("#niveaux");
  const motPass = document.querySelector("#mot_pass");
  const confirmeMotPass = document.querySelector("#confirme_motPass");
  const consentement = document.querySelector("#consentement");

  const champs = [
    nomPere,
    emailPere,
    nomEtudiant,
    prenomEtudiant,
    niveaux,
    motPass,
    confirmeMotPass,
  ];

  function verifierChamp(champ) {
    let message = "";

    if (champ === nomPere) {
      if (champ.value.trim() === "") {
        message = "Veuillez saisir le nom du responsable.";
      } else if (!nomValide(champ.value)) {
        message =
          "Le nom doit contenir entre 2 et 80 caractères, sans chiffres.";
      }
    } else if (champ === emailPere) {
      if (!emailValide(champ.value)) {
        message = "Veuillez saisir une adresse e-mail valide.";
      }
    } else if (champ === nomEtudiant) {
      if (champ.value.trim() === "") {
        message = "Veuillez saisir le prénom de l'élève.";
      } else if (!nomValide(champ.value)) {
        message =
          "Le prénom doit contenir entre 2 et 80 caractères, sans chiffres.";
      }
    } else if (champ === prenomEtudiant) {
      if (champ.value.trim() === "") {
        message = "Veuillez saisir le nom de famille de l'élève.";
      } else if (!nomValide(champ.value)) {
        message =
          "Le nom de famille doit contenir entre 2 et 80 caractères, sans chiffres.";
      }
    } else if (champ === niveaux) {
      if (champ.value === "") {
        message = "Veuillez choisir un niveau scolaire.";
      } else if (!NIVEAUX_AUTORISES.includes(champ.value)) {
        message = "Veuillez choisir un niveau scolaire valide.";
      }
    } else if (champ === motPass) {
      if (!REGEX_MOT_DE_PASSE.test(champ.value)) {
        message =
          "8 caractères minimum, une majuscule, un chiffre et un caractère spécial.";
      }
    } else if (champ === confirmeMotPass) {
      if (champ.value === "") {
        message = "Veuillez confirmer le mot de passe.";
      } else if (champ.value !== motPass.value) {
        message = "Les mots de passe ne correspondent pas.";
      }
    }

    const erreur = document.querySelector(`#erreur_${champ.id}`);
    if (erreur) erreur.textContent = message;

    champ.classList.toggle("border-red-500", message !== "");
    champ.classList.toggle("border-[#269b65]", message === "");

    return message === "";
  }

  champs.forEach((champ) => {
    champ.addEventListener("input", () => {
      verifierChamp(champ);
      if (champ === motPass && confirmeMotPass.value !== "") {
        verifierChamp(confirmeMotPass);
      }
    });
  });

  consentement.addEventListener("change", () => {
    const erreur = document.querySelector("#erreur_consentement");
    erreur.textContent = consentement.checked
      ? ""
      : "Veuillez accepter le consentement pour continuer.";
  });

  formulaire.addEventListener("reset", () => {
    window.setTimeout(reinitialiserValidationFormulaire, 0);
  });

  formulaire.addEventListener("submit", (event) => {
    event.preventDefault();

    const erreurCours = document.querySelector("#erreur_cours");
    if (panier.length === 0) {
      erreurCours.textContent = "Veuillez sélectionner au moins un cours.";
      erreurCours.classList.remove("hidden");
      return;
    }

    erreurCours.textContent = "";
    erreurCours.classList.add("hidden");

    const champsValides = champs.map((champ) => verifierChamp(champ));
    const premierChampInvalide = champs.find(
      (champ, index) => !champsValides[index],
    );

    const erreurConsentement = document.querySelector("#erreur_consentement");
    if (!consentement.checked) {
      erreurConsentement.textContent =
        "Veuillez accepter le consentement pour continuer.";
    } else {
      erreurConsentement.textContent = "";
    }

    if (premierChampInvalide) {
      premierChampInvalide.focus();
      return;
    }

    if (!consentement.checked) {
      consentement.focus();
      return;
    }
    ouvrirConfirmation({
      nomPere: nomPere.value.trim(),
      emailPere: emailPere.value.trim(),
      nomEtudiant: nomEtudiant.value.trim(),
      prenomEtudiant: prenomEtudiant.value.trim(),
      niveau: niveaux.value,
    });
  });
}

const confirmationSection = document.querySelector(".contenainer_confirmation");
const overlayConfirmation = document.querySelector("#overlay_confirmation");

function ouvrirConfirmation({
  nomPere,
  emailPere,
  nomEtudiant,
  prenomEtudiant,
  niveau,
}) {
  document.querySelector("#confirmation_nom_etudiant").textContent =
    nomEtudiant || "—";
  document.querySelector("#confirmation_prenom_etudiant").textContent =
    prenomEtudiant || "—";
  document.querySelector("#confirmation_niveaux").textContent = niveau || "—";
  document.querySelector("#confirmation_nom_pere").textContent = nomPere || "—";
  document.querySelector("#confirmation_email_pere").textContent =
    emailPere || "—";

  const listeCours = document.querySelector("#confirmation_liste_cours");
  if (panier.length === 0) {
    listeCours.innerHTML =
      '<p class="text-[#65716A] italic">Aucun cours sélectionné.</p>';
  } else {
    listeCours.innerHTML = panier
      .map(
        (c) =>
          `<div class="flex items-center justify-between gap-2">
            <span>${c.title} <span class="text-xs text-[#65716A]">(${c.level})</span></span>
            <span class="font-medium text-[#174A3A]">${c.price * SEANCES_PAR_MOIS} DH/mois</span>
          </div>`,
      )
      .join("");
  }

  const total = panier.reduce((sum, c) => sum + c.price * SEANCES_PAR_MOIS, 0);
  document.querySelector("#confirmation_total").textContent = `${total} DH`;

  fermerFormulaire();
  confirmationSection.classList.remove("hidden");
  overlayConfirmation.classList.remove("hidden");
}

export function fermerConfirmation() {
  confirmationSection.classList.add("hidden");
  overlayConfirmation.classList.add("hidden");
}

export function terminerConfirmation() {
  fermerConfirmation();

  const formulaire = document.querySelector("#form_inscription");

  if (formulaire) {
    formulaire.reset();
    reinitialiserValidationFormulaire();
  }

  panier.splice(0, panier.length);
  afficherPanier();
}
