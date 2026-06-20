/**
 * ToolCompass Consent Manager – DSGVO-konform
 * Lädt AdSense & Google Analytics 4 nur nach Einwilligung
 */
(function() {
    'use strict';

    var STORAGE_KEY = 'tc-consent';
    var ADSENSE_ID = 'ca-pub-1934902732899980';
    var GA4_ID = 'G-4JVNJKQYCG';

    // Hilfsfunktionen
    function getConsent() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch(e) { return null; }
    }

    function setConsent(consent) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
        } catch(e) {}
    }

    function loadScript(src, async, defer) {
        var s = document.createElement('script');
        s.src = src;
        if (async) s.async = true;
        if (defer) s.defer = true;
        document.head.appendChild(s);
    }

    // AdSense laden
    function loadAdSense() {
        if (window.__adsenseLoaded) return;
        window.__adsenseLoaded = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_ID;
        s.crossOrigin = 'anonymous';
        document.head.appendChild(s);
        // AdSense Push
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    // GA4 laden
    function loadGA4() {
        if (window.__ga4Loaded) return;
        window.__ga4Loaded = true;
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA4_ID, { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });
        loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA4_ID, true, false);
    }

    // Consent an Google senden
    function updateGoogleConsent(ad_storage, analytics_storage) {
        if (typeof window.gtag !== 'function') return;
        window.gtag('consent', 'update', {
            ad_storage: ad_storage ? 'granted' : 'denied',
            analytics_storage: analytics_storage ? 'granted' : 'denied',
            ad_user_data: ad_storage ? 'granted' : 'denied',
            ad_personalization: ad_storage ? 'granted' : 'denied'
        });
    }

    // Default consent (vor Einwilligung: alles denied)
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500
    });

    // Consent prüfen & Services laden
    var consent = getConsent();
    if (consent) {
        // Bereits entschieden
        if (consent.marketing) loadAdSense();
        if (consent.analytics) loadGA4();
        updateGoogleConsent(consent.marketing, consent.analytics);
    }

    // Banner erstellen (nur wenn noch keine Entscheidung)
    function createBanner() {
        if (document.getElementById('tc-consent-banner')) return;

        var banner = document.createElement('div');
        banner.id = 'tc-consent-banner';
        banner.innerHTML =
            '<div class="tc-consent-inner">' +
                '<div class="tc-consent-text">' +
                    '<strong>🍪 Datenschutz-Einstellungen</strong>' +
                    '<p>Wir verwenden Cookies und ähnliche Technologien für Analyse-Zwecke (Google Analytics) und Werbung (Google AdSense). ' +
                    'Dabei können personenbezogene Daten verarbeitet werden. Details in unserer <a href="/datenschutz/">Datenschutzerklärung</a>.</p>' +
                '</div>' +
                '<div class="tc-consent-actions">' +
                    '<label class="tc-toggle"><input type="checkbox" id="tc-analytics" checked><span>Analytics (empfohlen)</span></label>' +
                    '<label class="tc-toggle"><input type="checkbox" id="tc-marketing" checked><span>Marketing / AdSense</span></label>' +
                    '<div class="tc-buttons">' +
                        '<button class="tc-btn tc-btn-secondary" id="tc-decline">Nur essenziell</button>' +
                        '<button class="tc-btn tc-btn-primary" id="tc-accept">Ausgewählte akzeptieren</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        // Styles inline (keine externe CSS-Abhängigkeit)
        var style = document.createElement('style');
        style.textContent =
            '#tc-consent-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:rgba(3,7,18,0.95);backdrop-filter:blur(16px);border-top:1px solid rgba(255,255,255,0.08);padding:1.2rem;font-family:inherit;font-size:14px;line-height:1.5;color:#e2e8f0;box-shadow:0 -8px 32px rgba(0,0,0,0.4)}' +
            '#tc-consent-banner a{color:#818cf8;text-decoration:underline}' +
            '.tc-consent-inner{max-width:1100px;margin:0 auto;display:flex;gap:1.5rem;align-items:center;justify-content:space-between;flex-wrap:wrap}' +
            '.tc-consent-text{flex:1;min-width:260px}' +
            '.tc-consent-text strong{display:block;font-size:1rem;margin-bottom:.4rem;color:#fff}' +
            '.tc-consent-text p{margin:0;font-size:.85rem;color:#94a3b8}' +
            '.tc-consent-actions{display:flex;flex-direction:column;gap:.6rem;align-items:flex-end}' +
            '.tc-toggle{display:flex;align-items:center;gap:.5rem;font-size:.8rem;color:#94a3b8;cursor:pointer}' +
            '.tc-toggle input{cursor:pointer}' +
            '.tc-buttons{display:flex;gap:.5rem;margin-top:.3rem}' +
            '.tc-btn{padding:.55rem 1.2rem;border-radius:10px;font-size:.8rem;font-weight:600;cursor:pointer;border:none;transition:all .2s}' +
            '.tc-btn-primary{background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff}' +
            '.tc-btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,0.3)}' +
            '.tc-btn-secondary{background:rgba(255,255,255,0.05);color:#94a3b8;border:1px solid rgba(255,255,255,0.1)}' +
            '.tc-btn-secondary:hover{background:rgba(255,255,255,0.1);color:#fff}' +
            '@media(max-width:640px){.tc-consent-inner{flex-direction:column;align-items:stretch}.tc-consent-actions{align-items:stretch}}';

        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Events
        document.getElementById('tc-accept').addEventListener('click', function() {
            var analytics = document.getElementById('tc-analytics').checked;
            var marketing = document.getElementById('tc-marketing').checked;
            var c = { analytics: analytics, marketing: marketing, timestamp: Date.now() };
            setConsent(c);
            if (analytics) loadGA4();
            if (marketing) loadAdSense();
            updateGoogleConsent(marketing, analytics);
            banner.remove();
        });

        document.getElementById('tc-decline').addEventListener('click', function() {
            var c = { analytics: false, marketing: false, timestamp: Date.now() };
            setConsent(c);
            updateGoogleConsent(false, false);
            banner.remove();
        });
    }

    // Banner anzeigen, falls noch nicht entschieden
    if (!consent) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createBanner);
        } else {
            createBanner();
        }
    }

    // Global: Consent-Status abfragen (für andere Scripts)
    window.TCConsent = {
        get: getConsent,
        reset: function() { localStorage.removeItem(STORAGE_KEY); location.reload(); }
    };
})();
