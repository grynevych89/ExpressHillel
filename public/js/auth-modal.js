function toggleTheme(el) {
  fetch('/theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme: el.checked ? 'dark' : 'light' })
  })
    .then(() => location.reload())
    .catch(() => { el.checked = !el.checked; }); // revert toggle on failure
}

document.querySelectorAll('.header-nav-link').forEach(link => {
  if (location.pathname.startsWith(new URL(link.href).pathname)) {
    link.classList.add('active');
  }
});

let _redirectAfterLogin = null;

function openAuthModal(tab, redirectTo) {
  _redirectAfterLogin = redirectTo || null;
  switchTab(tab);
  document.getElementById('authModal').classList.add('active');
}

function closeAuthModal(e) {
  if (e.target.id === 'authModal') {
    document.getElementById('authModal').classList.remove('active');
  }
}

function switchTab(tab) {
  document.getElementById('formLogin').style.display = tab === 'login' ? '' : 'none';
  document.getElementById('formRegister').style.display = tab === 'register' ? '' : 'none';
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('modalError').textContent = '';
}

async function submitAuth(e, action) {
  e.preventDefault();
  const form = e.target;
  const data = {
    username: form.querySelector('[name="username"]').value,
    password: form.querySelector('[name="password"]').value,
  };
  const errorEl = document.getElementById('modalError');
  errorEl.textContent = '';

  try {
    const res = await fetch('/auth/' + action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      location.href = _redirectAfterLogin || location.href;
    } else {
      const json = await res.json();
      errorEl.textContent = json.error || 'Something went wrong';
    }
  } catch {
    errorEl.textContent = 'Network error. Please try again.';
  }
}

async function authLogout() {
  try {
    await fetch('/auth/logout', { method: 'POST' });
    location.reload();
  } catch {
    location.reload();
  }
}
