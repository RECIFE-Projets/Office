/*!
 * MPB — Correctifs v1
 * Corrige 3 anomalies signalées :
 *  1) Les statistiques et listes ne s'actualisent pas après suppression/validation
 *  2) Pas de bouton de déconnexion visible
 *  3) Les stagiaires inscrits sur d'autres appareils sont invisibles côté formateur
 *
 * Intégration : ajouter <script src="bugfix_v1.js"></script> APRÈS le script
 * principal, juste avant </body> dans index.html.
 * Ce fichier redéfinit certaines fonctions existantes (autorisé en JS classique) —
 * il n'y a rien d'autre à modifier dans index.html pour ces 3 correctifs.
 */
(function () {
  'use strict';

  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  // ══════════════════════════════════════════════════════════════
  // CORRECTIF 2 — Bouton de déconnexion visible
  // ══════════════════════════════════════════════════════════════
  whenReady(function () {
    var pill = document.querySelector('.user-pill');
    if (!pill) return;
    var lastSpan = pill.querySelector('span:last-child');
    if (lastSpan) {
      lastSpan.textContent = '⏻ Déconnexion';
      lastSpan.style.color = 'var(--danger)';
      lastSpan.style.fontWeight = '800';
      lastSpan.style.fontSize = '12px';
      lastSpan.style.marginLeft = '6px';
      lastSpan.style.whiteSpace = 'nowrap';
    }
    pill.title = 'Cliquer pour se déconnecter';
  });

  // ══════════════════════════════════════════════════════════════
  // CORRECTIF 3 — Voir les stagiaires inscrits sur d'autres appareils
  // ══════════════════════════════════════════════════════════════
  var _stagCloudRefreshing = false;
  window.S = window.S || {};
  if (!S._remoteUsers) S._remoteUsers = [];

  function refreshStagiairesFromCloud() {
    if (_stagCloudRefreshing) return;
    if (typeof SB === 'undefined' || !SB.enabled || !navigator.onLine) return;
    _stagCloudRefreshing = true;
    SB.getAllUsersRemote().then(function (remote) {
      var remoteStag = (remote || []).filter(function (u) { return u.role === 'stagiaire'; });
      var changed = JSON.stringify(remoteStag) !== JSON.stringify(S._remoteUsers);
      S._remoteUsers = remoteStag;
      if (changed && document.getElementById('stagBody')) {
        renderStagTable();
      }
    }).catch(function () {}).finally(function () {
      _stagCloudRefreshing = false;
    });
  }

  function getKnownStagiaires() {
    var localEmails = {};
    S.users.forEach(function (u) { localEmails[(u.email || '').toLowerCase()] = true; });
    var merged = S.users.slice();
    (S._remoteUsers || []).forEach(function (ru) {
      if (!localEmails[(ru.email || '').toLowerCase()]) merged.push(ru);
    });
    return merged.filter(function (u) { return u.role === 'stagiaire'; });
  }

  // Redéfinition complète de renderStagTable — même logique que l'original,
  // mais avec la liste fusionnée (locale + cloud) + rafraîchissement cloud.
  window.renderStagTable = function () {
    try {
      refreshStagiairesFromCloud();

      var search = (document.getElementById('stagSearch')?.value || '').toLowerCase();
      var grp = document.getElementById('stagGrp')?.value || 'all';
      var niv = document.getElementById('stagNiv')?.value || 'all';

      var savedGroups = safeGet('mpb_groups', ['Groupe 1', 'Groupe 2', 'Groupe 3']);
      var grpSel = document.getElementById('stagGrp');
      if (grpSel) {
        var groups = ['all'].concat(Array.from(new Set(savedGroups.concat(DEMO_STAGIAIRES.map(function (s) { return s.groupe; })))).sort());
        var curGrp = grpSel.value || 'all';
        grpSel.innerHTML = groups.map(function (g) {
          return '<option value="' + g + '" ' + (g === curGrp ? 'selected' : '') + '>' + (g === 'all' ? 'Tous groupes' : g) + '</option>';
        }).join('');
      }

      var realUsers = getKnownStagiaires().map(function (u, i) {
        return {
          id: 900 + i, prenom: u.prenom, nom: u.nom,
          init: (u.prenom[0] + (u.nom ? u.nom[0] : '')).toUpperCase(),
          formation: 'Inscrit', ftag: 't-green',
          niveau: u.niveauFr || S.settings.niveauFr || 'A1',
          lclass: 'l' + (u.niveauFr || 'A1'),
          metier: 'Non défini', prog: 0, acces: new Date().toLocaleDateString('fr-FR'),
          groupe: u.groupe || 'Groupe 1',
          detail: { word: 0, excel: 0, ppt: 0, pub: 0, temps: '0min', exFaits: 0 }
        };
      });

      var hiddenIds = safeGet('mpb_hidden_stags', []);
      var allStagiaires = realUsers.concat(DEMO_STAGIAIRES).filter(function (s) { return hiddenIds.indexOf(s.id) === -1; });
      var filtered2 = allStagiaires.filter(function (s) {
        var ms = !search || (s.prenom + ' ' + s.nom).toLowerCase().indexOf(search) !== -1;
        var mg = grp === 'all' || s.groupe === grp;
        var mn = niv === 'all' || s.niveau === niv;
        return ms && mg && mn;
      });

      setEl('stagBody', filtered2.map(function (s) {
        return '<tr>'
          + '<td><div class="flex gap2"><div class="avatar">' + s.init + '</div><div><div style="font-weight:700">' + s.prenom + ' ' + s.nom + '</div><div class="muted">' + s.groupe + '</div></div></div></td>'
          + '<td><span class="tag ' + s.ftag + '">' + s.formation + '</span></td>'
          + '<td><span class="lvl ' + s.lclass + '">' + s.niveau + '</span></td>'
          + '<td>' + s.metier + '</td>'
          + '<td style="font-size:11px;line-height:2">'
          + ['W', 'E', 'P', 'Pu'].map(function (l, i) {
              var v = [s.detail?.word || 0, s.detail?.excel || 0, s.detail?.ppt || 0, s.detail?.pub || 0][i];
              return '<span title="' + ['Word', 'Excel', 'PPT', 'Publisher'][i] + ':' + v + '%">' + l + ':<b>' + v + '%</b> </span>';
            }).join('')
          + '</td>'
          + '<td><div class="pr-bar" style="width:60px;display:inline-block"><div class="pr-fill fill-primary" style="width:' + s.prog + '%"></div></div> <b style="font-size:12px">' + s.prog + '%</b></td>'
          + '<td class="muted">' + s.acces + '</td>'
          + '<td class="flex gap2">'
          + '<button class="btn btn-ghost btn-sm" onclick="openFiche(' + s.id + ')">Voir fiche</button>'
          + '<button class="btn btn-ghost btn-sm" onclick="archiverStag(' + s.id + ',\'' + s.prenom + ' ' + s.nom + '\')" title="Archiver" style="color:var(--warn)">📁</button>'
          + '<button class="btn btn-ghost btn-sm" onclick="supprimerStag(' + s.id + ',\'' + s.prenom + ' ' + s.nom + '\')" title="Supprimer" style="color:var(--danger)">🗑️</button>'
          + '<button class="btn btn-outline btn-sm" onclick="imprimerFiche(' + s.id + ')">🖨️</button>'
          + '</td></tr>';
      }).join('') || '<tr><td colspan="7" class="muted tc" style="padding:20px">Aucun stagiaire trouvé.</td></tr>');
    } catch (e) { console.error('renderStagTable (patch) error:', e); }
  };

  // ══════════════════════════════════════════════════════════════
  // CORRECTIF 1 — Rafraîchissement après suppression / validation
  // ══════════════════════════════════════════════════════════════

  // 1a) Statistiques en haut du dashboard formateur : tenir compte
  //     des suppressions (mpb_hidden_stags) et des vrais stagiaires inscrits.
  window.renderFormateur = function () {
    try {
      var travCount = getFormTravaux().length;

      var hiddenIds = safeGet('mpb_hidden_stags', []);
      var activeDemo = DEMO_STAGIAIRES.filter(function (s) { return hiddenIds.indexOf(s.id) === -1; });
      var realStagCount = getKnownStagiaires().length;
      var totalStag = activeDemo.length + realStagCount;
      var groupes = Array.from(new Set(
        activeDemo.map(function (s) { return s.groupe; })
          .concat(safeGet('mpb_groups', ['Groupe 1', 'Groupe 2', 'Groupe 3']))
      )).length;
      var avgProg = activeDemo.length ? Math.round(activeDemo.reduce(function (a, s) { return a + s.prog; }, 0) / activeDemo.length) : 0;

      setEl('formStats',
        '<div class="sc"><div class="sv" style="color:var(--primary)">' + totalStag + '</div><div class="sl">Stagiaires actifs</div></div>'
        + '<div class="sc"><div class="sv" style="color:var(--accent)">' + groupes + '</div><div class="sl">Groupes</div></div>'
        + '<div class="sc"><div class="sv" style="color:var(--warn)">' + travCount + '</div><div class="sl">Travaux à corriger</div></div>'
        + '<div class="sc"><div class="sv" style="color:var(--purple)">' + avgProg + '%</div><div class="sl">Progression moy.</div></div>');

      var trBadgeEl = document.getElementById('trBadge');
      if (trBadgeEl) {
        trBadgeEl.textContent = travCount;
        if (travCount > 0) trBadgeEl.classList.remove('hidden'); else trBadgeEl.classList.add('hidden');
      }
      var alertZone = document.getElementById('formAlertZone');
      if (alertZone) {
        alertZone.innerHTML = travCount > 0
          ? '<div class="alert al-warn mb3"><span>📋</span><div><b>' + travCount + ' travail' + (travCount > 1 ? 'x' : '') + ' en attente de correction.</b> <button class="btn btn-sm btn-outline" onclick="fTab(\'travaux\',document.querySelector(\'#formTabs .tab-btn:nth-child(2)\'))">Voir les travaux →</button></div></div>'
          : '';
      }

      renderStagTable();
      renderTravTable();
      renderDiffStats();
      renderGrpProg();
      renderMsgs();
    } catch (e) { console.error('renderFormateur (patch) error:', e); }
  };

  // 1b) Valider un travail — rafraîchir tout le tableau de bord ensuite
  window.validerTrav = function (id) {
    var idx9 = S.travaux.findIndex(function (t) { return t.id === id || String(t.id) === String(id); });
    if (idx9 >= 0) {
      S.travaux[idx9].statut = 'valide';
      safeSet('mpb_travaux', S.travaux);
      if (typeof SB !== 'undefined' && SB.enabled && S.travaux[idx9].cloudId) {
        SB.updateTravailRemote(S.travaux[idx9].cloudId, { statut: 'valide' }).catch(function () {});
      }
    }
    toast('✅ Travail validé et archivé !');
    renderFormateur();
  };

  // 1c) Enregistrer une correction — rafraîchir tout le tableau de bord ensuite
  window.saveCorrAndClose = function (id) {
    Promise.resolve(_saveCorrWorkPatched(id)).catch(function (e) {
      console.error('saveCorrAndClose (patch) error:', e);
      toast('⚠️ Erreur lors de l\'enregistrement.');
    });
  };

  async function _saveCorrWorkPatched(id) {
    var note = document.getElementById('corrNote')?.value || '';
    var comment = document.getElementById('corrComment')?.value || '';
    var correctedFile = document.getElementById('corrFileInput')?.files?.[0];

    var btn = document.getElementById('btnSaveCorr');
    var prevTxt = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Enregistrement…'; }

    var correctedFileUrl = null;
    if (correctedFile && typeof SB !== 'undefined' && SB.enabled && navigator.onLine) {
      correctedFileUrl = await SB.uploadFile(correctedFile, 'corrections');
    }

    var idx = S.travaux.findIndex(function (t) { return String(t.id) === String(id); });
    if (idx >= 0) {
      S.travaux[idx].note = note;
      S.travaux[idx].comment = comment;
      S.travaux[idx].statut = 'corrige';
      if (correctedFileUrl) S.travaux[idx].correctedFileUrl = correctedFileUrl;
      safeSet('mpb_travaux', S.travaux);

      if (typeof SB !== 'undefined' && SB.enabled) {
        if (S.travaux[idx].cloudId) {
          await SB.updateTravailRemote(S.travaux[idx].cloudId, Object.assign(
            { statut: 'corrige', note: note, comment: comment },
            correctedFileUrl ? { corrected_file_url: correctedFileUrl } : {}
          ));
        } else {
          var cloudRow = await SB.syncTravail(S.travaux[idx]);
          if (cloudRow && cloudRow.id) { S.travaux[idx].cloudId = cloudRow.id; safeSet('mpb_travaux', S.travaux); }
        }
      }
    }

    toast('✅ Correction enregistrée' + (correctedFileUrl ? ' avec fichier annoté' : '') + ' — Note : ' + note);
    closeFicheModal();
    renderFormateur();
    if (btn) { btn.disabled = false; btn.innerHTML = prevTxt; }
  }

  // 1d) Archiver / Supprimer un stagiaire, créer/renommer/supprimer un groupe :
  //     s'assurer que le dashboard complet se rafraîchit (pas juste la table).
  var _origArchiver = window.archiverStag;
  window.archiverStag = function (id, nom) {
    if (!window.confirm('Archiver le stagiaire ' + nom + ' ? Il n\'apparaîtra plus dans la liste active mais ses données sont conservées.')) return;
    var archived = safeGet('mpb_archived_stags', []);
    archived.push({ id: id, nom: nom, date: new Date().toLocaleDateString('fr-FR') });
    safeSet('mpb_archived_stags', archived);
    var hiddenIds = safeGet('mpb_hidden_stags', []);
    hiddenIds.push(id);
    safeSet('mpb_hidden_stags', hiddenIds);
    renderFormateur();
    toast('📁 ' + nom + ' archivé(e). Visible dans Stagiaires archivés.', 4000);
  };

  window.supprimerStag = function (id, nom) {
    if (!window.confirm('⚠️ Supprimer définitivement ' + nom + ' ? Cette action est irréversible.')) return;
    S.users = S.users.filter(function (u, i) { return (900 + i) !== id; });
    safeSet('mpb_users', S.users);
    var hiddenIds = safeGet('mpb_hidden_stags', []);
    hiddenIds.push(id);
    safeSet('mpb_hidden_stags', hiddenIds);
    renderFormateur();
    toast('🗑️ Stagiaire supprimé(e).');
  };

  window.createGroup = function () {
    var name = document.getElementById('newGroupName')?.value?.trim();
    if (!name) { toast('⚠️ Entrez un nom de groupe.'); return; }
    var groups = safeGet('mpb_groups', ['Groupe 1', 'Groupe 2', 'Groupe 3']);
    if (groups.indexOf(name) !== -1) { toast('⚠️ Ce groupe existe déjà.'); return; }
    groups.push(name);
    safeSet('mpb_groups', groups);
    document.getElementById('newGroupName').value = '';
    renderGroupes();
    renderFormateur();
    toast('✅ Groupe "' + name + '" créé !');
  };

  window.deleteGroup = function (idx) {
    if (!window.confirm('Supprimer ce groupe ?')) return;
    var groups = safeGet('mpb_groups', ['Groupe 1', 'Groupe 2', 'Groupe 3']);
    groups.splice(idx, 1);
    safeSet('mpb_groups', groups);
    renderGroupes();
    renderFormateur();
    toast('🗑️ Groupe supprimé.');
  };

  console.log('✅ MPB bugfix_v1.js chargé — 3 correctifs actifs.');
})();
