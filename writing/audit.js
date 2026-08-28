// Submits the audit lead-magnet form to a Google Apps Script Web App, which
// appends the row to a Sheet and emails the install commands back. Posted
// with mode:'no-cors' since Apps Script Web Apps don't return CORS headers —
// the response is opaque, so success/failure here just means the request
// left the browser, not that the email actually sent.
(function () {
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIuqmUZKP0DnwxpoZpGhEFXU5_Otdet-nuPZcAMZLOui03GmN4XjgF2y7zWltUuprQ/exec';

  var form = document.getElementById('audit-form');
  if (!form) return;

  var status = document.getElementById('audit-status');
  var submitBtn = document.getElementById('audit-submit');

  function showStatus(message, isError) {
    status.textContent = message;
    status.className = 'audit-status show' + (isError ? ' error' : '');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (SCRIPT_URL.indexOf('REPLACE_WITH') === 0) {
      showStatus('Form isn’t wired up yet — use the commands above directly for now.', true);
      return;
    }

    var payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      problem: form.problem.value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: 'audit-form-submit', title: 'Audit form submitted', event: true });
    }

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function () {
      form.style.display = 'none';
      showStatus('Sent — check ' + payload.email + ' for the commands.', false);
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send it to me';
      showStatus('Something went wrong sending that — try again, or just use the commands above.', true);
    });
  });
})();
