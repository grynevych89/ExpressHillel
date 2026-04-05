function onSearchInput(input) {
  const clearBtn = document.getElementById('searchClear');
  if (clearBtn) clearBtn.style.display = input.value ? '' : 'none';

  const val = input.value.trim().toLowerCase();
  document.querySelectorAll('#cardGrid .card').forEach(card => {
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    card.style.display = title.includes(val) ? '' : 'none';
  });
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = '';
    onSearchInput(input);
    input.focus();
  }
}

function applyProjection(e) {
  e.preventDefault();
  const checked = [...e.target.querySelectorAll('[name="fields"]:checked')].map(cb => cb.value);
  location.href = checked.length < 4 && checked.length > 0
    ? `/articles?fields=${encodeURIComponent(checked.join(','))}`
    : '/articles';
}

function syncProjectionCheckboxes() {
  const params = new URLSearchParams(location.search);
  const fields = params.get('fields');
  if (!fields) return;
  const active = fields.split(',').map(f => f.trim());
  document.querySelectorAll('[name="fields"]').forEach(cb => {
    cb.checked = active.includes(cb.value);
  });
  document.getElementById('projectionPanel')?.classList.add('open');
}

document.addEventListener('DOMContentLoaded', syncProjectionCheckboxes);

async function submitCreateArticle(e) {
  e.preventDefault();
  const form = e.target;
  const errorEl = document.getElementById('createError');
  errorEl.textContent = '';

  const data = {
    title: form.querySelector('[name="title"]').value,
    author: form.querySelector('[name="author"]').value,
    date: form.querySelector('[name="date"]').value,
    content: form.querySelector('[name="content"]').value,
  };

  try {
    const res = await fetch('/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { article } = await res.json();
      location.href = `/articles/${article._id}`;
    } else {
      const json = await res.json();
      errorEl.textContent = json.error || 'Failed to create article';
    }
  } catch {
    errorEl.textContent = 'Network error. Please try again.';
  }
}

function fillFakeArticles() {
  document.getElementById('bulkTextarea').value = JSON.stringify(fakeArticles, null, 2);
}

async function submitCreateMany(e) {
  e.preventDefault();
  const form = e.target;
  const errorEl = document.getElementById('bulkError');
  errorEl.textContent = '';

  let data;
  try {
    data = JSON.parse(form.querySelector('[name="bulk"]').value);
  } catch {
    errorEl.textContent = 'Invalid JSON format';
    return;
  }

  try {
    const res = await fetch('/articles/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      location.reload();
    } else {
      const json = await res.json();
      errorEl.textContent = json.error || 'Failed to insert articles';
    }
  } catch {
    errorEl.textContent = 'Network error. Please try again.';
  }
}

async function submitUpdateOne(e, id) {
  e.preventDefault();
  const form = e.target;
  const errorEl = document.getElementById('editError');
  errorEl.textContent = '';

  const data = {};
  const title = form.querySelector('[name="title"]').value;
  const author = form.querySelector('[name="author"]').value;
  const date = form.querySelector('[name="date"]').value;
  const content = form.querySelector('[name="content"]').value;
  if (title) data.title = title;
  if (author) data.author = author;
  if (date) data.date = date;
  if (content) data.content = content;

  try {
    const res = await fetch(`/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      location.reload();
    } else {
      const json = await res.json();
      errorEl.textContent = json.error || 'Failed to update article';
    }
  } catch {
    errorEl.textContent = 'Network error. Please try again.';
  }
}

async function submitReplaceOne(e, id) {
  e.preventDefault();
  const form = e.target;
  const errorEl = document.getElementById('replaceError');
  errorEl.textContent = '';

  const data = {
    title: form.querySelector('[name="title"]').value,
    author: form.querySelector('[name="author"]').value,
    date: form.querySelector('[name="date"]').value,
    content: form.querySelector('[name="content"]').value,
  };

  try {
    const res = await fetch(`/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      location.reload();
    } else {
      const json = await res.json();
      errorEl.textContent = json.error || 'Failed to replace article';
    }
  } catch {
    errorEl.textContent = 'Network error. Please try again.';
  }
}

let updateMode = false;

function toggleUpdateMode() {
  if (!updateMode) resetAllModes();
  updateMode = !updateMode;
  const cards = document.querySelectorAll('#cardGrid .card');
  const toolbar = document.getElementById('updateToolbar');
  const btn = document.getElementById('updateModeBtn');

  cards.forEach(card => {
    card.querySelector('.card-view').style.display = updateMode ? 'none' : '';
    card.querySelector('.card-edit').style.display = updateMode ? '' : 'none';
    card.classList.toggle('edit-mode', updateMode);
  });

  toolbar.style.display = updateMode ? 'flex' : 'none';
  if (btn) btn.classList.toggle('active', updateMode);
}

async function saveAllUpdates() {
  const cards = document.querySelectorAll('#cardGrid .card');
  const requests = [];

  cards.forEach(card => {
    const id = card.dataset.id;
    const title = card.querySelector('[name="title"]').value;
    const author = card.querySelector('[name="author"]').value;
    const date = card.querySelector('[name="date"]').value;
    requests.push(
      fetch(`/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, date }),
      })
    );
  });

  try {
    await Promise.all(requests);
    location.reload();
  } catch {
    alert('Some updates failed. Please try again.');
  }
}

async function deleteArticle(id) {
  if (!confirm('Delete this article?')) return;
  try {
    const res = await fetch(`/articles/${id}`, { method: 'DELETE' });
    if (res.ok) {
      location.href = '/articles';
    } else {
      const json = await res.json();
      alert(json.error || 'Failed to delete article');
    }
  } catch {
    alert('Network error. Please try again.');
  }
}

function toggleForm(id) {
  const form = document.getElementById(id);
  form.style.display = form.style.display === 'none' ? '' : 'none';
}

function toggleAccordion(id) {
  if (selectMode || updateMode) resetAllModes();
  const panel = document.getElementById(id);
  const isOpen = panel.classList.contains('open');
  document.querySelectorAll('.accordion-panel').forEach(p => p.classList.remove('open'));
  if (!isOpen) panel.classList.add('open');
}

function resetAllModes() {
  if (selectMode) {
    selectMode = false;
    selectedIds.clear();
    document.querySelectorAll('#cardGrid .card').forEach(card => {
      card.classList.remove('card--selected');
      card.removeEventListener('click', onCardSelectClick);
    });
    document.getElementById('cardGrid').classList.remove('select-mode');
    const deleteToolbar = document.getElementById('deleteToolbar');
    if (deleteToolbar) deleteToolbar.style.display = 'none';
    const selectBtn = document.getElementById('selectModeBtn');
    if (selectBtn) selectBtn.classList.remove('active');
  }
  if (updateMode) {
    updateMode = false;
    document.querySelectorAll('#cardGrid .card').forEach(card => {
      card.querySelector('.card-view').style.display = '';
      card.querySelector('.card-edit').style.display = 'none';
      card.classList.remove('edit-mode');
    });
    const updateToolbar = document.getElementById('updateToolbar');
    if (updateToolbar) updateToolbar.style.display = 'none';
    const updateBtn = document.getElementById('updateModeBtn');
    if (updateBtn) updateBtn.classList.remove('active');
  }
  document.querySelectorAll('.accordion-panel').forEach(p => p.classList.remove('open'));
}

let selectMode = false;
const selectedIds = new Set();

function toggleSelectMode() {
  if (!selectMode) resetAllModes();
  selectMode = !selectMode;
  selectedIds.clear();

  const cards = document.querySelectorAll('#cardGrid .card');
  const toolbar = document.getElementById('deleteToolbar');
  const btn = document.getElementById('selectModeBtn');

  cards.forEach(card => {
    card.classList.remove('card--selected');
    if (selectMode) {
      card.addEventListener('click', onCardSelectClick);
    } else {
      card.removeEventListener('click', onCardSelectClick);
    }
  });

  document.getElementById('cardGrid').classList.toggle('select-mode', selectMode);
  toolbar.style.display = selectMode ? 'flex' : 'none';
  if (btn) btn.classList.toggle('active', selectMode);
  updateSelectedCount();
}

function onCardSelectClick(e) {
  e.preventDefault();
  const id = this.dataset.id;
  if (selectedIds.has(id)) {
    selectedIds.delete(id);
    this.classList.remove('card--selected');
  } else {
    selectedIds.add(id);
    this.classList.add('card--selected');
  }
  updateSelectedCount();
}

function updateSelectedCount() {
  const el = document.getElementById('selectedCount');
  if (el) el.textContent = `${selectedIds.size} selected`;
}

async function deleteSelected() {
  if (!selectedIds.size) return alert('Select at least one article');
  if (!confirm(`Delete ${selectedIds.size} article(s)?`)) return;

  try {
    const res = await fetch('/articles/many', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [...selectedIds] }),
    });
    if (res.ok) {
      location.reload();
    } else {
      const json = await res.json();
      alert(json.error || 'Failed to delete articles');
    }
  } catch {
    alert('Network error. Please try again.');
  }
}
