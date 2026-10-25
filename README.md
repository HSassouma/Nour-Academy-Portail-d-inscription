<div align="center">
  <img src="src/assets/logo.png" alt="Logo Nour Academy" width="112" />
  <h1>Nour Academy · Portail d'inscription</h1>
  <p>Un parcours simple pour choisir des cours et vérifier un dossier d'inscription.</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/interface-responsive-147D64" alt="Interface responsive" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF" alt="Vite 8" />
  <img src="https://img.shields.io/badge/tests-Playwright-2EAD33" alt="Tests Playwright" />
</p>

## Le projet

Nour Academy est un portail d'inscription destiné aux familles des centres de Nador. Il permet de parcourir le catalogue, filtrer et rechercher des cours, composer un panier, remplir un formulaire puis consulter le récapitulatif de la demande.

Le parcours fonctionne entièrement dans le navigateur : aucune inscription n'est envoyée à un serveur ni enregistrée dans un fichier. Le bouton **Terminer** ferme le récapitulatif et réinitialise le parcours local.

L'interface est en français et conçue pour rester utilisable sur téléphone comme sur ordinateur.

## Fonctions disponibles

- Affichage du catalogue des cours depuis `src/courses.json`.
- Filtrage par matière et par niveau, et recherche par matière.
- Sélection de cours dans un panier avec calcul du montant mensuel.
- Formulaire d'inscription validé côté navigateur : noms, e-mail, niveau, mot de passe, consentement et sélection d'au moins un cours.
- Popup de confirmation avec récapitulatif de l'élève, du responsable, des cours et du total.
- Aucune donnée envoyée ni stockée sur un serveur pendant le parcours.

## Démarrer en local

Prérequis : Node.js 20.19+ ou 22.12+ et npm.

```bash
npm install
npm run dev
```

Ouvrir l'adresse affichée par Vite (généralement `http://localhost:5173/Nour-Academy-Portail-d-inscription/`).

## Vérifier la compilation

```bash
npm run build
```

Pour prévisualiser le dossier compilé avec Vite :

```bash
npm run preview
```

Le workflow `.github/workflows/deploy.yml` compile le projet et publie `dist` sur GitHub Pages lors d'un push sur `main`.

## Tests

Les tests de bout en bout utilisent Playwright. Ils démarrent automatiquement le serveur de développement Vite.

```bash
npx playwright install chromium
npm test
```

Ils vérifient le catalogue, le panier, les messages de validation, le blocage de la confirmation en cas d'erreur, le récapitulatif et l'absence d'envoi de données.

## Structure

```text
.
├── .github/workflows/deploy.yml # Publication GitHub Pages
├── index.html                   # Interface et popup de confirmation
├── src/
│   ├── courses.json             # Catalogue et prix des cours
│   ├── functions.js             # Affichage, recherche, panier et formulaire
│   ├── main.js                  # Initialisation de l'interface
│   ├── style.css                # Styles
│   └── assets/logo.png          # Logo
├── test/e2e/inscription.spec.js # Tests Playwright
├── playwright.config.js         # Configuration Playwright
└── vite.config.js               # Configuration Vite
```

## Données

Le catalogue est chargé depuis `src/courses.json`. Les informations saisies dans le formulaire restent dans la page et sont perdues à la fermeture ou au rechargement de celle-ci ; elles ne sont transmises à aucun service.
