/* AINTERCOM · header partagé pour les sous-pages (villes + insights)
   Source unique : modifier ce fichier met à jour toutes les sous-pages.
   Inclus : nav complète identique à la home + CTA "retour au site principal" + menu mobile.
*/
(function () {
  'use strict';

  const BASE = 'https://aintercom.fr';
  const NAV_HTML = `
<nav class="site-nav">
  <div class="site-nav-inner">
    <a href="${BASE}/" class="site-nav-logo" aria-label="AINTERCOM — accueil">
      <img src="${BASE}/assets/logos/logo-color.webp" alt="AINTERCOM" width="180" height="54">
    </a>
    <div class="site-nav-center">
      <div class="site-nav-item">
        <a href="${BASE}/#services">Solutions <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></a>
        <div class="site-nav-drop">
          <a href="${BASE}/#services"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="16 2 12 7 8 2"/></svg></span><span><span class="site-nav-drop-t">Radios terrain</span><span class="site-nav-drop-s">Motorola XT420 · 12 secteurs</span></span></a>
          <a href="${BASE}/#services"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg></span><span><span class="site-nav-drop-t">Intercom Full-Duplex</span><span class="site-nav-drop-s">Hollyland Solidcom · 6 postes</span></span></a>
          <a href="${BASE}/#services"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg></span><span><span class="site-nav-drop-t">Mégaphone</span><span class="site-nav-drop-s">Vonyx 65W · diffusion terrain</span></span></a>
        </div>
      </div>
      <div class="site-nav-item">
        <a href="${BASE}/#process">Infos <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></a>
        <div class="site-nav-drop">
          <a href="${BASE}/#genese"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg></span><span><span class="site-nav-drop-t">Notre histoire</span><span class="site-nav-drop-s">12 ans de terrain dans l'Ain</span></span></a>
          <a href="${BASE}/#process"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span><span><span class="site-nav-drop-t">Comment ça marche</span><span class="site-nav-drop-s">6 étapes, zéro prise de tête</span></span></a>
          <a href="${BASE}/#zone"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span><span><span class="site-nav-drop-t">Zone d'intervention</span><span class="site-nav-drop-s">Ain et environs</span></span></a>
          <a href="${BASE}/#faq"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span><span><span class="site-nav-drop-t">FAQ</span><span class="site-nav-drop-s">Toutes les réponses</span></span></a>
        </div>
      </div>
      <div class="site-nav-item">
        <a href="${BASE}/#tarifs">Tarifs <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></a>
        <div class="site-nav-drop">
          <a href="${BASE}/#tarifs"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg></span><span><span class="site-nav-drop-t">Grille tarifaire</span><span class="site-nav-drop-s">5 packs · Asso &amp; Pro</span></span></a>
          <a href="${BASE}/#tarifs"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span><span><span class="site-nav-drop-t">Simulateur tarifaire</span><span class="site-nav-drop-s">Calculez votre prix en 30 sec</span></span></a>
          <a href="${BASE}/insights/"><span class="site-nav-drop-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg></span><span><span class="site-nav-drop-t">Articles & retours terrain</span><span class="site-nav-drop-s">Insights AINTERCOM</span></span></a>
        </div>
      </div>
      <a href="${BASE}/#contact">Contact</a>
    </div>
    <div class="site-nav-right">
      <a href="${BASE}/#contact" class="site-nav-cta">Réserver un kit →</a>
      <button type="button" class="site-nav-burger" aria-label="Menu" onclick="window.__siteNavToggleMobile()">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="site-nav-mobile" id="site-nav-mobile">
    <a href="${BASE}/#services">Solutions</a>
    <a href="${BASE}/#process">Comment ça marche</a>
    <a href="${BASE}/#tarifs">Tarifs</a>
    <a href="${BASE}/insights/">Articles</a>
    <a href="${BASE}/#contact">Contact</a>
    <a href="${BASE}/#contact" class="site-nav-mobile-cta">Réserver un kit →</a>
  </div>
</nav>
<div class="site-back">
  <div class="site-back-inner">
    <a href="${BASE}/" class="site-back-link">
      <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Retour au site principal
    </a>
  </div>
</div>
`;

  function inject() {
    // Supprime l'ancien <nav> simplifié s'il existe
    const oldNav = document.querySelector('body > nav');
    if (oldNav) oldNav.remove();
    // Insère la nouvelle structure tout en haut du body
    document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  }

  // Toggle menu mobile (exposé sur window pour onclick HTML)
  window.__siteNavToggleMobile = function () {
    const m = document.getElementById('site-nav-mobile');
    if (m) m.classList.toggle('open');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
