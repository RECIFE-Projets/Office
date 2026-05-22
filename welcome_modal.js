/*!
 * MPB — Welcome Modal v2
 * Modal de bienvenue amélioré — donne envie de visualiser le tutoriel.
 * Intégration : <script src="welcome_modal.js"></script> avant </body> dans index.html
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'mpb_welcome_seen_v2';
  var SHOW_ALWAYS = false; // mettre true pour tester à chaque rechargement

  if (!SHOW_ALWAYS && localStorage.getItem(STORAGE_KEY)) return;

  function init() { injectStyles(); buildModal(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 200);
  }

  function injectStyles() {
    var s = document.createElement('style');
    s.textContent = `
      #mpb-ov {
        position: fixed; inset: 0;
        background: rgba(5,10,25,0.92);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 999999;
        display: flex; align-items: center; justify-content: center;
        padding: 12px;
        animation: mpb-fade 0.35s ease;
      }
      @keyframes mpb-fade { from{opacity:0} to{opacity:1} }

      #mpb-card {
        background: #fff;
        border-radius: 22px;
        max-width: 540px; width: 100%;
        overflow: hidden;
        box-shadow: 0 50px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05);
        animation: mpb-rise 0.5s cubic-bezier(0.34,1.45,0.64,1);
        font-family: -apple-system,'Segoe UI',sans-serif;
        position: relative;
      }
      @keyframes mpb-rise {
        from{transform:translateY(50px) scale(0.94);opacity:0}
        to{transform:translateY(0) scale(1);opacity:1}
      }

      #mpb-x {
        position: absolute; top:12px; right:14px;
        width:28px; height:28px; border-radius:50%;
        background:rgba(255,255,255,0.15); border:none; color:white;
        font-size:16px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        z-index:10; transition:background 0.2s;
      }
      #mpb-x:hover{background:rgba(255,255,255,0.3);}

      #mpb-hero {
        background:linear-gradient(135deg,#0f1f3d 0%,#1a3260 55%,#0d2a55 100%);
        padding:30px 28px 22px; text-align:center;
        position:relative; overflow:hidden;
      }
      #mpb-hero::before {
        content:''; position:absolute; top:-60px; right:-60px;
        width:220px; height:220px;
        background:radial-gradient(circle,rgba(201,150,12,0.22) 0%,transparent 70%);
        border-radius:50%; animation:mpb-glow 4s ease-in-out infinite;
      }
      #mpb-hero::after {
        content:''; position:absolute; bottom:-40px; left:-30px;
        width:160px; height:160px;
        background:radial-gradient(circle,rgba(13,125,107,0.18) 0%,transparent 70%);
        border-radius:50%;
      }
      @keyframes mpb-glow {
        0%,100%{transform:scale(1);opacity:1}
        50%{transform:scale(1.1);opacity:0.7}
      }
      #mpb-badge {
        display:inline-flex; align-items:center; gap:6px;
        background:rgba(201,150,12,0.25);
        border:1px solid rgba(201,150,12,0.5);
        color:#f0c040; font-size:10px; font-weight:800;
        letter-spacing:2px; text-transform:uppercase;
        padding:4px 12px; border-radius:20px; margin-bottom:14px;
      }
      #mpb-hero h2 {
        font-size:26px; font-weight:800;
        color:#fff; line-height:1.2; margin:0 0 8px;
      }
      #mpb-hero h2 span{color:#f0c040;}
      #mpb-hero .mpb-tagline{font-size:13px;color:rgba(255,255,255,0.6);margin:0 0 20px;line-height:1.5;}
      #mpb-flags{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:6px;}
      #mpb-flags .mpb-flag {
        display:flex; align-items:center; gap:5px;
        background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.14);
        border-radius:20px; padding:4px 10px;
        font-size:12px; color:rgba(255,255,255,0.8); font-weight:600;
      }

      #mpb-alert {
        margin:0 24px; transform:translateY(-18px);
        background:linear-gradient(90deg,#c9960c,#e8b218);
        border-radius:14px; padding:14px 18px;
        display:flex; align-items:center; gap:12px;
        box-shadow:0 8px 24px rgba(201,150,12,0.4);
        animation:mpb-ps 2.5s ease-in-out infinite;
      }
      @keyframes mpb-ps {
        0%,100%{box-shadow:0 8px 24px rgba(201,150,12,0.4)}
        50%{box-shadow:0 8px 36px rgba(201,150,12,0.65)}
      }
      .mpb-al-icon{font-size:26px;flex-shrink:0;animation:mpb-bounce 1.8s ease-in-out infinite;}
      @keyframes mpb-bounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}60%{transform:translateY(-3px)}}
      .mpb-al-text strong{display:block;font-size:15px;font-weight:900;color:#0f1f3d;line-height:1.3;}
      .mpb-al-text span{font-size:12px;color:rgba(15,31,61,0.65);font-weight:600;}

      #mpb-body{padding:0 24px 24px;margin-top:-4px;}

      #mpb-preview {
        background:#f8fafc; border:1px solid #e2e8f0;
        border-radius:12px; padding:11px 14px;
        margin-bottom:16px;
        display:flex; align-items:center; gap:12px;
      }
      .mpv-icon{font-size:22px;flex-shrink:0;}
      .mpv-text strong{font-size:12px;font-weight:800;color:#0f1f3d;display:block;margin-bottom:2px;}
      .mpv-text span{font-size:11px;color:#6b7280;}
      .mpv-steps{display:flex;gap:4px;flex-wrap:wrap;margin-top:5px;}
      .mpv-step{background:#e2e8f0;color:#374151;font-size:9px;font-weight:700;padding:2px 7px;border-radius:8px;}

      #mpb-profiles{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;}
      .mpb-pc {
        border-radius:14px; border:2px solid #e2e8f0;
        padding:16px 14px; text-align:center;
        text-decoration:none; display:block;
        transition:all 0.22s; position:relative; overflow:hidden;
        background:#fff; cursor:pointer;
      }
      .mpb-pc:hover{transform:translateY(-3px);text-decoration:none;}
      .mpb-pc.fo{border-color:#0f1f3d;}
      .mpb-pc.fo:hover{box-shadow:0 8px 24px rgba(15,31,61,0.15);}
      .mpb-pc.st{border-color:#0d7d6b;}
      .mpb-pc.st:hover{box-shadow:0 8px 24px rgba(13,125,107,0.2);}
      .mpb-pc .pc-new{
        position:absolute;top:10px;right:10px;
        background:#e05c10;color:white;
        font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;
        padding:2px 7px;border-radius:10px;
      }
      .mpb-pc .pc-em{font-size:32px;display:block;margin-bottom:8px;}
      .mpb-pc .pc-t{font-size:14px;font-weight:800;color:#0f1f3d;margin-bottom:5px;}
      .mpb-pc .pc-s{font-size:11px;color:#6b7280;line-height:1.5;margin-bottom:10px;}
      .mpb-pc .pc-dur{
        display:inline-flex;align-items:center;gap:4px;
        background:#f3f4f6;color:#374151;
        font-size:10px;font-weight:700;
        padding:2px 8px;border-radius:10px;margin-bottom:8px;
      }
      .mpb-pc .pc-btn{
        display:inline-flex;align-items:center;gap:5px;
        padding:7px 16px;border-radius:20px;
        font-size:11px;font-weight:800;
        border:none;cursor:pointer;font-family:inherit;transition:all 0.2s;
      }
      .mpb-pc.fo .pc-btn{background:#0f1f3d;color:#f0c040;}
      .mpb-pc.fo .pc-btn:hover{background:#1a3260;}
      .mpb-pc.st .pc-btn{background:#0d7d6b;color:white;}
      .mpb-pc.st .pc-btn:hover{background:#0a6558;}

      #mpb-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;}
      .mpf-ck{display:flex;align-items:center;gap:7px;cursor:pointer;}
      .mpf-ck input{width:15px;height:15px;accent-color:#0f1f3d;cursor:pointer;}
      .mpf-ck label{font-size:11px;color:#9ca3af;cursor:pointer;font-weight:500;}
      #mpb-skip{
        background:transparent;border:1.5px solid #e2e8f0;
        color:#9ca3af;border-radius:10px;
        padding:8px 16px;font-size:12px;font-weight:700;
        cursor:pointer;font-family:inherit;transition:all 0.2s;
      }
      #mpb-skip:hover{border-color:#0f1f3d;color:#0f1f3d;}

      @media(max-width:480px){
        #mpb-hero{padding:22px 16px 16px;}
        #mpb-hero h2{font-size:20px;}
        #mpb-alert{margin:0 14px;padding:11px 13px;}
        #mpb-body{padding:0 14px 18px;}
        #mpb-profiles{grid-template-columns:1fr;}
        #mpb-foot{flex-direction:column;align-items:stretch;}
        #mpb-skip{text-align:center;}
      }
    `;
    document.head.appendChild(s);
  }

  function buildModal() {
    var ov = document.createElement('div');
    ov.id = 'mpb-ov';
    ov.setAttribute('role','dialog');
    ov.setAttribute('aria-modal','true');
    ov.innerHTML = `
      <div id="mpb-card">
        <button id="mpb-x" onclick="mpbClose()">✕</button>

        <div id="mpb-hero">
          <div id="mpb-badge">✦ Ma Plateforme Bureautique</div>
          <h2>Apprenez Office<br><span>à votre rythme</span></h2>
          <p class="mpb-tagline">Word · Excel · PowerPoint · Publisher · Niveaux A1–C2</p>
          <div id="mpb-flags">
            <div class="mpb-flag">🇫🇷 Français</div>
            <div class="mpb-flag">🇬🇧 English</div>
            <div class="mpb-flag">🇲🇦 العربية</div>
            <div class="mpb-flag">🇵🇹 Português</div>
            <div class="mpb-flag">🇪🇸 Español</div>
          </div>
        </div>

        <div id="mpb-alert">
          <span class="mpb-al-icon">👀</span>
          <div class="mpb-al-text">
            <strong>Avant de vous inscrire, regardez le tutoriel !</strong>
            <span>3 minutes suffisent pour bien démarrer — disponible en 5 langues</span>
          </div>
        </div>

        <div id="mpb-body">
          <div id="mpb-preview">
            <span class="mpv-icon">🎬</span>
            <div class="mpv-text">
              <strong>Ce que vous apprendrez en 3 min</strong>
              <span>Tutoriel animé interactif, pas à pas</span>
              <div class="mpv-steps">
                <span class="mpv-step">🔑 Se connecter</span>
                <span class="mpv-step">📊 Choisir son niveau</span>
                <span class="mpv-step">🧩 Faire un exercice</span>
                <span class="mpv-step">📤 Envoyer un travail</span>
                <span class="mpv-step">📈 Voir sa progression</span>
              </div>
            </div>
          </div>

          <div id="mpb-profiles">
            <a class="mpb-pc fo" href="guides/guide_formateur_mpb.pdf" target="_blank">
              <span class="pc-em">👩‍🏫</span>
              <div class="pc-dur">📄 PDF complet</div>
              <div class="pc-t">Je suis Formateur</div>
              <div class="pc-s">Guide des deux côtés : formateur <em>et</em> stagiaire</div>
              <button class="pc-btn" onclick="return false;">Télécharger →</button>
            </a>
            <a class="mpb-pc st" href="guides/tuto_multilingue.html" target="_blank">
              <span class="pc-new">5 langues</span>
              <span class="pc-em">🎓</span>
              <div class="pc-dur">🎬 3 min · Animé</div>
              <div class="pc-t">Je suis Stagiaire</div>
              <div class="pc-s">Tutoriel interactif — choisissez votre langue !</div>
              <button class="pc-btn" onclick="return false;">▶ Voir le tutoriel</button>
            </a>
          </div>

          <div id="mpb-foot">
            <label class="mpf-ck">
              <input type="checkbox" id="mpb-nc">
              <label for="mpb-nc">Ne plus afficher ce message</label>
            </label>
            <button id="mpb-skip" onclick="mpbClose()">Accéder au site →</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){ if(e.target===ov) mpbClose(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') mpbClose(); });
    window.mpbClose = function() {
      if(document.getElementById('mpb-nc') && document.getElementById('mpb-nc').checked)
        localStorage.setItem(STORAGE_KEY,'1');
      var el = document.getElementById('mpb-ov');
      if(!el) return;
      el.style.transition='opacity 0.3s ease';
      el.style.opacity='0';
      setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },300);
    };
  }
})();
