# 🔥 Guide d'installation Firebase — Ma Plateforme Bureautique

Ce guide remplace Supabase par Firebase (Google), un service gratuit que **vous seul contrôlez**.
Durée estimée : 15-20 minutes, à faire une seule fois.

---

## Étape 1 — Créer votre projet Firebase

1. Allez sur **[console.firebase.google.com](https://console.firebase.google.com)**
2. Connectez-vous avec un compte Google (créez-en un dédié à l'association si besoin)
3. Cliquez **Ajouter un projet**
4. Nommez-le par exemple `mpb-recife` → **Continuer**
5. Désactivez Google Analytics (pas nécessaire) → **Créer le projet**
6. Patientez ~30 secondes → **Continuer**

---

## Étape 2 — Activer Firestore (la base de données)

1. Dans le menu de gauche → **Build** → **Firestore Database**
2. Cliquez **Créer une base de données**
3. Choisissez **Démarrer en mode production** → **Suivant**
4. Emplacement : choisissez **eur3 (Europe)** → **Activer**

---

## Étape 3 — Activer Storage (pour les fichiers de travaux)

1. Menu de gauche → **Build** → **Storage**
2. Cliquez **Commencer**
3. Mode production → **Suivant** → même emplacement Europe → **Terminé**

---

## Étape 4 — Créer l'application Web et récupérer vos clés

1. Sur la page d'accueil du projet, cliquez sur l'icône **`</>`** (Web)
2. Nommez l'application `MPB Site` → **Enregistrer l'application** (ne cochez pas Hosting)
3. Une fenêtre affiche un bloc de code avec `const firebaseConfig = { ... }`
4. **Copiez ces valeurs**, vous en aurez besoin à l'étape suivante :
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
5. Cliquez **Continuer vers la console**

---

## Étape 5 — Configurer le site avec vos clés

1. Ouvrez le fichier **`firebase_config.js`** (fourni)
2. Remplacez chaque valeur `"YOUR_..."` par celle copiée à l'étape 4 :

```js
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "mpb-recife.firebaseapp.com",
  projectId: "mpb-recife",
  storageBucket: "mpb-recife.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234efgh5678"
};
```

3. Enregistrez le fichier

---

## Étape 6 — Appliquer les règles de sécurité

1. Ouvrez le fichier **`firestore_rules.txt`** (fourni)
2. **Partie Firestore** (le premier bloc) :
   - Firebase Console → **Firestore Database** → onglet **Règles**
   - Effacez le contenu existant, collez le premier bloc de règles
   - Cliquez **Publier**
3. **Partie Storage** (le bloc en commentaire `/* ... */`) :
   - Firebase Console → **Storage** → onglet **Règles**
   - Retirez les `/*` et `*/` autour du bloc Storage, collez-le
   - Cliquez **Publier**

---

## Étape 7 — Uploader sur GitHub

Uploadez ces **3 fichiers** à la racine de votre dépôt (à côté de `index.html`) :
- `firebase_config.js` (avec vos clés remplies)
- `index.html` (déjà mis à jour pour utiliser Firebase)

Puis **Commit changes**.

⚠️ **Important :** ne partagez jamais publiquement le contenu de `firebase_config.js` avec vos clés remplies en dehors de votre dépôt GitHub — même si ces clés sont conçues pour être publiques (contrairement à un mot de passe), il vaut mieux limiter leur diffusion.

---

## Étape 8 — Tester

1. Attendez le redéploiement Netlify (~1 minute)
2. Ouvrez le site en navigation privée
3. Inscrivez un compte stagiaire de test
4. Allez sur Firebase Console → **Firestore Database** → collection `mpb_users`
5. Vous devriez voir apparaître le nouveau compte : la synchronisation fonctionne ✅

---

## En cas de problème

- **Le site ne montre pas "Firebase actif"** dans l'onglet Statistiques → vérifiez que `firebase_config.js` est bien uploadé et que les clés sont correctement copiées (pas d'espace ou de guillemet manquant)
- **Erreur "permission-denied"** dans la console du navigateur (F12) → vérifiez que les règles de sécurité (étape 6) ont bien été publiées
- **Rien ne se passe du tout** → vérifiez que les 3 balises `<script>` Firebase sont bien présentes en haut de `index.html` (elles y sont déjà si vous utilisez le fichier fourni)

---

## Limites gratuites Firebase (largement suffisantes pour votre usage)

| Ressource | Limite gratuite |
|---|---|
| Firestore — lectures | 50 000/jour |
| Firestore — écritures | 20 000/jour |
| Firestore — stockage | 1 Go |
| Storage — fichiers | 5 Go |
| Storage — téléchargements | 1 Go/jour |

Pour un centre de formation avec quelques dizaines de stagiaires, vous êtes très loin de ces limites.
