import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "inscription.json");
const COURSES_FILE = path.join(__dirname, "src", "courses.json");
const PORT = process.env.PORT || 3000;

// Lire les inscriptions existantes
function lireInscriptions() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Écrire les inscriptions
function ecrireInscriptions(inscriptions) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(inscriptions, null, 2), "utf-8");
}

// Générer un numéro de dossier
function genererNumeroDossier(inscriptions) {
  const annee = new Date().getFullYear();
  const dernier = inscriptions.length > 0
    ? Math.max(...inscriptions.map((i) => i.id || 0))
    : 0;
  const prochain = dernier + 1;
  const numero = `NA-${annee}-${String(prochain).padStart(3, "0")}`;
  return { id: prochain, numeroDossier: numero };
}

// Vérifier si une inscription en double existe (prénom + nom de famille, insensible à la casse)
function inscriptionDoublonExiste(inscriptions, prenom, nomFamille) {
  const prenomN = prenom.trim().toLowerCase();
  const nomN = nomFamille.trim().toLowerCase();
  return inscriptions.some((i) => {
    const iPrenomN = (i.eleve?.prenom || "").trim().toLowerCase();
    const iNomN = (i.eleve?.nom_famille || "").trim().toLowerCase();
    return iPrenomN === prenomN && iNomN === nomN;
  });
}

function lireCours() {
  return JSON.parse(fs.readFileSync(COURSES_FILE, "utf-8"));
}

// Lire le body d'une requête POST
function lireBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("JSON invalide"));
      }
    });
  });
}

// Envoyer une réponse JSON
function repondre(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // GET /api/inscriptions — retourne toutes les inscriptions
  if (req.method === "GET" && url.pathname === "/api/inscriptions") {
    const inscriptions = lireInscriptions();
    return repondre(res, 200, inscriptions);
  }

  // GET /api/inscriptions/next-id — prochain ID et numéro de dossier
  if (req.method === "GET" && url.pathname === "/api/inscriptions/next-id") {
    const inscriptions = lireInscriptions();
    const info = genererNumeroDossier(inscriptions);
    return repondre(res, 200, info);
  }

  // POST /api/inscriptions — ajouter une inscription
  if (req.method === "POST" && url.pathname === "/api/inscriptions") {
    try {
      const donnees = await lireBody(req);

      // Validation minimale
      if (!donnees.responsable || !donnees.eleve) {
        return repondre(res, 400, { erreur: "Données incomplètes." });
      }

      const prenom = typeof donnees.eleve.prenom === "string"
        ? donnees.eleve.prenom.trim()
        : "";
      const nomFamille = typeof donnees.eleve.nom_famille === "string"
        ? donnees.eleve.nom_famille.trim()
        : "";

      if (!prenom || !nomFamille) {
        return repondre(res, 400, { erreur: "Le prénom et le nom de famille de l'élève sont obligatoires." });
      }

      // ── Vérification des doublons AVANT l'écriture ──────────────────────
      const inscriptions = lireInscriptions();

      if (inscriptionDoublonExiste(inscriptions, prenom, nomFamille)) {
        return repondre(res, 409, {
          erreur: "Une inscription existe déjà pour cet étudiant.",
        });
      }
      // ────────────────────────────────────────────────────────────────────

      if (!Array.isArray(donnees.cours) || donnees.cours.length === 0) {
        return repondre(res, 400, {
          erreur: "Veuillez sélectionner au moins un cours.",
        });
      }

      const coursDisponibles = lireCours();
      const coursSelectionnes = donnees.cours.map((selection) => {
        const id = Number(selection?.id);
        return coursDisponibles.find((cours) => cours.id === id);
      });

      if (coursSelectionnes.some((cours) => !cours)) {
        return repondre(res, 400, {
          erreur: "Un ou plusieurs cours sélectionnés sont introuvables.",
        });
      }

      const coursEnregistres = coursSelectionnes.map((cours) => ({
        id: cours.id,
        titre: cours.title,
        prix_mensuel: cours.price * 4,
      }));
      const totalMensuel = coursEnregistres.reduce(
        (total, cours) => total + cours.prix_mensuel,
        0,
      );

      const { id, numeroDossier } = genererNumeroDossier(inscriptions);

      const inscription = {
        id,
        numero_dossier: numeroDossier,
        responsable: {
          nom: donnees.responsable.nom || "",
          email: donnees.responsable.email || "",
        },
        eleve: {
          prenom,
          nom_famille: nomFamille,
          niveau: donnees.eleve.niveau || "",
        },
        cours: coursEnregistres,
        total_mensuel: totalMensuel,
        date_inscription: new Date().toISOString(),
      };

      inscriptions.push(inscription);
      ecrireInscriptions(inscriptions);

      return repondre(res, 201, {
        message: "Inscription enregistrée avec succès.",
        inscription,
      });
    } catch (err) {
      return repondre(res, 400, {
        erreur: "Erreur lors de l'enregistrement : " + err.message,
      });
    }
  }

  // Route inconnue
  repondre(res, 404, { erreur: "Route non trouvée." });
});

server.listen(PORT, () => {
  console.log(`Serveur API démarré sur http://localhost:${PORT}`);
});
