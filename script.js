// Sticky nav style
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Count-up stats
const counter = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counter.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));

// Subtle parallax on hero photo
const hp = document.querySelector('.hero-photo img');
if (hp && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('scroll', () => { if (scrollY < innerHeight) hp.style.transform = `translateY(${scrollY * 0.12}px)`; }, { passive: true });
}

// Formspree consultation form (AJAX, falls back to normal POST without JS)
const form = document.getElementById('consult');
if (form) {
  const status = form.querySelector('.status');
  const btn = form.querySelector('.submit');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.action.includes('YOUR_FORM_ID')) {
      status.className = 'status err';
      status.textContent = 'Formspree 폼 ID가 아직 설정되지 않았습니다.';
      return;
    }
    btn.disabled = true; status.className = 'status'; status.textContent = '전송 중...';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { form.reset(); status.textContent = '상담 신청이 접수되었습니다. 곧 연락드리겠습니다.'; }
      else throw new Error();
    } catch {
      status.className = 'status err';
      status.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
    }
    btn.disabled = false;
  });
}
