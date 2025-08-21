// Minimal JS for countdown, email capture (local only), and year update
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Countdown: set a target date ~60 days from now by default
  const target = new Date();
  target.setDate(target.getDate() + 60);

  const pad2 = (n) => String(n).padStart(2, '0');
  const ids = ['days', 'hours', 'minutes', 'seconds'];
  const spans = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

  function tick() {
    const now = new Date();
    let diff = Math.max(0, target - now);

    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;

    if (spans.days) spans.days.textContent = pad2(days);
    if (spans.hours) spans.hours.textContent = pad2(hours);
    if (spans.minutes) spans.minutes.textContent = pad2(minutes);
    if (spans.seconds) spans.seconds.textContent = pad2(seconds);
  }
  tick();
  setInterval(tick, 1000);

  // Email capture: store locally and show a status message
  const form = document.getElementById('notify-form');
  const emailInput = document.getElementById('email');
  const msg = document.getElementById('form-message');

  function setMsg(text, cls) {
    if (!msg) return;
    msg.textContent = text || '';
    msg.className = 'form-message ' + (cls || '');
  }

  if (form && emailInput) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return setMsg('Please enter a valid email.', 'err');

      // Basic email regex
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!ok) return setMsg('That email doesn\'t look right.', 'err');

      try {
        const key = 'genzbazarbd_notify_list';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        if (!list.includes(email)) list.push(email);
        localStorage.setItem(key, JSON.stringify(list));
        setMsg('Thanks! We\'ll keep you posted.', 'ok');
        form.reset();
      } catch (err) {
        setMsg('Saved locally. You can screenshot this as a reminder.', 'ok');
      }
    });
  }
})();
