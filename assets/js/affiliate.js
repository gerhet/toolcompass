/**
 * ToolCompass Affiliate Link Manager
 *
 * SO FUNKTIONIERT'S:
 * 1. Registriere dich bei den Partnerprogrammen (Links unten)
 * 2. Ersetze die Platzhalter unten durch deine echten IDs
 * 3. Fertig – alle Affiliate-Links auf der Seite werden automatisch aktualisiert
 *
 * Partnerprogramme (kostenlos):
 * - Amazon: https://partnernet.amazon.de/
 * - Digistore24: https://www.digistore24.com/
 * - Check24: https://www.check24.net/partner/
 * - Lexoffice: https://www.lexoffice.de/partnerprogramm/
 * - TradeTracker: https://tradetracker.com/ (viele deutsche Shops)
 */

const AFFILIATE = {
  // === HIER DEINE IDs EINTRAGEN ===
  amazon: {
    tag: 'viktorschwarz-21',           // Amazon PartnerNet tracking ID
    enabled: true
  },
  digistore24: {
    id: 'DEINE_DIGISTORE24_ID',       // Digistore24 Vendor/Affiliate-ID
    enabled: false
  },
  check24: {
    id: 'DEINE_CHECK24_ID',           // Check24 Partner-ID
    enabled: false
  },
  lexoffice: {
    url: 'https://www.lexoffice.de/?pid=DEIN_LEXOFFICE_PID',  // Lexoffice Partnerprogramm
    enabled: false
  },
  // === WEITERE PROGRAMME HIER HINZUFÜGEN ===
};

/**
 * Generiert einen Amazon-Partnerlink
 * @param {string} asin - Amazon-ASIN des Produkts
 * @param {object} options - { linkId, text }
 * @returns {string} Affiliate-URL
 */
function amazonLink(asin, options = {}) {
  if (!AFFILIATE.amazon.enabled) return `https://www.amazon.de/dp/${asin}/`;
  const tag = AFFILIATE.amazon.tag;
  const linkId = options.linkId ? `&linkId=${options.linkId}` : '';
  return `https://www.amazon.de/dp/${asin}/?tag=${tag}${linkId}`;
}

/**
 * Generiert einen Affiliate-Link für beliebige URLs (für Programme ohne API)
 * @param {string} url - Die Ziel-URL
 * @param {string} program - Schlüssel aus AFFILIATE (z.B. 'check24')
 * @returns {string} - Die URL oder ein leerer String, wenn deaktiviert
 */
function affiliateUrl(url, program) {
  const cfg = AFFILIATE[program];
  if (!cfg || !cfg.enabled) return url;
  // Für Programme mit einfacher URL-Parameter-Unterstützung
  // Kann nach Bedarf erweitert werden
  return cfg.url || url;
}

/**
 * Erstellt einen strukturierten Affiliate-CTA-Baustein
 * @param {object} opts - { title, text, url, buttonText, badge }
 * @returns {string} HTML
 */
function affiliateBox(opts) {
  return `
    <div class="cta-box" style="background:linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.06));border-color:rgba(251,191,36,0.2);">
      ${opts.badge ? `<span class="card-badge" style="margin-bottom:0.8rem;background:rgba(251,191,36,0.15);color:#fbbf24;border-color:rgba(251,191,36,0.2);">${opts.badge}</span>` : ''}
      <h3 style="margin-top:0;">${opts.title}</h3>
      <p style="font-size:0.95rem;">${opts.text}</p>
      <a href="${opts.url}" class="btn-primary" style="display:inline-flex;margin-top:.5rem;" rel="sponsored" target="_blank" ${opts.onclick ? `onclick="${opts.onclick}"` : ''}>
        ${opts.buttonText} →
      </a>
    </div>`;
}

/**
 * Amazon-Produktempfehlungsbox (geht direkt zu Amazon)
 */
function amazonProduct(asin, title, description, badge) {
  if (!AFFILIATE.amazon.enabled) return '';
  const link = amazonLink(asin);
  return affiliateBox({
    title: title,
    text: description,
    url: link,
    buttonText: `Bei Amazon ansehen`,
    badge: badge || 'Empfehlung'
  });
}
