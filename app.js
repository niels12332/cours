const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('[data-api-form]').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('button[type="submit"]');
    if (!status || !button) return;
    button.disabled = true;
    status.textContent = 'Envoi en cours…';
    status.className = 'form-status';
    try {
      const response = await fetch(form.dataset.apiForm, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : { message: 'Réponse inattendue de l’API.' };
      if (!response.ok) throw new Error(data.message || data.error || 'Erreur de requête.');
      status.textContent = data.message || 'Action effectuée.';
      status.classList.add('success');
      if (form.dataset.apiForm.includes('request-code')) {
        const codeStep = document.querySelector('[data-code-step]');
        const email = form.querySelector('[name="email"]');
        const codeEmail = codeStep?.querySelector('[name="email"]');
        if (codeEmail && email) codeEmail.value = email.value;
        if (codeStep) codeStep.hidden = false;
      }
    } catch (error) {
      status.textContent = error.message || 'Une erreur est survenue.';
      status.classList.add('error');
    } finally {
      button.disabled = false;
    }
  });
});
