// chargement des cours, une seule fois
let tousLesCours = null;

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
        <main class="flex items-start gap-3">
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
        </main>

        <p class="line-clamp-2 text-sm text-[#65716A]">
          ${course.description}
        </p>

        <div class="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
          <p class="text-sm text-[#1D2924]">
            <strong class="text-lg text-[#174A3A]">${course.price * 4} DH</strong>
            <span class="text-xs text-[#65716A]">/ mois</span>
          </p>
          <p class="text-xs text-[#65716A]">${course.price} DH / séance</p>
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

      card
        .querySelector(".btn-details")
        .addEventListener("click", () => afficherDetailsCours(course.id));

      card.querySelector(".btn-ajouter").addEventListener("click", () => {
        ajouterCoursAuPanier(course);
      });

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
              ${cours.price * 4} DH
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
  totalPanier.textContent = `${panier.reduce(
    (total, cours) => total + cours.price * 4,
    0,
  )} DH`;

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
    detailPrix.textContent = `${result.price} DH`;
    detailPrixMensuel.textContent = `${result.price * 4} DH`;

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
