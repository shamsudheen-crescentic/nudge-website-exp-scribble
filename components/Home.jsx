'use client';

import { useEffect } from 'react';
import Figure from '@/components/Figure';
import Scribble from '@/components/Scribble';
import { NoteArrow, ButtonArrow } from '@/components/Arrow';
import { initStory } from '@/lib/story';

const TIMELINE = [
  ['8:00 am · daily nudge', 'a gentle ping.', 'a daily nudge notification checks in before the spiral starts.'],
  ['9:15 am · mood check-in', "one tap. that's it.", 'a quick mood check-in, right from your home screen widget.'],
  ['11:40 am · the tab situation', 'you spill it.', "23 tabs, one decision. nudge asks what you'd pick if you had to choose right now."],
  ['11:52 am · one small step', '22 tabs closed.', 'the decision took four minutes. the drama took three weeks.'],
  ['6:30 pm · conversation history', "it's all still there.", 'what you were stuck on, and how you got unstuck.'],
  ['tomorrow · memory', 'it remembers you.', 'memory that learns about you, so the next nudge fits a little better.'],
];

// Desktop timeline placement: [vw, tick top vh, knot top vh, card position].
const TIMELINE_DESKTOP = [
  [304, 37, 48, { bottom: '64vh' }],
  [322, 51, 51, { top: '63vh' }],
  [340, 41, 52, { bottom: '60vh' }],
  [358, 50, 50, { top: '62vh' }],
  [376, 35, 46, { bottom: '66vh' }],
  [394, 43, 43, { top: '55vh' }],
];

const display3 = { fontSize: '3rem', whiteSpace: 'nowrap', lineHeight: 1 };

export default function Home() {
  useEffect(() => initStory(), []);

  return (
    <main>
      <header className="intro animate-reveal" id="header">
        <button className="logo" aria-label="Back to top" data-go="brain">nudge</button>
        <nav aria-label="Main navigation">
          <button className="story-link" data-go="features">features</button>
          <button className="story-link" data-go="how">how it works</button>
          <button className="story-link" data-go="start">start free trial</button>
        </nav>
        <button className="menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
        <nav className="menu" id="menu" hidden>
          <button data-go="features">features</button>
          <button data-go="how">how it works</button>
          <button data-go="start">start free trial</button>
        </nav>
      </header>

      <section id="brain">
        <div className="stage">
          <div className="track" id="track">
            <svg className="thread" aria-hidden="true" viewBox="0 0 5700 1000" preserveAspectRatio="none">
              <path id="thread" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: 1 }} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <Scribble />
              <circle id="thread-dot" r="9" cx="569" cy="199" style={{ opacity: 0 }} fill="currentColor" />
            </svg>
            <div className="layer">
              <div className="hero">
                <div className="anatomy animate-reveal d220">
                  <p>stop<br />overthinking.<br /><em>start doing.</em></p>
                </div>
                <div className="note animate-reveal d220">
                  <NoteArrow />
                  <span>an almost accurate map of your head at 2am.</span>
                </div>
                <div className="welcome animate-reveal d235">
                  <p style={{ maxWidth: '20rem', marginLeft: 'auto' }}>the friend who calls you out (kindly) and helps you take the one small step that gets you moving.</p>
                  <button className="btn btn-paper" data-go="how">how it works</button>
                  <button className="btn btn-ink" data-go="start">start free trial</button>
                </div>
              </div>

              {/* chapter 1 · jack of all trades (100–175vw) */}
              <div className="at" style={{ left: '100vw', top: '6vh' }}><Figure label="tab 38 of 'best desk chair 2026'." delay="0s" /></div>
              <div className="at" style={{ left: '101vw', top: '62vh' }}><Figure label="screenshotted the to-do list. that counts, right?" delay=".8s" /></div>
              <div className="at reveal" style={{ left: '116vw', top: '36vh', width: '34vw', textAlign: 'center' }} data-at="122">
                <p className="muted" style={{ fontSize: '1.125rem' }}>stuck in your head?</p>
                <h2 className="d-display" style={{ whiteSpace: 'nowrap' }}>we&apos;ve all been there.</h2>
                <p className="muted" style={{ fontSize: '1.125rem', marginTop: '.5rem' }}>hours on a simple decision. the same tabs, open for weeks. a 10-minute task, avoided for a month.</p>
              </div>
              <div className="at" style={{ left: '121vw', top: '73vh' }}><Figure label="head of procrastination." delay="1.2s" /></div>
              <div className="at" style={{ left: '134vw', top: '10vh' }}><Figure label="rewriting the same email. again." delay=".4s" /></div>
              <div className="at" style={{ left: '150vw', top: '66vh' }}><Figure label="the ball's in your court." delay="1.6s" /></div>
              <div className="d-climber"><Figure label="hanging on by a thread." size="fill" floatClass="hang" /></div>

              {/* chapter 2 · few things have my heart (180–290vw) */}
              <div className="at reveal" style={{ left: '182vw', top: '12vh', width: '22rem' }} data-at="184">
                <h2 className="d-display" style={{ lineHeight: 1 }}>so, meet nudge.</h2>
              </div>
              <div className="at reveal d-love" style={{ left: '190vw', top: '70vh' }} data-at="194">
                <Figure label="the world can wait five minutes." />
                <div className="copy"><p className="d-big">a friend, not a coach.</p><p>it calls you out (kindly) and helps you move forward.</p></div>
              </div>
              <div className="at reveal d-love" style={{ left: '212vw', top: '6vh' }} data-at="216">
                <Figure label="i'm listening. go on." delay=".5s" />
                <div className="copy"><p className="d-big">no productivity guilt.</p><p>not hustle culture. not optimizing your life.</p></div>
              </div>
              <div className="at reveal d-love" style={{ left: '250vw', top: '28vh' }} data-at="254">
                <Figure label="it's loud in here." delay="1s" />
                <div className="copy"><p className="d-big">fewer stories. more living.</p><p>get unstuck from the stories we tell ourselves, and get back to your day.</p></div>
              </div>

              {/* chapter 3 · timeline (300–410vw): knots sit on the thread waypoints */}
              {TIMELINE_DESKTOP.map(([vw, tick, knot, card], i) => {
                const [year, title, body] = TIMELINE[i];
                return (
                  <div className="reveal" data-at={vw} key={vw}>
                    <span className="d-tick" style={{ left: `${vw}vw`, top: `${tick}vh` }}></span>
                    <span className="d-knot" style={{ left: `${vw}vw`, top: `${knot}vh` }}></span>
                    <div className="d-card" style={{ left: `${vw}vw`, ...card }}><p className="year">{year}</p><p className="title">{title}</p><p className="body">{body}</p></div>
                  </div>
                );
              })}
              <div className="at reveal" style={{ left: '302vw', top: '84vh' }} data-at="302">
                <p className="d-display" style={display3}>turns out, <span className="muted">it was never...</span></p>
              </div>
              <div className="at reveal" style={{ left: '348vw', top: '84vh' }} data-at="350">
                <p className="d-display" style={display3}><span className="muted">...that</span> deep.</p>
              </div>
              <div className="at reveal" style={{ left: '382vw', top: '80vh', maxWidth: '22rem' }} data-at="384">
                <p>the decision was never the hard part.</p>
                <p className="muted">the story we told ourselves about it was.</p>
              </div>

              {/* chapter 4 · the loop (415–490vw) */}
              <div className="at reveal" style={{ left: '416vw', top: '16vh', width: '26rem' }} data-at="424">
                <p className="d-display" style={{ lineHeight: 1.05 }}>how it works. <span className="muted">no hustle required.</span></p>
              </div>
              <div className="reveal" data-mode="thread" data-at="470"><span className="d-dot" style={{ left: '474vw', top: '70vh' }}></span><p className="d-lbl" style={{ left: '474vw', top: '70vh', translate: '-50% 1rem' }}>share what&apos;s on your mind.</p></div>
              <div className="reveal" data-mode="thread" data-at="483"><span className="d-dot" style={{ left: '483.44vw', top: '53vh' }}></span><p className="d-lbl" style={{ left: '483.44vw', top: '53vh', translate: '1.25rem -50%' }}>get a fresh perspective.</p></div>
              <div className="reveal" data-mode="thread" data-at="486" style={{ '--reveal-delay': '.3s' }}><span className="d-dot" style={{ left: '474vw', top: '36vh' }}></span><p className="d-lbl" style={{ left: '474vw', top: '36vh', translate: '-50% calc(-100% - 1rem)' }}>take the simplest next step.</p></div>
              <div className="reveal" data-mode="thread" data-at="486" style={{ '--reveal-delay': '.6s' }}><span className="d-dot" style={{ left: '464.56vw', top: '53vh' }}></span><p className="d-lbl" style={{ left: '464.56vw', top: '53vh', translate: 'calc(-100% - 1.25rem) -50%' }}>get back to living.</p></div>
              <p className="at reveal" data-mode="thread" data-at="486" style={{ left: '474vw', top: '53vh', translate: '-50% -50%', fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '2.25rem', '--reveal-delay': '1s' }}>repeat.</p>

              {/* chapter 5 · outro (510–570vw) */}
              <div className="at reveal" style={{ left: '512vw', top: '18vh' }} data-at="516">
                <p className="muted" style={{ fontSize: '1.125rem' }}>enough thinking about it.</p>
                <h2 className="d-display" style={{ marginTop: '.75rem', maxWidth: '30rem' }}>start your free trial today.</h2>
              </div>
              <div className="at reveal" style={{ left: '537vw', top: '59vh', translate: '1.5rem -50%' }} data-at="530">
                <a className="btn btn-ink" href="#">start free trial <ButtonArrow /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="mobile" id="mobile">
          <svg className="m-thread" id="m-thread-svg" aria-hidden="true">
            <path id="m-thread" pathLength="1" strokeDasharray="1" style={{ strokeDashoffset: 1 }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle id="m-thread-dot" r="4.5" cx="0" cy="0" style={{ opacity: 0 }} fill="currentColor" />
          </svg>
          <div className="m-hero">
            <svg className="m-scribble" id="m-scribble" aria-hidden="true" viewBox="250 100 550 600">
              <Scribble />
            </svg>
            <div className="m-note animate-reveal d220">
              <NoteArrow />
              <span>an almost accurate map of your head at 2am.</span>
            </div>
            <p className="m-anatomy animate-reveal d220">stop<br />overthinking.<br /><em>start doing.</em></p>
            <span className="anchor" data-anchor="" style={{ left: '86%', top: '66svh' }}></span>
            <span className="anchor" data-anchor="" style={{ left: '93%', top: '122svh' }}></span>
          </div>
          <div className="m-trades">
            <div className="obj" style={{ left: '3%', top: '20px' }}><Figure label="tab 38 of 'best desk chair 2026'." delay="0s" /><span className="anchor" data-anchor="" style={{ left: '50%', top: '50%' }}></span></div>
            <div className="obj" style={{ right: '5%', top: '190px' }}><Figure label="rewriting the same email. again." delay=".4s" /><span className="anchor" data-anchor="" style={{ left: '50%', top: '50%' }}></span></div>
            <span className="anchor" data-anchor="" style={{ left: '95%', top: '400px' }}></span>
            <div className="center reveal">
              <p className="muted">stuck in your head?</p>
              <h2>we&apos;ve all been there.</h2>
              <p className="muted" style={{ marginTop: '.25rem', fontSize: '.875rem' }}>hours on a simple decision. the same tabs, open for weeks. a 10-minute task, avoided for a month.</p>
            </div>
            <span className="anchor" data-anchor="" style={{ left: '95%', top: '590px' }}></span>
            <div className="obj" style={{ left: '4%', top: '630px' }}><Figure label="screenshotted the to-do list. that counts, right?" delay=".8s" /><span className="anchor" data-anchor="" style={{ left: '50%', top: '50%' }}></span></div>
            <div className="obj" style={{ right: '3%', top: '820px' }}><Figure label="head of procrastination." delay="1.2s" /><span className="anchor" data-anchor="" style={{ left: '50%', top: '50%' }}></span></div>
            <div className="obj" style={{ left: '6%', top: '1010px' }}><Figure label="the ball's in your court." delay="1.6s" /><span className="anchor" data-anchor="" style={{ left: '50%', top: '50%' }}></span></div>
            <span className="anchor" data-anchor="" style={{ left: '4%', top: '1260px' }}></span>
            <div className="m-climber" id="m-climber"><Figure label="hanging on by a thread." size="fill" delay="0s" /></div>
            <span className="anchor" data-anchor="" style={{ left: '96%', top: '1300px' }}></span>
          </div>

          <div className="m-heart">
            <span className="anchor" data-anchor="" style={{ left: '5%', top: 0 }}></span>
            <span className="anchor" data-anchor="" style={{ left: '5%', top: '110px' }}></span>
            <h2 className="reveal">so, meet<br />nudge.</h2>
            <div className="m-love reveal">
              <div className="fig-wrap"><Figure label="the world can wait five minutes." delay="0.0s" /><span className="anchor" data-anchor="" style={{ left: '50%', top: '50%' }}></span></div>
              <p className="title">a friend, not a coach.</p>
              <p className="body">it calls you out (kindly) and helps you move forward.</p>
              <span className="anchor" data-anchor="" style={{ left: '-0.25rem', top: 'calc(100% + 0.75rem)' }}></span>
            </div>
            <div className="m-love reveal alt">
              <div className="fig-wrap"><Figure label="i'm listening. go on." delay="0.5s" /><span className="anchor" data-anchor="" style={{ left: '50%', top: '50%' }}></span></div>
              <p className="title">no productivity guilt.</p>
              <p className="body">not hustle culture. not optimizing your life.</p>
              <span className="anchor" data-anchor="" style={{ left: 'calc(100% + 0.25rem)', top: 'calc(100% + 0.75rem)' }}></span>
            </div>
            <div className="m-love reveal">
              <div className="fig-wrap"><Figure label="it's loud in here." delay="1.0s" /><span className="anchor" data-anchor="" style={{ left: '50%', top: '50%' }}></span></div>
              <p className="title">fewer stories. more living.</p>
              <p className="body">get unstuck from the stories we tell ourselves, and get back to your day.</p>
              <span className="anchor" data-anchor="" style={{ left: '-0.25rem', top: 'calc(100% + 0.75rem)' }}></span>
            </div>
          </div>

          <div className="m-timeline" id="m-features">
            <span className="anchor" data-anchor="" style={{ left: '6%', top: '-20px' }}></span>
            <p className="lead reveal">a day<br /><span className="muted">with nudge.</span></p>
            <ol>
              {TIMELINE.map(([year, title, body]) => (
                <li className="reveal" key={year}><span className="pin" data-anchor=""></span><span className="tick" aria-hidden="true"></span><span className="pip" aria-hidden="true"></span><p>{title}</p><p className="line">{body}</p><p className="year">{year}</p></li>
              ))}
            </ol>
            <span className="anchor" data-anchor="" style={{ left: '6%', top: '100%' }}></span>
          </div>

          <div className="m-own">
            <p className="big reveal"><span className="muted">turns out, it was never</span> that deep.</p>
            <div className="small reveal">
              <p>the decision was never the hard part.</p>
              <p className="muted">the story we told ourselves about it was.</p>
            </div>
            <span className="anchor" data-anchor="" style={{ left: '5%', top: 'calc(100% + 1rem)' }}></span>
          </div>

          <div className="m-loop" id="m-how">
            <span className="anchor" data-anchor="" style={{ left: '89%', top: '-24px' }}></span>
            <span className="anchor" data-anchor="" style={{ left: '90%', top: '150px' }}></span>
            <p className="big reveal">how it works. <span className="muted">no hustle required.</span></p>
            <div className="ring reveal">
              <span className="anchor" data-anchor="" style={{ left: '86%', top: '205px' }}></span>
              <span className="anchor" data-anchor="70" style={{ left: '50%', top: '230px' }}></span>
              <span style={{ left: '50%', top: '230px', translate: '-50% .75rem' }}>share what&apos;s on your mind.</span>
              <span style={{ left: 'calc(50% + 80px)', top: '160px', translate: '0 -50%' }}>get a fresh<br />perspective.</span>
              <span style={{ left: '50%', top: '90px', translate: '-50% calc(-100% - .6rem)' }}>take one small step.</span>
              <span style={{ left: 'calc(50% - 70px)', top: '160px', translate: 'calc(-100% - .6rem) -50%', textAlign: 'right' }}>get back<br />to living.</span>
              <span className="repeat" style={{ left: '50%', top: '160px' }}>repeat.</span>
            </div>
          </div>

          <div className="m-cta" id="m-start">
            <span className="anchor" data-anchor="" style={{ left: '94%', top: '40px' }}></span>
            <p className="reveal muted" style={{ fontSize: '.875rem' }}>enough thinking about it.</p>
            <h2 className="reveal">start your free<br />trial today.</h2>
            <div className="btn-wrap">
              <span className="anchor" data-anchor="" style={{ left: 'calc(100% + 2.75rem)', top: '-.25rem' }}></span>
              <span className="anchor" data-anchor="" style={{ left: '100%', top: '50%' }}></span>
              <a className="btn btn-ink" href="#">start free trial <ButtonArrow /></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
