# Ma Plateforme Bureautique
## Application web éducative — Pack Office A1→C2

---

## 📁 Structure des fichiers

```
bureautique/
│
├── index.html          ← Page principale (ouvrir dans le navigateur)
├── css/
│   └── style.css       ← Feuille de styles complète
├── js/
│   └── app.js          ← Logique de l'application
└── README.md           ← Ce fichier
```

---

## 🚀 Comment utiliser

1. **Décompressez** le dossier `bureautique` dans un emplacement de votre choix
2. **Ouvrez** le fichier `index.html` dans un navigateur web (Chrome, Firefox, Edge, Safari)
3. **Connectez-vous** :
   - Cliquez sur **"Connexion Stagiaire"** pour accéder à l'espace stagiaire
   - Cliquez sur **"Formateur"** pour accéder au tableau de bord formateur
   - Ou **créez un compte** avec l'onglet "Inscription"

> ⚠️ Aucun serveur web n'est nécessaire. L'application fonctionne directement depuis le navigateur.

---

## 👤 Espaces disponibles

### Espace Stagiaire
- 🏠 **Tableau de bord** — Progression globale, badges, étapes suivantes
- 🗺️ **Mon parcours** — Formation, niveau numérique, métier, niveau français
- 📚 **Modules** — Word, Excel, PowerPoint, Publisher (A1→C2)
- 🧩 **Cas pratiques** — Exercices ultra-guidés avec étapes détaillées
- 💼 **Entraînement métier** — Secrétariat, Accueil, ADVF, Entretien, Vente, Sans Projet
- 📝 **Tests d'entrée** — Préparation aux formations qualifiantes
- 📤 **Envoi de travaux** — Dépôt de fichiers avec historique
- 📊 **Progression & Badges** — Suivi visuel et gamification

### Espace Formateur
- 👥 **Stagiaires** — Liste filtrable, fiches individuelles, impression
- 📝 **Travaux à corriger** — File d'attente avec validation
- 📊 **Statistiques** — Analyse des difficultés, progression par groupe
- 🧱 **Contenus** — Gestion des exercices et cas pratiques

---

## 🔧 Personnalisation

### Ajouter des exercices
Dans `js/app.js`, trouvez la constante `MODULES` et ajoutez vos exercices :
```javascript
{ num: 10, name: 'Nom de l\'exercice', level: 'B2', lvlClass: 'lvl-b2', time: '40 min', status: 'todo' }
```

### Modifier les couleurs
Dans `css/style.css`, modifiez les variables CSS dans `:root` :
```css
--primary: #1a5ec8;    /* Couleur principale */
--accent: #0d9e6e;     /* Couleur d'accent verte */
```

### Ajouter des stagiaires (démo)
Dans `js/app.js`, ajoutez des entrées dans le tableau `stagiaires`.

---

## 📋 Fonctionnalités

| Fonctionnalité | Statut |
|---|---|
| Authentification (connexion/inscription) | ✅ Fonctionnel |
| Tableau de bord stagiaire | ✅ Fonctionnel |
| Configuration du parcours | ✅ Fonctionnel |
| Modules avec exercices filtrables | ✅ Fonctionnel |
| Cas pratiques guidés | ✅ Fonctionnel |
| Entraînement par métier | ✅ Fonctionnel |
| Tests d'entrée | ✅ Fonctionnel |
| Envoi de travaux (drag & drop) | ✅ Fonctionnel |
| Progression & badges | ✅ Fonctionnel |
| Dashboard formateur | ✅ Fonctionnel |
| Tableau des stagiaires filtrable | ✅ Fonctionnel |
| Correction de travaux | ✅ Fonctionnel |
| Statistiques et analyses | ✅ Fonctionnel |
| Gestion de contenus | ✅ Fonctionnel |
| Responsive mobile/tablette | ✅ Fonctionnel |
| Mode hors ligne | ✅ (via localStorage) |
| Impression | ✅ Fonctionnel |
| Notifications toast | ✅ Fonctionnel |

---

## 🌍 Accessibilité & Niveaux

- **A1** : Consignes avec pictogrammes, phrases courtes
- **A2** : Guidage important, vocabulaire simplifié
- **B1** : Autonomie partielle, tâches courantes
- **B2** : Tâches complexes, autonomie avancée
- **C1** : Logique professionnelle complète
- **C2** : Maîtrise totale

---

## ⚠️ Règles pédagogiques intégrées

1. **Images** : Toujours insérer depuis l'ordinateur (pas d'images en ligne)
2. **Enregistrement** : Dossier Documents → NomRéférente_NuméroGroupe_NomExercice
3. **Envoi** : Via la page "Envoyer mes travaux" de la plateforme

---

*Ma Plateforme Bureautique — Créée pour GRETA / Savoirs Essentiels / #AVENIR*
