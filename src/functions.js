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

        <a
          href="#"
          class="block text-right text-sm text-[#174A3A] underline"
        >
          Voir les détails
        </a>

        <button
          type="button"
          class="w-full rounded-xl p-2 text-sm font-medium transition ${
            complet
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-[#174A3A] text-white hover:bg-[#10372C]"
          }"
          ${complet ? "disabled" : ""}
        >
          ${complet ? "Complet" : "Ajouter au panier +"}
        </button>
      `;

      card.addEventListener("click", (event) => {
        event.preventDefault();
        afficherDetailsCours(course.id);
      });

      container.append(card);
    });
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
      (filter_niveau.value === "" ||
        cour.levelValue === filter_niveau.value) &&
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
      prixMensuel.textContent = `${cours.price * 4} DH / mois`;

      prix.append(prixSeance, prixMensuel);
      item.append(infos, prix);

      return item;
    }),
  );

  nombreCoursPanier.textContent = panier.length;
  totalPanier.textContent = `${panier.reduce(
    (total, cours) => total + cours.price * 4,
    0,
  )} DH`;
}

export function ajouterAuPanier() {
  if (
    !coursSelectionne ||
    panier.some((cours) => cours.id === coursSelectionne.id)
  ) {
    return;
  }

  panier.push(coursSelectionne);
  afficherPanier();
  fermerDetailsCours();
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

    boutonAjouter.disabled = complet;
    boutonAjouter.className = `w-full rounded-xl px-4 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#174A3A] focus:ring-offset-2 ${
      complet
        ? "cursor-not-allowed bg-gray-200 text-gray-500"
        : "bg-[#174A3A] text-white hover:bg-[#10372C]"
    }`;
    boutonAjouter.innerHTML = complet
      ? "Complet"
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
