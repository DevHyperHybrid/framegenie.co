const PROJECTS = [
{
  num: '01',
  name: 'Your AI Videos Aren\'t Bad, Your System Is',
  desc: 'Most creators fail with AI videos because they chase tools instead of building a workflow. This cinematic AI ad breaks down the real problem behind average AI content.'
},
{
  num: '02',
  name: 'I Built Everything… And Lost Us Doing It',
  desc: 'A cinematic emotional confrontation between ambition and love, where success slowly destroys the relationship it was meant to protect.'
},
{
  num: '03',
  name: 'This Is What AI Looks Like in 2026',
  desc: 'AI is no longer robotic or fake-looking. This futuristic cinematic ad showcases how brands now generate premium campaigns through creativity, direction, and AI filmmaking.'
},
{
  num: '04',
  name: 'She Took Care of Everyone Except Herself',
  desc: 'A heartfelt Mother\'s Day AI commercial for BSLC, celebrating the women who give everything and deserve to finally feel cared for too.'
},
{
  num: '05',
  name: 'The KitKat Truck Theft That Became Marketing Genius',
  desc: 'What if the biggest marketing campaigns didn\'t look like ads at all? This AI-generated storytelling piece explores the viral "stolen KitKat truck" phenomenon.'
},
{
  num: '06',
  name: 'Your Treatments Are Tired of Your Expectations',
  desc: 'A funny luxury-clinic AI commercial where aesthetic treatments talk back to impatient clients demanding instant perfection.'
},
{
  num: '07',
  name: 'Ex Tag Challenge',
  desc: 'AI-generated video using subtle motion, dynamic effects, and trending audio to create an engaging short-form social media ad designed to boost retention and shares.'
},
{
  num: '08',
  name: 'I Thought My Pregnant Wife Was Cheating',
  desc: 'A dramatic AI-generated cinematic product ad built like a story filled with suspicion, heartbreak, and an emotional twist that changes everything.'
}];


const TOTAL = PROJECTS.length;
const STACK_TOP = 'var(--project-stack-top)';
const STACK_GAP = 'var(--project-stack-gap)';

const getStackTop = (i) => {
  if (i === 0) return STACK_TOP;
  return `calc(${STACK_TOP} + ${Array.from({ length: i }, () => STACK_GAP).join(' + ')})`;
};

// ar = intrinsic aspect ratio (width / height) of each compressed clip.
// The card frame adopts this so the whole video shows with no bars and no crop.
// poster = tiny WebP first-frame so the card paints instantly with zero video bytes;
// the MP4 itself only downloads when the user presses play (preload="none").
const VIDEO_SOURCES = {
  '1': { src: 'assets/videos/1.mp4', poster: 'assets/videos/posters/1.webp', ar: 720 / 1280 },
  '2': { src: 'assets/videos/2.mp4', poster: 'assets/videos/posters/2.webp', ar: 720 / 1280 },
  '3': { src: 'assets/videos/3.mp4', poster: 'assets/videos/posters/3.webp', ar: 1280 / 720 },
  '4': { src: 'assets/videos/4.mp4', poster: 'assets/videos/posters/4.webp', ar: 714 / 1280 },
  '5': { src: 'assets/videos/5.mp4', poster: 'assets/videos/posters/5.webp', ar: 722 / 1280 },
  '6': { src: 'assets/videos/6.mp4', poster: 'assets/videos/posters/6.webp', ar: 720 / 1280 },
  '7': { src: 'assets/videos/7.mp4', poster: 'assets/videos/posters/7.webp', ar: 712 / 1280 },
  '8': { src: 'assets/videos/8.mp4', poster: 'assets/videos/posters/8.webp', ar: 732 / 1280 },
};


const PlayButton = () => (
  <div style={{
    position: 'relative', zIndex: 1,
    width: 58, height: 58, borderRadius: '50%',
    background: 'rgba(255,255,255,0.14)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1.5px solid rgba(255,255,255,0.32)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}>
      <polygon points="5,3 19,12 5,21" />
    </svg>
  </div>
);

function ProjectVideo({ num, radius }) {
  const source = VIDEO_SOURCES[String(parseInt(num))];
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const videoRef = useRef(null);
  const wrapRef = useRef(null);

  // No preloading: the poster shows the first frame instantly with zero video bytes, and
  // the MP4 only downloads when the user presses play (handlePlay raises preload to 'auto').
  // The clips are faststart + GitHub Pages serves byte ranges, so play() streams from the
  // first chunk without any up-front download (this is what made the page slow before).

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const stop = () => {
      if (!videoRef.current || videoRef.current.paused) return;
      videoRef.current.pause();
      setPlaying(false);
      setBuffering(false);
    };

    // Stop when scrolled out of viewport
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    }, { threshold: 0.2 });
    observer.observe(el);

    // Stop when another card stacks on top and covers this video
    const checkCovered = () => {
      if (!videoRef.current || videoRef.current.paused) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (cy < 0 || cy > window.innerHeight) return;
      const topEl = document.elementFromPoint(cx, cy);
      if (topEl && !el.contains(topEl)) stop();
    };
    window.addEventListener('scroll', checkCovered, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkCovered);
    };
  }, []);

  useEffect(() => {
    const handleStop = (e) => {
      if (e.detail === num) return;
      if (videoRef.current) { videoRef.current.pause(); }
      setPlaying(false);
      setBuffering(false);
    };
    window.addEventListener('projectvideo:play', handleStop);
    return () => window.removeEventListener('projectvideo:play', handleStop);
  }, [num]);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    // Raise preload only now (imperative, not via JSX, so framer-motion re-renders can't
    // revert it). Don't call v.load() — play() starts the fetch; load() would abort/restart it.
    v.preload = 'auto';
    window.dispatchEvent(new CustomEvent('projectvideo:play', { detail: num }));
    setPlaying(true);
    setBuffering(true);
    const p = v.play();
    if (p) p.catch(() => { setPlaying(false); setBuffering(false); });
  };

  const portrait = source.ar < 1;
  const wrapStyle = { borderRadius: radius, border: '1.5px solid rgba(215, 226, 234, 0.35)', background: '#000', '--ar': source.ar };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  };

  return (
    <div ref={wrapRef} className={`project-video-frame relative overflow-hidden ${portrait ? 'is-portrait' : 'is-landscape'}`} style={wrapStyle}>
      <video
        ref={videoRef}
        src={source.src}
        poster={source.poster}
        preload="none"
        playsInline
        controls={playing}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onWaiting={() => setBuffering(true)}
        className="absolute inset-0 w-full h-full object-contain"
        style={{ background: '#000' }}
      />
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ cursor: 'pointer', zIndex: 2 }}
          onClick={handlePlay}>
          <PlayButton />
        </div>
      )}
      {playing && buffering && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 2, background: 'rgba(0,0,0,0.45)' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.18)',
            borderTopColor: 'white',
            animation: 'projectvideo-spin 0.75s linear infinite'
          }} />
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, index, progress }) {
  const targetScale = 1 - (TOTAL - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / TOTAL, 1], [1, targetScale]);
  const imgRadius = 'clamp(20px, 4vw, 60px)';

  return (
    <motion.div
      data-project-card
      style={{
        position: 'sticky',
        top: getStackTop(index),
        zIndex: index + 1,
        scale,
        transformOrigin: 'top center',
        background: '#0C0C0C',
        // scroll runway during which a pinned card rests fully visible before the next covers it
        marginBottom: 'clamp(1.5rem, 8vh, 4.5rem)',
        // Promote to its own GPU layer so the per-scroll scale is a pure composited
        // transform, not a full repaint of the border/rounded corners/text each frame
        // (the sticky+scale-without-a-layer combo is the main mobile scroll flicker).
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
      className="w-full rounded-[40px] border-2 border-[#D7E2EA] p-4 md:p-6 xl:rounded-[60px] xl:p-8">
      
      <div className="project-card-header mb-4 xl:mb-6">
        <span className="project-card-number font-black">{project.num}</span>
        <div className="project-card-title-block flex flex-col gap-1">
          <span className="project-card-title font-medium uppercase">{project.name}</span>
        </div>
        <LiveProjectButton />
      </div>
      <div className="project-media-grid">
        <div className="project-side-column">
          <div className="project-description-card flex flex-col justify-center border border-[#D7E2EA]/30 p-4 xl:p-6" style={{ borderRadius: imgRadius, background: 'rgba(215, 226, 234, 0.04)' }}>
            <p className="project-description-copy font-light leading-relaxed" style={{ color: '#D7E2EA', opacity: 0.78, fontSize: 'clamp(0.78rem, 1.25vw, 1rem)' }}>{project.desc}</p>
          </div>
        </div>
        <div className="project-main-wrap">
          <ProjectVideo num={project.num} radius={imgRadius} />
        </div>
      </div>
    </motion.div>);

}

function ProjectsSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Measure each card's non-video height (header + description + padding) and feed the
  // max back as --project-card-chrome, so the video is capped to exactly fit the
  // staircase on every screen — no overflow, no wasted slack — regardless of how the
  // description text reflows. Chrome is independent of video size, so one pass converges.
  useLayoutEffect(() => {
    const measure = () => {
      const cont = containerRef.current;
      if (!cont) return;
      // --project-frame-cap is declared on the section, so the chrome var must be set
      // there (not on the track) for the cap to pick it up.
      const section = cont.closest('.project-stack-section');
      if (!section) return;
      const cards = [...cont.querySelectorAll('[data-project-card]')];
      if (!cards.length) return;
      // Freeze the viewport height the card/video sizes are computed from. measure() only
      // runs on load + width/orientation changes (not on scroll), so this stays put while
      // the mobile address bar shows/hides — otherwise the layout reshapes mid-scroll and
      // scroll-up vs scroll-down show different states.
      section.style.setProperty('--vph-stable', Math.round(window.innerHeight) + 'px');
      // Equalize via CSS vars (not per-card inline style, which framer-motion clobbers).
      // Reset min-height to 0 so we read natural heights — chrome is the non-video height
      // and must be measured before the cards are padded.
      section.style.setProperty('--project-card-min-h', '0px');
      let maxChrome = 0;
      cards.forEach((c) => {
        const frame = c.querySelector('.project-video-frame');
        if (!frame) return;
        maxChrome = Math.max(maxChrome, c.offsetHeight - frame.offsetHeight);
      });
      if (maxChrome > 0) section.style.setProperty('--project-card-chrome', Math.ceil(maxChrome) + 'px');
      // Reading offsetHeight forces a synchronous reflow with the new cap (videos resized),
      // so the max here reflects final heights. Equalize every card to the tallest so the
      // landscape-video card (#3) matches the portrait cards. Its content is centered (CSS)
      // so the extra height reads as balanced padding, not an empty bottom.
      let maxH = 0;
      cards.forEach((c) => { maxH = Math.max(maxH, c.offsetHeight); });
      if (maxH > 0) section.style.setProperty('--project-card-min-h', Math.round(maxH) + 'px');
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const t = setTimeout(measure, 300);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    // Only re-measure when the width actually changes. On mobile, scrolling toggles the
    // address bar which fires resize with a changed *height* — re-measuring there caused
    // the videos to resize mid-scroll and the scroll to stutter/jump.
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      measure();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section id="projects" className="project-stack-section rounded-t-[40px] -mt-10 z-10 relative px-5 pt-20 pb-32 xl:rounded-t-[60px] xl:-mt-14 xl:px-10 xl:pt-32" style={{ background: '#0C0C0C' }}>
      <FadeIn delay={0} y={40}>
        <h2 className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-3" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>PROJECTS</h2>
        <p className="text-center font-light italic mb-16 xl:mb-28" style={{ color: '#D7E2EA', opacity: 0.38, fontSize: 'clamp(0.7rem, 1.1vw, 0.88rem)' }}>Compressed for preview</p>
      </FadeIn>
      <div ref={containerRef} className="project-scroll-track">
        {PROJECTS.map((p, i) =>
        <ProjectCard key={p.num} project={p} index={i} progress={scrollYProgress} />
        )}
        {/* Runway so the final card reaches its sticky position with a clean, fully
            formed staircase instead of the last cards collapsing onto each other. */}
        <div className="project-stack-runway" aria-hidden="true" />
      </div>
    </section>);

}

function BackToTopButton() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        right: 'clamp(16px, 3vw, 32px)',
        bottom: 'clamp(16px, 3vw, 32px)',
        width: 52,
        height: 52,
        borderRadius: '9999px',
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 16px rgba(181, 1, 167, 0.35), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
        border: 'none',
        cursor: 'pointer',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        zIndex: 50,
        fontFamily: 'inherit'
      }}
      className="back-to-top-button hover:opacity-90">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>);
}

function App() {
  return (
    <div style={{ background: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <BackToTopButton />
    </div>);

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
