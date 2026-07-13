# 🛠️ Guide de maintenance — Ma Plateforme Bureautique

Document de référence pour assurer le bon fonctionnement du site dans la durée.
À conserver dans le dépôt GitHub, à jour.

---

## 1. 🔐 Sécurité — ce qui a été corrigé

| Point | Avant | Maintenant |
|---|---|---|
| Mots de passe | Stockés en clair ou en base64 (lisible) | Hachés (SHA-256 + sel), illisibles même en cas de fuite |
| Suppression stagiaire | Effacement local seulement | Purge locale **et** cloud (conforme RGPD) |
| Accès base de données | Ouvert à quiconque a la clé publique | Protégé par Row Level Security (voir `supabase_rls_setup.sql`) |
| Sauvegarde | Aucune | Export manuel en un clic (voir section 3) |

### Action à faire une seule fois : activer les RLS Supabase

1. Connectez-vous sur [supabase.com](https://supabase.com) → votre projet
2. Menu gauche → **SQL Editor** → **New query**
3. Ouvrez le fichier `supabase_rls_setup.sql` fourni, copiez tout le contenu
4. Collez-le dans l'éditeur → cliquez **Run**
5. Vérifiez que la dernière requête du script affiche `rowsecurity = true` pour les 3 tables

⚠️ Si vous ne faites jamais cette étape, votre base de données reste accessible directement par n'importe qui connaissant votre clé API (visible dans le code source de votre site).

---

## 2. 🌿 Environnement de test — éviter de casser le site en direct

Actuellement, chaque modification uploadée sur GitHub part **immédiatement** en production. Une erreur de copier-coller peut rendre le site inaccessible pour tous vos stagiaires.

### Mise en place (10 minutes, à faire une fois)

**Étape 1 — Créer une branche de test sur GitHub**
1. Sur votre dépôt → cliquez sur le menu déroulant `main` (en haut à gauche de la liste de fichiers)
2. Tapez un nouveau nom : `test`
3. Cliquez sur **Create branch: test**

**Étape 2 — Créer un second site Netlify pointant sur cette branche**
1. Sur Netlify → **Add new site** → **Import an existing project**
2. Choisissez votre dépôt GitHub `Office`
3. Dans "Branch to deploy", sélectionnez `test` (pas `main`)
4. Déployez — vous obtenez une URL du type `nom-aleatoire.netlify.app`

**Étape 3 — Utilisation au quotidien**
- Pour tester une modification : uploadez-la d'abord sur la branche `test` sur GitHub
- Vérifiez sur l'URL de test que tout fonctionne
- Si c'est bon : refaites le même changement sur la branche `main` (production)

Cela double le travail d'upload, mais élimine le risque de casser le site pour vos stagiaires en pleine session de formation.

---

## 3. 💾 Sauvegardes — fréquence recommandée

Un bouton **"⬇️ Exporter une sauvegarde"** a été ajouté dans l'espace formateur → onglet **Statistiques**.

**Fréquence recommandée : une fois par mois**, ou avant toute modification importante du site.

Le fichier téléchargé (`MPB_sauvegarde_AAAA-MM-JJ.json`) contient :
- Tous les comptes stagiaires
- Tous les travaux et corrections
- Tous les messages
- Tous les contenus personnalisés (exercices, quiz, métiers)

**Où le conserver ?** Google Drive, clé USB, ou dossier partagé de votre organisme — pas uniquement sur l'ordinateur qui a fait l'export.

---

## 4. 📊 Suivi des quotas gratuits

Netlify et Supabase ont des limites gratuites. Si vous les dépassez, le site peut ralentir ou se bloquer temporairement.

### À vérifier tous les 2-3 mois

**Netlify** (dashboard.netlify.com → votre site → onglet Usage)
- Bande passante : limite 100 Go/mois (gratuit) — normalement large pour un usage formation
- Minutes de build : limite 300 min/mois

**Supabase** (supabase.com → votre projet → Settings → Usage)
- Base de données : limite 500 Mo (gratuit)
- Stockage fichiers : limite 1 Go (gratuit) — **à surveiller si beaucoup de travaux/corrections avec pièces jointes**
- Requêtes API : limite généreuse, rarement atteinte pour ce type d'usage

Si vous approchez une limite, Supabase et Netlify vous préviennent par e-mail. Passez au plan payant (quelques euros/mois) seulement si nécessaire.

---

## 5. 📋 RGPD — ce que vous devez savoir

Votre plateforme stocke des données personnelles (noms, e-mails, parfois documents de stagiaires). Quelques principes simples à respecter :

- **Informer les stagiaires** : à l'inscription, une phrase du type *"Vos données sont utilisées uniquement dans le cadre de votre formation et ne sont jamais partagées"* suffit dans la plupart des cas. Vérifiez avec votre organisme (RÉCIFE/GRETA) s'il existe déjà une mention légale à utiliser.
- **Droit à l'effacement** : c'est maintenant automatique via le bouton 🗑️ dans l'espace formateur (purge locale + cloud).
- **Durée de conservation** : envisagez d'archiver ou supprimer les comptes des stagiaires plus de 2-3 ans après la fin de leur formation, sauf obligation légale contraire de votre organisme.
- **Ne stockez jamais** de données sensibles inutiles (santé, origine, opinions...) dans les champs libres (messages, commentaires).

---

## 6. 🧩 Architecture technique — pour qui reprend le site plus tard

Le site est actuellement **un seul fichier `index.html`** de ~4600 lignes contenant :
- Le HTML (structure des pages)
- Le CSS (dans la balise `<style>`)
- Le JavaScript (dans la balise `<script>`, toute la logique)

**Fichiers annexes :**
- `welcome_modal.js` — écran d'accueil avec lien vers les tutoriels
- `supabase_rls_setup.sql` — script de sécurité (à exécuter une fois)
- `guides/` — tutoriels PDF et HTML pour formateurs/stagiaires

**Stockage des données :**
- En local dans le navigateur (`localStorage`) — clé principale : voir liste dans le code (`mpb_users`, `mpb_prog`, `mpb_travaux`...)
- En cloud sur Supabase (synchronisation entre appareils) — tables `mpb_users`, `mpb_progress`, `mpb_travaux`

**Pourquoi ce n'est pas séparé en plusieurs fichiers ?**
Techniquement plus propre de séparer HTML/CSS/JS en fichiers distincts, mais cela demande une réorganisation complète à risque de casse. Ce n'est pas nécessaire tant que le site reste maintenable par une seule personne avec l'aide de GitHub. À envisager uniquement si une équipe de plusieurs développeurs reprend le projet.

---

## 7. 🐛 Corriger un bug simple — méthode

1. Ouvrez `github.com/RECIFE-Projets/Office`
2. Cliquez sur `index.html` → icône crayon ✏️ (modifier)
3. **Ctrl+F** dans l'éditeur pour chercher le texte concerné
4. Faites la modification
5. Bas de page → message de commit clair (ex: "Fix bouton export") → **Commit changes**
6. Attendez 30-60 secondes → Netlify redéploie automatiquement
7. Testez en navigation privée (Ctrl+Maj+N) sur `office2019.netlify.app`

**Toujours tester en navigation privée** après une modification — un onglet normal peut afficher une version mise en cache qui masque le vrai résultat.

---

## 8. 📝 Changelog — historique des évolutions majeures

| Date | Modification |
|---|---|
| 2026-07 | Modal de bienvenue + tutoriels multilingues |
| 2026-07 | Correction bug redirection formateur |
| 2026-07 | Correction rafraîchissement dashboard formateur |
| 2026-07 | Bouton déconnexion rendu visible |
| 2026-07 | Synchronisation stagiaires multi-appareils |
| 2026-07 | Fusion des correctifs dans index.html |
| 2026-07 | Sécurisation mots de passe (hachage), RGPD, sauvegardes, RLS Supabase |

*Ajoutez une ligne à ce tableau à chaque modification importante, directement dans ce fichier sur GitHub.*

---

## ✅ Checklist récapitulative

- [ ] Exécuter `supabase_rls_setup.sql` dans Supabase (une seule fois)
- [ ] Créer la branche `test` + site Netlify de test (une seule fois)
- [ ] Faire un premier export de sauvegarde dès maintenant
- [ ] Ajouter un rappel mensuel pour la prochaine sauvegarde
- [ ] Vérifier les quotas Netlify/Supabase dans 2-3 mois
- [ ] Ajouter une mention RGPD sur la page d'inscription si votre organisme n'en a pas déjà une
