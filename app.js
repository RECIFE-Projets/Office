/* ============================================
   MA PLATEFORME BUREAUTIQUE — Application JS
   ============================================ */

'use strict';

// ============ STATE ============
const App = {
  currentUser: null,
  currentPage: 'dashboard',
  currentRole: 'stagiaire', // 'stagiaire' | 'formateur'

  users: JSON.parse(localStorage.getItem('mpb_users') || '[]'),

  // Demo stagiaire data
  stagiaire: {
    prenom: 'Jean',
    nom: 'Dupont',
    initials: 'JD',
    formation: 'savoirs',
    niveauNum: 'intermediaire',
    metiers: ['secretariat'],
    niveauFr: 'B1',
    progression: { word: 65, excel: 30, ppt: 20, pub: 5 },
    badges: ['premiere_connexion', 'word_a1', 'premier_doc'],
    exercices: 12,
    tempsTotal: '2h30',
    groupe: 'Groupe 3'
  },

  // Demo formateur data
  stagiaires: [
    { id:1, prenom:'Jean', nom:'Dupont', initials:'JD', formation:'Sav. Ess.', formTag:'tag-blue', niveau:'B1', lvlClass:'lvl-b1', metier:'Secrétariat', prog:47, accès:'22/04/2026', groupe:'Groupe 3' },
    { id:2, prenom:'Amara', nom:'Diallo', initials:'AD', formation:'#AVENIR', formTag:'tag-purple', niveau:'A2', lvlClass:'lvl-a2', metier:'Accueil', prog:22, accès:'21/04/2026', groupe:'Groupe 2' },
    { id:3, prenom:'Sophie', nom:'Martin', initials:'SM', formation:'Sav. Ess.', formTag:'tag-blue', niveau:'B2', lvlClass:'lvl-b2', metier:'ADVF', prog:78, accès:'23/04/2026', groupe:'Groupe 1' },
    { id:4, prenom:'Fatou', nom:'Koné', initials:'FK', formation:'#AVENIR', formTag:'tag-purple', niveau:'A1', lvlClass:'lvl-a1', metier:'Sans Projet', prog:12, accès:'20/04/2026', groupe:'Groupe 1' },
    { id:5, prenom:'Karim', nom:'Ouellet', initials:'KO', formation:'Sav. Ess.', formTag:'tag-blue', niveau:'B2', lvlClass:'lvl-b2', metier:'Vente', prog:85, accès:'23/04/2026', groupe:'Groupe 2' },
    { id:6, prenom:'Léa', nom:'Renard', initials:'LR', formation:'#AVENIR', formTag:'tag-purple', niveau:'B1', lvlClass:'lvl-b1', metier:'Accueil', prog:55, accès:'22/04/2026', groupe:'Groupe 3' },
  ],

  travaux: [
    { stagiaire:'Jean Dupont', fichier:'Dupont_G3_Tableau1.xlsx', module:'Excel', tagClass:'tag-green', date:'18/04/2026', statut:'en_attente' },
    { stagiaire:'Amara Diallo', fichier:'Diallo_G2_Lettre.docx', module:'Word', tagClass:'tag-blue', date:'17/04/2026', statut:'en_attente' },
    { stagiaire:'Fatou Koné', fichier:'Kone_G1_DocA1.docx', module:'Word', tagClass:'tag-blue', date:'15/04/2026', statut:'en_attente' },
    { stagiaire:'Léa Renard', fichier:'Renard_G3_PPT_Metier.pptx', module:'PowerPoint', tagClass:'tag-orange', date:'14/04/2026', statut:'en_attente' },
  ]
};

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initDragDrop();
  // Check saved session
  const saved = sessionStorage.getItem('mpb_session');
  if (saved) {
    const data = JSON.parse(saved);
    loginDirect(data.role, data.user);
  }
});

// ============ AUTH ============
function initAuth() {
  // Auth tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.auth-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.panel === target);
      });
    });
  });

  // Role card selection
  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => {
      card.closest('.role-grid').querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Password toggle
  document.querySelectorAll('.input-icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = btn.previousElementSibling;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.textContent = inp.type === 'password' ? '👁' : '🙈';
    });
  });

  // Login buttons
  document.getElementById('btnLoginStagiaire').addEventListener('click', () => loginAs('stagiaire'));
  document.getElementById('btnLoginFormateur').addEventListener('click', () => loginAs('formateur'));
  document.getElementById('btnRegister').addEventListener('click', registerUser);
}

function loginAs(role) {
  loginDirect(role);
}

function loginDirect(role, userData = null) {
  App.currentRole = role;
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');

  if (role === 'formateur') {
    setupFormateurUI();
  } else {
    setupStagiaireUI();
  }

  sessionStorage.setItem('mpb_session', JSON.stringify({ role }));
  showPage('dashboard');
  toast('✅ Connexion réussie ! Bienvenue sur Ma Plateforme Bureautique.', 3000);
}

function registerUser() {
  const prenom = document.getElementById('regPrenom').value.trim();
  const nom = document.getElementById('regNom').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const mdp = document.getElementById('regMdp').value;
  const role = document.querySelector('#registerPanel .role-card.selected')?.dataset.role || 'stagiaire';

  if (!prenom || !nom || !email || !mdp) {
    toast('⚠️ Veuillez remplir tous les champs obligatoires.', 3000);
    return;
  }
  if (mdp.length < 6) {
    toast('⚠️ Le mot de passe doit contenir au moins 6 caractères.', 3000);
    return;
  }

  const user = { prenom, nom, email, mdp, role, createdAt: Date.now() };
  App.users.push(user);
  localStorage.setItem('mpb_users', JSON.stringify(App.users));
  toast('✅ Compte créé ! Notez bien vos identifiants.', 3000);
  setTimeout(() => loginDirect(role), 1500);
}

function logout() {
  sessionStorage.removeItem('mpb_session');
  document.getElementById('mainApp').classList.add('hidden');
  document.getElementById('authScreen').classList.remove('hidden');
}

// ============ UI SETUP ============
function setupStagiaireUI() {
  const s = App.stagiaire;
  setEl('userInitials', s.initials);
  setEl('userName', s.prenom + ' ' + s.nom);
  setEl('userLevelBadge', s.niveauFr);
  setEl('dashPrenom', s.prenom);

  // Show/hide nav sections
  document.getElementById('navSectionFormateur').classList.add('hidden');
  document.getElementById('navSectionStagiaire').classList.remove('hidden');

  // Update progression bars
  updateProgressBars();
  renderBadges();
  renderSteps();
}

function setupFormateurUI() {
  setEl('userInitials', 'FO');
  setEl('userName', 'Formatrice');
  setEl('userLevelBadge', '');
  document.getElementById('userLevelBadge').classList.add('hidden');

  document.getElementById('navSectionFormateur').classList.remove('hidden');
  document.getElementById('navSectionStagiaire').classList.add('hidden');

  renderStagiairesTable();
  renderTravauxTable();
  showPage('formateur');
}

// ============ PAGE NAVIGATION ============
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  if (navLink) navLink.classList.add('active');

  App.currentPage = pageId;

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');

  // Scroll top
  document.querySelector('.main-content').scrollTop = 0;

  // Page-specific init
  if (pageId === 'modules') renderModulesList();
  if (pageId === 'formateur') { renderStagiairesTable(); renderTravauxTable(); }
}

// Init nav links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', () => showPage(link.dataset.page));
  });
});

// Mobile toggle
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ============ DASHBOARD ============
function updateProgressBars() {
  const s = App.stagiaire;
  setProgress('pb-word', s.progression.word);
  setProgress('pb-excel', s.progression.excel);
  setProgress('pb-ppt', s.progression.ppt);
  setProgress('pb-pub', s.progression.pub);
  setProgress('pb-global', Math.round((s.progression.word + s.progression.excel + s.progression.ppt + s.progression.pub) / 4));
}

function setProgress(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = pct + '%';
  const lbl = document.getElementById(id + '-lbl');
  if (lbl) lbl.textContent = pct + '%';
}

function renderBadges() {
  const s = App.stagiaire;
  const allBadges = [
    { id:'premiere_connexion', icon:'🌟', name:'1ère connexion' },
    { id:'word_a1', icon:'📄', name:'Word A1' },
    { id:'premier_doc', icon:'✏️', name:'Premier doc' },
    { id:'word_a2', icon:'📝', name:'Word A2' },
    { id:'excel_a1', icon:'📊', name:'Excel A1' },
    { id:'ppt_a1', icon:'📽️', name:'PPT A1' },
    { id:'metier', icon:'💼', name:'Métier' },
    { id:'pack_complet', icon:'🏆', name:'Pack complet' },
  ];

  const containers = document.querySelectorAll('.badges-render');
  containers.forEach(container => {
    const limit = parseInt(container.dataset.limit) || allBadges.length;
    container.innerHTML = allBadges.slice(0, limit).map(b => `
      <div class="badge-card ${s.badges.includes(b.id) ? 'earned' : ''}">
        <div class="badge-emoji">${s.badges.includes(b.id) ? b.icon : '🔒'}</div>
        <div class="badge-card-name">${b.name}</div>
      </div>
    `).join('');
  });
}

function renderSteps() {
  const container = document.getElementById('steps-render');
  if (!container) return;
  const steps = [
    { num:1, done:false, title:'Terminer Word A2 — Mise en forme avancée', desc:'Il vous reste 3 exercices pour valider ce niveau', action: "showPage('modules')", btnLabel:'Continuer' },
    { num:2, done:false, title:'Commencer Excel A1 — Découverte du tableur', desc:'Débloquez le module Excel pour votre parcours Secrétariat', action: null },
    { num:3, done:false, title:'Envoyer vos travaux Word', desc:'Nommez le fichier : <strong>Martin_G3_MotDeClé</strong>', action: "showPage('envoi')", btnLabel:'Envoyer' },
  ];
  container.innerHTML = steps.map(s => `
    <div class="step-item">
      <div class="step-circle ${s.done ? 'done' : ''}">${s.done ? '✓' : s.num}</div>
      <div class="step-content">
        <div class="step-title">${s.title}</div>
        <div class="step-desc">${s.desc}</div>
      </div>
      ${s.action ? `<button class="btn btn-primary btn-sm" onclick="${s.action}">${s.btnLabel}</button>` : ''}
    </div>
  `).join('');
}

// ============ MODULES ============
const MODULES = {
  word: {
    icon:'📄', name:'Word 2019', color:'word',
    desc:'Traitement de texte : créer, mettre en forme et imprimer des documents professionnels.',
    exercises: [
      { num:1, name:'Créer et enregistrer un document', level:'A1', lvlClass:'lvl-a1', time:'15 min', status:'done' },
      { num:2, name:'Saisir et corriger un texte simple', level:'A1', lvlClass:'lvl-a1', time:'20 min', status:'done' },
      { num:3, name:'Mettre en forme : gras, italique, soulignement', level:'A2', lvlClass:'lvl-a2', time:'25 min', status:'current' },
      { num:4, name:'Insérer une image depuis l\'ordinateur', level:'A2', lvlClass:'lvl-a2', time:'30 min', status:'todo' },
      { num:5, name:'Créer un tableau simple', level:'B1', lvlClass:'lvl-b1', time:'35 min', status:'todo' },
      { num:6, name:'Mise en page et marges', level:'B1', lvlClass:'lvl-b1', time:'30 min', status:'todo' },
      { num:7, name:'En-tête, pied de page et numérotation', level:'B1', lvlClass:'lvl-b1', time:'30 min', status:'todo' },
      { num:8, name:'Styles et table des matières', level:'B2', lvlClass:'lvl-b2', time:'40 min', status:'todo' },
      { num:9, name:'Publipostage de base', level:'C1', lvlClass:'lvl-c1', time:'50 min', status:'todo' },
    ]
  },
  excel: {
    icon:'📊', name:'Excel 2019', color:'excel',
    desc:'Tableur : saisir des données, créer des tableaux et effectuer des calculs simples.',
    exercises: [
      { num:1, name:'Découverte de l\'interface Excel', level:'A1', lvlClass:'lvl-a1', time:'15 min', status:'done' },
      { num:2, name:'Saisir des données dans un tableau', level:'A1', lvlClass:'lvl-a1', time:'20 min', status:'current' },
      { num:3, name:'Formules simples : somme, moyenne', level:'A2', lvlClass:'lvl-a2', time:'25 min', status:'todo' },
      { num:4, name:'Mise en forme des cellules', level:'A2', lvlClass:'lvl-a2', time:'25 min', status:'todo' },
      { num:5, name:'Créer un graphique simple', level:'B1', lvlClass:'lvl-b1', time:'35 min', status:'todo' },
      { num:6, name:'Filtres et tris', level:'B1', lvlClass:'lvl-b1', time:'30 min', status:'todo' },
      { num:7, name:'Formules avancées : SI, NB.SI', level:'B2', lvlClass:'lvl-b2', time:'45 min', status:'todo' },
    ]
  },
  ppt: {
    icon:'📽️', name:'PowerPoint 2019', color:'ppt',
    desc:'Présentation : créer des diaporamas clairs, visuels et professionnels.',
    exercises: [
      { num:1, name:'Créer une nouvelle présentation', level:'A1', lvlClass:'lvl-a1', time:'15 min', status:'done' },
      { num:2, name:'Ajouter et modifier des diapositives', level:'A1', lvlClass:'lvl-a1', time:'20 min', status:'todo' },
      { num:3, name:'Insérer du texte et des images', level:'A2', lvlClass:'lvl-a2', time:'25 min', status:'todo' },
      { num:4, name:'Thèmes et mise en forme', level:'A2', lvlClass:'lvl-a2', time:'30 min', status:'todo' },
      { num:5, name:'Transitions et animations simples', level:'B1', lvlClass:'lvl-b1', time:'35 min', status:'todo' },
      { num:6, name:'Diaporama et mode présentateur', level:'B1', lvlClass:'lvl-b1', time:'30 min', status:'todo' },
    ]
  },
  pub: {
    icon:'🖨️', name:'Publisher 2019', color:'pub',
    desc:'PAO : créer des flyers, affiches, brochures et documents illustrés.',
    exercises: [
      { num:1, name:'Découverte de Publisher', level:'A1', lvlClass:'lvl-a1', time:'15 min', status:'done' },
      { num:2, name:'Créer un flyer simple', level:'A2', lvlClass:'lvl-a2', time:'25 min', status:'todo' },
      { num:3, name:'Insérer des images et formes', level:'A2', lvlClass:'lvl-a2', time:'30 min', status:'todo' },
      { num:4, name:'Mise en page d\'une affiche', level:'B1', lvlClass:'lvl-b1', time:'40 min', status:'todo' },
      { num:5, name:'Créer une brochure pliée', level:'B2', lvlClass:'lvl-b2', time:'50 min', status:'todo' },
    ]
  }
};

let activeModule = null;
let filterLevel = 'all';

function renderModulesList() {
  const container = document.getElementById('modulesList');
  if (!container) return;
  const s = App.stagiaire;
  const progMap = { word: s.progression.word, excel: s.progression.excel, ppt: s.progression.ppt, pub: s.progression.pub };

  container.innerHTML = Object.entries(MODULES).map(([key, mod]) => `
    <div class="module-card" onclick="openModule('${key}')">
      <div class="module-card-top top-${mod.color}"></div>
      <div class="module-card-body">
        <span class="module-card-icon">${mod.icon}</span>
        <div class="module-card-name">${mod.name}</div>
        <div class="module-card-desc">${mod.desc}</div>
        <div class="progress-bar" style="margin-bottom:8px;"><div class="progress-fill fill-${mod.color}" style="width:${progMap[key]}%"></div></div>
        <div class="flex-between" style="font-size:12px;color:var(--text3);">
          <span>${progMap[key]}% complété</span>
          <span class="lvl ${getLevelClass(progMap[key])}">${getLevelFromProg(progMap[key])}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function getLevelFromProg(p) {
  if (p < 20) return 'A1'; if (p < 40) return 'A2'; if (p < 60) return 'B1'; if (p < 80) return 'B2'; return 'C1';
}
function getLevelClass(p) {
  if (p < 20) return 'lvl-a1'; if (p < 40) return 'lvl-a2'; if (p < 60) return 'lvl-b1'; if (p < 80) return 'lvl-b2'; return 'lvl-c1';
}

function openModule(key) {
  activeModule = key;
  filterLevel = 'all';
  const mod = MODULES[key];
  document.getElementById('moduleDetailTitle').textContent = mod.icon + ' ' + mod.name + ' — Exercices';
  renderExercises();
  document.getElementById('moduleDetail').classList.remove('hidden');
  document.getElementById('moduleDetail').scrollIntoView({ behavior: 'smooth' });
}

function closeModule() {
  document.getElementById('moduleDetail').classList.add('hidden');
}

function filterExercises(level) {
  filterLevel = level;
  document.querySelectorAll('#exFilterTabs .tab-btn').forEach(t => t.classList.remove('active'));
  document.querySelector(`#exFilterTabs [data-level="${level}"]`).classList.add('active');
  renderExercises();
}

function renderExercises() {
  if (!activeModule) return;
  const mod = MODULES[activeModule];
  const list = document.getElementById('exercisesList');
  const exs = filterLevel === 'all' ? mod.exercises : mod.exercises.filter(e => e.level.toLowerCase() === filterLevel);

  list.innerHTML = exs.map(ex => {
    const statusTag = ex.status === 'done'
      ? '<span class="tag tag-green">✓ Terminé</span>'
      : ex.status === 'current'
      ? '<span class="tag tag-blue">▶ En cours</span>'
      : '<span class="tag tag-gray">🔒 À faire</span>';
    return `
      <div class="exercise-item ${ex.status === 'done' ? 'done' : ''}" onclick="openExercise('${activeModule}', ${ex.num})">
        <div class="exercise-num">${ex.num}.</div>
        <div class="exercise-body">
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-meta">
            <span class="lvl ${ex.lvlClass}">${ex.level}</span>
            ${statusTag}
            <span class="exercise-time">⏱ ${ex.time}</span>
          </div>
        </div>
      </div>
    `;
  }).join('') || '<div class="text-muted" style="padding:20px;">Aucun exercice pour ce niveau.</div>';
}

function openExercise(modKey, num) {
  toast(`📖 Exercice ${num} — ${MODULES[modKey].name} ouvert ! Suivez les étapes guidées.`, 3000);
}

// ============ PARCOURS ============
function saveParc() {
  toast('💾 Parcours enregistré avec succès !', 3000);
}

function lancerTest() {
  toast('📝 Test de positionnement lancé ! Répondez aux 15 questions.', 3000);
}

function setNiveauFr(niveau) {
  App.stagiaire.niveauFr = niveau;
  setEl('userLevelBadge', niveau);
  document.getElementById('userLevelBadge').className = 'lvl lvl-' + niveau.toLowerCase();
  toast('🎓 Niveau ' + niveau + ' sélectionné.', 2000);
}

// ============ FORMATEUR ============
let filtreGroupe = 'all';
let filtreSearch = '';

function renderStagiairesTable(groupFilter = 'all', search = '') {
  const tbody = document.getElementById('stagTableBody');
  if (!tbody) return;
  const filtered = App.stagiaires.filter(s => {
    const matchGroupe = groupFilter === 'all' || s.groupe === groupFilter;
    const matchSearch = !search || (s.prenom + ' ' + s.nom).toLowerCase().includes(search.toLowerCase());
    return matchGroupe && matchSearch;
  });

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>
        <div class="flex flex-gap-2">
          <div class="user-avatar" style="flex-shrink:0;">${s.initials}</div>
          <div>
            <div class="td-name">${s.prenom} ${s.nom}</div>
            <div class="text-muted">${s.groupe}</div>
          </div>
        </div>
      </td>
      <td><span class="tag ${s.formTag}">${s.formation}</span></td>
      <td><span class="lvl ${s.lvlClass}">${s.niveau}</span></td>
      <td>${s.metier}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="progress-bar" style="width:80px;"><div class="progress-fill fill-primary" style="width:${s.prog}%"></div></div>
          <span class="font-head" style="font-size:13px;font-weight:800;">${s.prog}%</span>
        </div>
      </td>
      <td class="text-muted">${s.accès}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="voirStagiaire(${s.id})">Voir fiche</button>
        <button class="btn btn-outline btn-sm" onclick="imprimerStagiaire(${s.id})" style="margin-left:6px;">🖨️</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" class="text-muted text-center" style="padding:24px;">Aucun stagiaire trouvé.</td></tr>';
}

function renderTravauxTable() {
  const tbody = document.getElementById('travauxTableBody');
  if (!tbody) return;
  tbody.innerHTML = App.travaux.map((t, i) => `
    <tr>
      <td class="td-name">${t.stagiaire}</td>
      <td>${t.fichier}</td>
      <td><span class="tag ${t.tagClass}">${t.module}</span></td>
      <td class="text-muted">${t.date}</td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="corrigerTravail(${i})">Corriger</button>
        <button class="btn btn-ghost btn-sm" onclick="validerTravail(${i})" style="margin-left:6px;">✅ Valider</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="5" class="text-muted text-center" style="padding:24px;">Aucun travail en attente.</td></tr>';
}

function filterStagiaires() {
  const groupe = document.getElementById('filtreGroupe').value;
  const search = document.getElementById('filtreSearch').value;
  renderStagiairesTable(groupe, search);
}

function voirStagiaire(id) {
  const s = App.stagiaires.find(st => st.id === id);
  if (s) toast(`📋 Fiche de ${s.prenom} ${s.nom} ouverte.`, 2500);
}

function imprimerStagiaire(id) {
  const s = App.stagiaires.find(st => st.id === id);
  if (s) { toast(`🖨️ Impression de la fiche de ${s.prenom} ${s.nom}...`, 2500); }
}

function corrigerTravail(i) {
  toast(`✏️ Fichier "${App.travaux[i].fichier}" ouvert pour correction.`, 3000);
}

function validerTravail(i) {
  App.travaux.splice(i, 1);
  renderTravauxTable();
  toast('✅ Travail validé et archivé !', 2500);
}

function switchFormateurTab(tabId, btn) {
  document.querySelectorAll('#formateurTabs .tab-btn').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.formateur-tab-content').forEach(c => c.classList.remove('active'));
  const target = document.getElementById('ftab-' + tabId);
  if (target) target.classList.add('active');
}

function exporterRapport() {
  toast('📄 Rapport PDF généré et téléchargé !', 2500);
}

function imprimerGroupe() {
  toast('🖨️ Impression du rapport de groupe lancée...', 2500);
}

// ============ CAS PRATIQUES ============
function ouvrirCasPratique(id) {
  document.querySelectorAll('.cp-detail').forEach(d => d.classList.add('hidden'));
  const detail = document.getElementById('cp-' + id);
  if (detail) {
    detail.classList.remove('hidden');
    detail.scrollIntoView({ behavior: 'smooth' });
  }
}

function fermerCasPratique(id) {
  document.getElementById('cp-' + id)?.classList.add('hidden');
}

function validerEtape(cpId, etapeNum) {
  const btn = document.querySelector(`#cp-${cpId} [data-etape="${etapeNum}"]`);
  if (btn) {
    btn.closest('.step-item').querySelector('.step-circle').textContent = '✓';
    btn.closest('.step-item').querySelector('.step-circle').classList.add('done');
    btn.textContent = '✓ Fait';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-success');
  }
  toast(`✅ Étape ${etapeNum} validée !`, 2000);
}

// ============ ENVOI ============
function initDragDrop() {
  const zone = document.getElementById('uploadZone');
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragging'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragging'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragging');
    const files = e.dataTransfer.files;
    if (files.length) handleFileUpload(files[0]);
  });
  zone.addEventListener('click', () => document.getElementById('fileInput').click());
  document.getElementById('fileInput').addEventListener('change', e => {
    if (e.target.files.length) handleFileUpload(e.target.files[0]);
  });
}

function handleFileUpload(file) {
  const allowed = ['docx','xlsx','pptx','pub','doc','xls','ppt'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowed.includes(ext)) {
    toast('⚠️ Format non accepté. Utilisez Word, Excel, PowerPoint ou Publisher.', 3000);
    return;
  }
  const zone = document.getElementById('uploadZone');
  zone.innerHTML = `
    <div class="upload-icon">📎</div>
    <div class="upload-title">${file.name}</div>
    <div class="upload-sub">Fichier prêt à être envoyé</div>
    <button class="btn btn-ghost btn-sm" style="margin-top:12px;" onclick="resetUpload()">× Changer de fichier</button>
  `;
}

function resetUpload() {
  const zone = document.getElementById('uploadZone');
  zone.innerHTML = `
    <div class="upload-icon">📤</div>
    <div class="upload-title">Cliquez ou glissez votre fichier ici</div>
    <div class="upload-sub">Déposez votre travail pour l'envoyer à votre formatrice</div>
    <div class="upload-types">Word (.docx) · Excel (.xlsx) · PowerPoint (.pptx) · Publisher (.pub)</div>
    <input type="file" id="fileInput" style="display:none;" accept=".docx,.xlsx,.pptx,.pub,.doc,.xls,.ppt">
  `;
  document.getElementById('fileInput').addEventListener('change', e => {
    if (e.target.files.length) handleFileUpload(e.target.files[0]);
  });
}

function envoyerTravail() {
  toast('📤 Travail envoyé avec succès ! Votre formatrice sera notifiée.', 3500);
}

// ============ TESTS ============
function demarrerTest(testId, duree) {
  toast(`⏱️ Test démarré ! Vous avez ${duree} minutes. Bonne chance !`, 4000);
}

function demarrerSimulation(sim) {
  toast(`🎯 Simulation "${sim}" démarrée ! Durée : 45 minutes. Bonne chance !`, 4000);
}

// ============ IMPRESSION ============
function imprimerPage() {
  window.print();
}

// ============ UTILS ============
function setEl(id, content) {
  const el = document.getElementById(id);
  if (el) el.textContent = content;
}

let toastTimer;
function toast(msg, duration = 3000) {
  const el = document.getElementById('toast');
  el.innerHTML = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}
