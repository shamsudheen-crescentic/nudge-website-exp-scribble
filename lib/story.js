// Page behaviour, ported from the original inline <script>. Runs once on the
// client after mount and returns a cleanup function.
export function initStory() {
  const cleanups = [];
  const on = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts);
    cleanups.push(() => target.removeEventListener(type, fn, opts));
  };

  // Intro: page stays locked while the scribble draws, then unlocks after 2.6s
  // or on the first wheel / touch / key input.
  (() => {
    const root = document.documentElement;
    const header = document.getElementById('header');
    const events = ['wheel', 'touchmove', 'keydown'];
    root.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    const unlock = () => {
      root.style.overflow = '';
      header.classList.remove('intro', 'animate-reveal');
      document.getElementById('m-thread-svg').classList.add('on');
      document.querySelectorAll('.hero .animate-reveal, .mobile .animate-reveal').forEach(el => el.classList.remove('animate-reveal'));
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, unlock));
    };
    const timer = setTimeout(unlock, 2600);
    events.forEach(e => window.addEventListener(e, unlock, { passive: true }));
    cleanups.push(() => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, unlock));
      root.style.overflow = '';
    });
    const menuBtn = document.getElementById('menu-btn'), menu = document.getElementById('menu');
    const setMenu = open => {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    on(menuBtn, 'click', () => setMenu(menu.hidden));
    // [track position in vw, mobile section id] for each nav target.
    const GO = { brain: [0, 'brain'], features: [298, 'm-features'], how: [412, 'm-how'], start: [470, 'm-start'] };
    document.querySelectorAll('[data-go]').forEach(b =>
      on(b, 'click', () => {
        const [vw, id] = GO[b.dataset.go];
        if (innerWidth >= 768) {
          const s = document.getElementById('brain');
          scrollTo({ top: s.offsetTop + (s.offsetHeight - innerHeight) * vw / 470, behavior: 'smooth' });
        } else document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        setMenu(false);
      }));
  })();

  // Horizontal story: vertical scroll through #brain slides the track left,
  // and the thread unrolls out of the scribble with a dot riding its tip.
  (() => {
    const TRAVEL_VW = 470;                   // distance the 570vw track travels
    const LEAD = .55, EASE = .085;           // thread tip leads at 55% of the screen; smoothing factor
    // Thread waypoints in vw / vh units: [x, y, loop?] — a third value draws a small loop.
    const POINTS = [[56.9,19.9],[80,58],[98,50],[110,44,8],[120,66],[132,68],[142,66,-6],[151,56],[156,40],[164,29],[171,33],[174.5,35.6],[181,42],[186,62],[198,68],[205,68],[216,50],[229,34],[233,50],[250,58],[262,70],[272,88],[292,54],[304,48],[322,51],[340,52],[358,50],[376,46],[394,43],[410,46],[422,60],[440,70],[458,71],[474,70,17],[496,76],[514,78],[528,70],[537,59]];

    // Catmull-Rom through the waypoints -> cubic bezier segments.
    const toSegments = (pts, scale = 10, squash = 1.8) => {
      const r = [];
      for (const [px, py, loop] of pts) {
        const x = px * scale, y = py * scale;
        r.push([x, y]);
        if (loop) {
          const h = loop * scale, w = Math.abs(h) / squash;
          r.push([x + w, y - h], [x, y - 2 * h], [x - w, y - h], [x + w * .5, y + h * .15]);
        }
      }
      const segs = [];
      for (let i = 0; i < r.length - 1; i++) {
        const p0 = r[i - 1] ?? r[i], p1 = r[i], p2 = r[i + 1], p3 = r[i + 2] ?? p2;
        segs.push([p1[0], p1[1], p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
          p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]]);
      }
      return segs;
    };
    const toPath = segs => {
      const f = n => n.toFixed(1);
      let d = `M${segs[0][0]} ${segs[0][1]}`;
      for (const [, , a, b, c, e, g, h] of segs) d += ` C${f(a)} ${f(b)} ${f(c)} ${f(e)} ${f(g)} ${f(h)}`;
      return d;
    };
    // Sample the curve so we can map an x position to a length along the path.
    const sample = (segs, steps = 48) => {
      const n = segs.length * steps + 1, xs = new Float32Array(n), ys = new Float32Array(n), lens = new Float32Array(n);
      let k = 0, total = 0;
      segs.forEach(([x0, y0, c1x, c1y, c2x, c2y, x1, y1], si) => {
        for (let s = si === 0 ? 0 : 1; s <= steps; s++) {
          const t = s / steps, u = 1 - t;
          const x = u*u*u*x0 + 3*u*u*t*c1x + 3*u*t*t*c2x + t*t*t*x1;
          const y = u*u*u*y0 + 3*u*u*t*c1y + 3*u*t*t*c2y + t*t*t*y1;
          if (k > 0) total += Math.hypot(x - xs[k - 1], y - ys[k - 1]);
          xs[k] = x; ys[k] = y; lens[k] = total; k++;
        }
      });
      return { xs, ys, lens, total };
    };

    const segs = toSegments(POINTS);
    const thread = document.getElementById('thread');
    const dot = document.getElementById('thread-dot');
    thread.setAttribute('d', toPath(segs));
    const { xs, ys, lens, total } = sample(segs);
    const last = xs.length - 1;

    const drawThread = p => {
      const tail = Math.max(0, (p - .9) / .1) * 150;          // finish the last stretch at the very end
      const tipX = p * TRAVEL_VW * 10 + LEAD * 1000 + tail;
      let i = 0;
      while (i < last && xs[i] < tipX) i++;
      const len = lens[i] ?? total;
      thread.style.strokeDashoffset = `${1 - len / total}`;
      dot.setAttribute('cx', xs[i]);
      dot.setAttribute('cy', ys[i]);
      dot.style.opacity = len <= 0 || len >= total * .999 ? '0' : '1';
    };

    const section = document.getElementById('brain');
    const track = document.getElementById('track');
    // Desktop pieces fade in as the screen (or the thread tip, for data-mode="thread") reaches their data-at (vw).
    const atEls = [...track.querySelectorAll('[data-at]')];
    const revealDesktop = shift => {
      for (const el of atEls) {
        const edge = el.dataset.mode === 'thread' ? shift + LEAD * 100 : shift + 96;
        el.toggleAttribute('data-shown', edge >= +el.dataset.at);
      }
    };
    let current = -1, frame = 0;
    const tick = () => {
      const range = Math.max(section.offsetHeight - innerHeight, 1);
      const target = Math.min(1, Math.max(0, (scrollY - section.offsetTop) / range));
      const next = current < 0 || Math.abs(target - current) < 5e-5 ? target : current + (target - current) * EASE;
      if (next !== current) {
        current = next;
        if (innerWidth >= 768) {
          track.style.transform = `translate3d(-${current * TRAVEL_VW}vw,0,0)`;
          revealDesktop(current * TRAVEL_VW);
        }
        drawThread(current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    cleanups.push(() => cancelAnimationFrame(frame));

    // Mobile: thread starts at the scribble's loose end and runs through the
    // [data-anchor] points; it draws down as the page scrolls.
    const mobile = document.getElementById('mobile');
    const mSvg = document.getElementById('m-thread-svg');
    const mThread = document.getElementById('m-thread');
    const mDot = document.getElementById('m-thread-dot');
    const scribble = document.getElementById('m-scribble');
    let mSamples = null, disposed = false;
    const layoutMobile = () => {
      if (disposed || mobile.offsetParent === null) return;
      const box = mobile.getBoundingClientRect(), sb = scribble.getBoundingClientRect();
      const k = Math.min(sb.width / 550, sb.height / 600);  // viewBox 250 100 550 600, scribble end at (569,199)
      const pts = [[sb.left - box.left + (sb.width - 550 * k) / 2 + 319 * k, sb.top - box.top + (sb.height - 600 * k) / 2 + 99 * k]];
      mobile.querySelectorAll('[data-anchor]').forEach(a => {
        const r = a.getBoundingClientRect(), loop = Number(a.dataset.anchor);
        pts.push(loop ? [r.left - box.left, r.top - box.top, loop] : [r.left - box.left, r.top - box.top]);
      });
      const mSegs = toSegments(pts, 1, 1);
      mSamples = sample(mSegs, 24);
      mThread.setAttribute('d', toPath(mSegs));
      mSvg.setAttribute('width', box.width);
      mSvg.setAttribute('height', box.height);
      mSvg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      drawMobile();
    };
    const drawMobile = () => {
      if (!mSamples) return;
      const { xs, ys, lens, total } = mSamples;
      const top = mobile.getBoundingClientRect().top;
      const tipY = Math.min(innerHeight * .7 - top, ys[0] + Math.max(0, -top) * 1.4);
      let i = 0;
      while (i < xs.length - 1 && ys[i] < tipY) i++;
      const len = lens[i] ?? 0;
      mThread.style.strokeDashoffset = `${1 - len / total}`;
      mDot.setAttribute('cx', xs[i]);
      mDot.setAttribute('cy', ys[i]);
      mDot.style.opacity = len > 0 && len < total * .999 ? '1' : '0';
    };
    // Climber hangs on the thread; drag it sideways to slide it along.
    const climber = document.getElementById('m-climber');
    const CLIMB_TOP = 1260;
    let climbT = .55;
    const restClimber = () => {
      climber.style.left = `${climbT * 100}%`;
      climber.style.top = `${CLIMB_TOP + 40 * climbT + Math.sin(climbT * Math.PI) * 14}px`;
    };
    restClimber();
    const climbTo = clientX => {
      const block = climber.parentElement, r = block.getBoundingClientRect();
      if (!mSamples) return;
      const want = Math.min(r.width * .84, Math.max(r.width * .2, clientX - r.left));
      const { xs, ys } = mSamples, top = block.offsetTop;
      let best = -1;
      for (let i = 0; i < xs.length; i++) {
        const y = ys[i] - top, x = xs[i];
        if (y < 1170 || y > 1390 || x < r.width * .2 || x > r.width * .84) continue;
        if (best < 0 || Math.abs(x - want) < Math.abs(xs[best] - want)) best = i;
      }
      if (best < 0) return;
      climbT = xs[best] / r.width;
      climber.style.left = `${xs[best]}px`;
      climber.style.top = `${ys[best] - top}px`;
    };
    const climbFloat = climber.querySelector('.float'), climbBubble = climber.querySelector('.bubble');
    climbFloat.classList.add('hang');
    const climbLabel = () => {
      climbBubble.classList.toggle('left', climbT < .35);
      climbBubble.classList.toggle('right', climbT > .65);
    };
    on(climber, 'pointerdown', e => {
      climber.setPointerCapture(e.pointerId);
      climber.classList.add('dragging');
      climbFloat.classList.replace('hang', 'still');
    });
    on(climber, 'pointermove', e => { if (climber.classList.contains('dragging')) { climbTo(e.clientX); climbLabel(); } });
    const climbEnd = () => { climber.classList.remove('dragging'); climbFloat.classList.replace('still', 'hang'); };
    on(climber, 'pointerup', climbEnd);
    on(climber, 'pointercancel', climbEnd);

    // Fade story pieces in as they scroll into view.
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.setAttribute('data-shown', ''); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: .15 });
    mobile.querySelectorAll('.reveal').forEach(el => io.observe(el));
    cleanups.push(() => io.disconnect());

    let raf = 0;
    on(window, 'scroll', () => { raf ||= requestAnimationFrame(() => { raf = 0; drawMobile(); }); }, { passive: true });
    on(window, 'resize', layoutMobile);
    cleanups.push(() => { disposed = true; cancelAnimationFrame(raf); });
    layoutMobile();
    document.fonts?.ready.then(layoutMobile);
  })();

  // Floating objects: tilt toward the pointer, and type out their label in a
  // speech bubble on hover (tap on touch screens). Only one bubble open at a time.
  (() => {
    let openFig = null;
    const close = fig => {
      fig.classList.remove('open');
      clearInterval(fig._typing);
      fig.querySelector('.bubble span').textContent = '';
      if (openFig === fig) openFig = null;
    };
    const open = fig => {
      if (openFig && openFig !== fig) close(openFig);
      openFig = fig;
      const bubble = fig.querySelector('.bubble'), text = fig.dataset.label, out = bubble.querySelector('span');
      if (innerWidth < 768 && !fig.parentElement.classList.contains('m-climber')) {
        const r = fig.getBoundingClientRect(), mid = r.left + r.width / 2;
        bubble.classList.toggle('left', mid < 140);
        bubble.classList.toggle('right', mid > innerWidth - 140);
      }
      fig.classList.add('open');
      clearInterval(fig._typing);
      let n = 0;
      out.textContent = '';
      fig._typing = setInterval(() => { out.textContent = text.slice(0, ++n); if (n >= text.length) clearInterval(fig._typing); }, 26);
    };
    const figs = document.querySelectorAll('.figure');
    figs.forEach(fig => {
      const img = fig.querySelector('img');
      const tilt = (x, y) => {
        img.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 14}deg) scale(${fig.classList.contains('open') ? 1.08 : 1}) translateZ(0)`;
      };
      on(fig, 'pointerenter', e => { if (e.pointerType !== 'touch') { open(fig); tilt(0, 0); } });
      on(fig, 'pointerleave', e => { if (e.pointerType !== 'touch') { close(fig); tilt(0, 0); } });
      on(fig, 'pointermove', e => {
        const r = fig.getBoundingClientRect();
        tilt(((e.clientX - r.left) / r.width - .5) * 2, ((e.clientY - r.top) / r.height - .5) * 2);
      });
      on(fig, 'pointerdown', e => {
        if (e.pointerType !== 'touch') return;
        open(fig);
        clearTimeout(fig._hide);
        fig._hide = setTimeout(() => close(fig), 2500);
      });
    });
    on(window, 'pointerdown', e => {
      if (e.pointerType === 'touch' && openFig && !openFig.contains(e.target)) close(openFig);
    });
    cleanups.push(() => figs.forEach(fig => { clearInterval(fig._typing); clearTimeout(fig._hide); }));
  })();

  return () => cleanups.forEach(fn => fn());
}
