(function () {
  if (document.cookie.split(';').some(c => c.trim().startsWith('cookie_consent='))) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>This site uses cookies to save your theme preference and keep you logged in.</p>
    <div style="display:flex;gap:8px;flex-shrink:0">
      <button class="cookie-banner-accept" data-action="accept">Accept</button>
      <button class="cookie-banner-decline" data-action="decline">Decline</button>
    </div>
  `;

  banner.querySelector('[data-action="accept"]').addEventListener('click', function () {
    document.cookie = 'cookie_consent=accepted; max-age=' + (365 * 24 * 60 * 60) + '; path=/; samesite=lax';
    banner.remove();
  });

  banner.querySelector('[data-action="decline"]').addEventListener('click', function () {
    document.cookie = 'cookie_consent=declined; max-age=' + (365 * 24 * 60 * 60) + '; path=/; samesite=lax';
    // Remove functional cookies
    document.cookie = 'theme=; max-age=0; path=/';
    document.cookie = 'token=; max-age=0; path=/';
    banner.remove();
  });

  document.body.appendChild(banner);
})();
