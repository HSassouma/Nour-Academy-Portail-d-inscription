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
          type="button"
          class="w-full rounded-xl bg-[#174A3A] p-2 text-sm font-medium text-white hover:bg-[#10372C]"
        >
          Ajouter au panier +
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
const detailDuree = document.querySelector("#detail_duree");
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
      const btnSup = document.createElement("button");
      btnSup.type = "button";
      btnSup.className = "shrink-0 text-[#65716A] hover:text-red-600 transition-colors";
      btnSup.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";
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
    detailPrixMensuel.textContent = `${result.price * 4} DH`;

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
// Fonction pour afficher le formulaire
 export function afficherFormulaire() {
  document.querySelector(".contenainer_form").classList.remove("hidden");

  document.querySelector("#overlay_details").classList.remove("hidden");
}

// Fonction pour fermer le formulaire
export function fermerFormulaire() {
  document.querySelector(".contenainer_form").classList.add("hidden");
  document.querySelector("#overlay_details").classList.add("hidden");
}

// validation


export function validerFormulaire() {
  const formulaire = document.querySelector('#form_inscription');

  if (!formulaire) return;

  const nomPere = document.querySelector('#nom_pere');
  const emailPere = document.querySelector('#email_pere');
  const nomEtudiant = document.querySelector('#nom_etudiant');
  const prenomEtudiant = document.querySelector('#prenom_etudiant');
  const niveaux = document.querySelector('#niveaux');
  const motPass = document.querySelector('#mot_pass');
  const confirmeMotPass = document.querySelector('#confirme_motPass');
  const consentement = document.querySelector('#consentement');

  const champs = [nomPere, emailPere, nomEtudiant, prenomEtudiant, niveaux, motPass, confirmeMotPass];

  function verifierChamp(champ) {
    let message = '';

    if (champ === nomPere && champ.value.trim() === '') {
      message = 'Veuillez saisir le nom du responsable.';
    } else if (champ === emailPere) {
      const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValide.test(champ.value.trim())) {
        message = 'Veuillez saisir une adresse e-mail valide.';
      }
    } else if (champ === nomEtudiant && champ.value.trim() === '') {
      message = "Veuillez saisir le prénom de l'élève.";
    } else if (champ === prenomEtudiant && champ.value.trim() === '') {
      message = "Veuillez saisir le nom de famille de l'élève.";
    } else if (champ === niveaux && champ.value === '') {
      message = 'Veuillez choisir un niveau scolaire.';
    } else if (champ === motPass) {
      const motDePasseValide = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!motDePasseValide.test(champ.value)) {
        message = '8 caractères minimum, une majuscule, un chiffre et un caractère spécial.';
      }
    } else if (champ === confirmeMotPass && champ.value !== motPass.value) {
      message = 'Les mots de passe ne correspondent pas.';
    }

    const erreur = document.querySelector(`#erreur_${champ.id}`);
    if (erreur) erreur.textContent = message;

    champ.classList.toggle('border-red-500', message !== '');
    champ.classList.toggle('border-[#269b65]', message === '');

    return message === '';
  }

  champs.forEach((champ) => {
    champ.addEventListener('input', () => {
      verifierChamp(champ);
      if (champ === motPass && confirmeMotPass.value !== '') {
        verifierChamp(confirmeMotPass);
      }
    });
  });

  consentement.addEventListener('change', () => {
    const erreur = document.querySelector('#erreur_consentement');
    erreur.textContent = consentement.checked
      ? ''
      : 'Veuillez accepter le consentement pour continuer.';
  });

  formulaire.addEventListener('submit', (event) => {
    event.preventDefault();

    const erreurCours = document.querySelector('#erreur_cours');
    if (panier.length === 0) {
      erreurCours.textContent = 'Veuillez sélectionner au moins un cours.';
      erreurCours.classList.remove('hidden');
      return;
    }

    erreurCours.textContent = '';
    erreurCours.classList.add('hidden');

    const champsValides = champs.map((champ) => verifierChamp(champ));
    const premierChampInvalide = champs.find((champ, index) => !champsValides[index]);

    const erreurConsentement = document.querySelector('#erreur_consentement');
    if (!consentement.checked) {
      erreurConsentement.textContent = 'Veuillez accepter le consentement pour continuer.';
    } else {
      erreurConsentement.textContent = '';
    }

    if (premierChampInvalide) {
      premierChampInvalide.focus();
      return;
    }

    if (!consentement.checked) {
      consentement.focus();
      return;
    }

    // Tous les champs sont valides — ouvrir la popup de confirmation
    ouvrirConfirmation({
      nomPere: nomPere.value.trim(),
      emailPere: emailPere.value.trim(),
      nomEtudiant: nomEtudiant.value.trim(),
      prenomEtudiant: prenomEtudiant.value.trim(),
      niveau: niveaux.value,
    });
  });
}

// ── Popup de confirmation ────────────────────────────────────────────────────

const confirmationSection = document.querySelector('.contenainer_confirmation');
const overlayConfirmation = document.querySelector('#overlay_confirmation');

function ouvrirConfirmation({ nomPere, emailPere, nomEtudiant, prenomEtudiant, niveau }) {
  document.querySelector('#confirmation_nom_etudiant').textContent = nomEtudiant || '—';
  document.querySelector('#confirmation_prenom_etudiant').textContent = prenomEtudiant || '—';
  document.querySelector('#confirmation_niveaux').textContent = niveau || '—';
  document.querySelector('#confirmation_nom_pere').textContent = nomPere || '—';
  document.querySelector('#confirmation_email_pere').textContent = emailPere || '—';

  const listeCours = document.querySelector('#confirmation_liste_cours');
  if (panier.length === 0) {
    listeCours.innerHTML = '<p class="text-[#65716A] italic">Aucun cours sélectionné.</p>';
  } else {
    listeCours.innerHTML = panier
      .map(
        (c) =>
          `<div class="flex items-center justify-between gap-2">
            <span>${c.title} <span class="text-xs text-[#65716A]">(${c.level})</span></span>
            <span class="font-medium text-[#174A3A]">${c.price * 4} DH/mois</span>
          </div>`
      )
      .join('');
  }

  const total = panier.reduce((sum, c) => sum + c.price * 4, 0);
  document.querySelector('#confirmation_total').textContent = `${total} DH`;

  const erreurEnvoi = document.querySelector('#erreur_envoi');
  erreurEnvoi.textContent = '';
  erreurEnvoi.classList.add('hidden');

  fermerFormulaire();
  confirmationSection.classList.remove('hidden');
  overlayConfirmation.classList.remove('hidden');
}

export function fermerConfirmation() {
  confirmationSection.classList.add('hidden');
  overlayConfirmation.classList.add('hidden');
}

// ── Envoi au serveur ─────────────────────────────────────────────────────────

export async function envoyerInscription() {
  if (panier.length === 0) {
    const erreurEnvoi = document.querySelector('#erreur_envoi');
    erreurEnvoi.textContent = 'Veuillez sélectionner au moins un cours.';
    erreurEnvoi.classList.remove('hidden');
    return;
  }

  const nomPere = document.querySelector('#nom_pere').value.trim();
  const emailPere = document.querySelector('#email_pere').value.trim();
  const nomEtudiant = document.querySelector('#nom_etudiant').value.trim();
  const prenomEtudiant = document.querySelector('#prenom_etudiant').value.trim();
  const niveau = document.querySelector('#niveaux').value;

  const donnees = {
    responsable: { nom: nomPere, email: emailPere },
    eleve: { prenom: nomEtudiant, nom_famille: prenomEtudiant, niveau },
    cours: panier.map((c) => ({ id: c.id })),
  };

  const btnEnvoyer = document.querySelector('#btn_envoyer');
  const erreurEnvoi = document.querySelector('#erreur_envoi');

  btnEnvoyer.disabled = true;
  btnEnvoyer.textContent = 'Envoi en cours…';
  erreurEnvoi.classList.add('hidden');

  try {
    const response = await fetch('http://localhost:3000/api/inscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnees),
    });

    const resultat = await response.json();

    if (!response.ok) {
      throw new Error(resultat.erreur || 'Erreur serveur.');
    }

    fermerConfirmation();
    document.querySelector('#form_inscription').reset();
    panier.splice(0, panier.length);
    afficherPanier();
    alert(`✅ Inscription enregistrée !\nN° dossier : ${resultat.inscription.numero_dossier}`);
  } catch (err) {
    erreurEnvoi.textContent = err.message;
    erreurEnvoi.classList.remove('hidden');
  } finally {
    btnEnvoyer.disabled = false;
    btnEnvoyer.innerHTML = 'Envoyer <span aria-hidden="true">›</span>';
  }
}
