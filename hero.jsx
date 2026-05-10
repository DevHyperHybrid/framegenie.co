function HeroSection() {
  const sectionRef = useRef(null);
  const followZoneRef = useRef(null);
  const portraitRef = useRef(null);
  const portraitX = useMotionValue(0);
  const portraitY = useMotionValue(0);
  const smoothX = useSpring(portraitX, { stiffness: 220, damping: 24, mass: 0.35 });
  const smoothY = useSpring(portraitY, { stiffness: 220, damping: 24, mass: 0.35 });

  const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);

  const navLinks = ['About', 'Services', 'Projects', 'Contact'];
  const [activeSection, setActiveSection] = useState('');
  const heroTitleCopies = Array.from({ length: 4 }, (_, i) => i);

  const getBoundedPortraitPosition = useCallback((cx, cy) => {
    const section = sectionRef.current;
    const followZone = followZoneRef.current;
    if (!section || !followZone) return null;
    const sR = section.getBoundingClientRect();
    const zR = followZone.getBoundingClientRect();
    const pR = portraitRef.current?.getBoundingClientRect();
    const phw = Math.min((pR?.width ?? 0) / 2, zR.width / 2);
    const phh = Math.min((pR?.height ?? 0) / 2, zR.height / 2);
    const bx = clamp(cx, zR.left + phw, zR.right - phw);
    const by = clamp(cy, zR.top + phh, zR.bottom - phh);
    return { x: bx - sR.left, y: by - sR.top };
  }, []);

  const isInside = useCallback((cx, cy) => {
    const z = followZoneRef.current;
    if (!z) return false;
    const r = z.getBoundingClientRect();
    return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
  }, []);

  const movePortraitHome = useCallback(() => {
    const z = followZoneRef.current;
    if (!z) return;
    const r = z.getBoundingClientRect();
    const p = getBoundedPortraitPosition(r.left + r.width / 2, r.top + r.height / 2);
    if (!p) return;
    portraitX.set(p.x);
    portraitY.set(p.y);
  }, [getBoundedPortraitPosition, portraitX, portraitY]);

  const handlePointerMove = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    if (!isInside(e.clientX, e.clientY)) return;
    const p = getBoundedPortraitPosition(e.clientX, e.clientY);
    if (!p) return;
    portraitX.set(p.x);
    portraitY.set(p.y);
  }, [getBoundedPortraitPosition, isInside, portraitX, portraitY]);

  const updateMobileScrollPortrait = useCallback(() => {
    const isNonDesktop = window.matchMedia('(max-width: 1279px)').matches ||
      window.matchMedia('(orientation: landscape) and (max-width: 1300px) and (max-height: 900px)').matches;
    if (!isNonDesktop) return;
    const section = sectionRef.current;
    const z = followZoneRef.current;
    if (!section || !z) return;
    const sR = section.getBoundingClientRect();
    if (sR.bottom <= 0 || sR.top >= window.innerHeight) return;
    const zR = z.getBoundingClientRect();
    const progress = clamp(-sR.top / sR.height, 0, 1);
    const isTablet = window.matchMedia('(min-width: 768px)').matches;
    let cx, cy;
    if (isTablet) {
      const driftX = Math.sin(progress * Math.PI * 2) * zR.width * 0.16;
      cx = zR.left + zR.width / 2 + driftX;
      cy = zR.top + zR.height * (0.48 + progress * 0.06);
    } else {
      // 1.5 sine oscillations across the scroll → portrait swings left/right
      const driftX = Math.sin(progress * Math.PI * 3) * zR.width * 0.38;
      cx = zR.left + zR.width / 2 + driftX;
      // parallax: portrait rises as hero scrolls off screen
      cy = zR.top + zR.height * (0.44 + progress * 0.22);
    }
    const p = getBoundedPortraitPosition(cx, cy);
    if (!p) return;
    portraitX.set(p.x);
    portraitY.set(p.y);
  }, [getBoundedPortraitPosition, portraitX, portraitY]);

  const handlePointerEnd = useCallback((e) => {
    if (e.pointerType === 'touch') {
      updateMobileScrollPortrait();
      return;
    }
    movePortraitHome();
  }, [movePortraitHome, updateMobileScrollPortrait]);

  useLayoutEffect(() => {
    movePortraitHome();
    window.addEventListener('resize', movePortraitHome);
    return () => window.removeEventListener('resize', movePortraitHome);
  }, [movePortraitHome]);

  useEffect(() => {
    const h = () => updateMobileScrollPortrait();
    window.addEventListener('scroll', h, { passive: true });
    window.addEventListener('resize', h);
    h();
    return () => {
      window.removeEventListener('scroll', h);
      window.removeEventListener('resize', h);
    };
  }, [updateMobileScrollPortrait]);

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.toLowerCase());
    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.38;
      let current = '';

      sectionIds.forEach((id) => {
        const target = document.getElementById(id);
        if (!target) return;
        if (target.getBoundingClientRect().top <= marker) current = id;
      });

      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (nearBottom) current = 'contact';

      setActiveSection((prev) => prev === current ? prev : current);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      onPointerDown={handlePointerMove}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      className="h-screen flex flex-col relative"
      style={{ overflow: 'hidden', touchAction: 'pan-y' }}>
      
      <div
        ref={followZoneRef}
        aria-hidden="true"
        className="hero-follow-zone pointer-events-none absolute bottom-0 left-1/2 h-[74vh] w-[min(82vw,980px)] -translate-x-1/2" />
      

      <nav
        aria-label="Primary"
        className="hero-nav fixed left-0 top-0 z-50 flex w-full justify-center items-center gap-4 px-4 py-5 xl:relative xl:left-auto xl:top-auto xl:z-30 xl:gap-36 xl:px-48 xl:pt-8 xl:pb-0">
        {navLinks.map((link) =>
        <a
          key={link}
          href={`#${link.toLowerCase()}`}
          onClick={(e) => {
            e.preventDefault();
            const target = document.getElementById(link.toLowerCase());
            if (target) {
              const navHeight = window.matchMedia('(max-width: 1279px)').matches
                ? (document.querySelector('.hero-nav')?.getBoundingClientRect().height ?? 0) + 12
                : 0;
              setActiveSection(link.toLowerCase());
              window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: 'smooth' });
            }
          }}
          className={`hero-nav-link text-sm xl:text-[1.4rem] font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70 ${activeSection === link.toLowerCase() ? 'is-active' : ''}`}
          style={{ color: '#D7E2EA', textDecoration: 'none' }}>
            {link}
          </a>
        )}
      </nav>

      <div className="hero-title-stage overflow-hidden w-full text-center">
        <FadeIn delay={0.15} y={40}>
          <h1
            aria-label="HI I'M ALI"
            className="hero-heading hero-title font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] mt-6 xl:text-[17.5vw] xl:-mt-5"
            style={{ display: 'block' }}>
            
            <span className="hero-title-track" aria-hidden="true">
              <span className="hero-title-group">
                {heroTitleCopies.map((c) =>
                <span key={c} className="hero-heading hero-title-copy">HI I'M ALI</span>
                )}
              </span>
              <span className="hero-title-group">
                {heroTitleCopies.map((c) =>
                <span key={c} className="hero-heading hero-title-copy">HI I'M ALI</span>
                )}
              </span>
            </span>
          </h1>
        </FadeIn>
      </div>

      <FadeIn
        delay={0.6}
        y={30}
        className="absolute left-0 top-0 z-10 pointer-events-none"
        style={{ width: 'fit-content' }}>
        
        <motion.div ref={portraitRef} style={{ x: smoothX, y: smoothY }} className="will-change-transform">
          <div className="-translate-x-1/2 -translate-y-1/2">
            <img
              src="assets/ali-portrait.png"
              alt="Ali - AI Video Specialist"
              className="hero-portrait-img w-[350px] md:w-[440px] lg:w-[600px] xl:w-[740px]"
              onLoad={movePortraitHome}
              style={{ display: 'block' }} />
            
          </div>
        </motion.div>
      </FadeIn>

      <div className="mt-auto flex justify-center items-center px-6 pb-12 relative z-20 xl:justify-between xl:px-10 xl:pb-10">
        <FadeIn delay={0.35} y={20} className="w-full xl:w-auto">
          <p
            className="hero-intro-copy mx-auto font-light uppercase tracking-wide leading-snug text-center max-w-[320px] xl:mx-0 xl:text-left xl:max-w-[380px]"
            style={{ color: '#D7E2EA', fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>AI CONTENT CREATOR SPECIALIZING IN VIRAL VIDEO EDITING, CREATIVE STORYTELLING, AND TREND-DRIVEN CONTENT STRATEGY.


          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="hidden xl:block">
          <ContactButton />
        </FadeIn>
      </div>
    </section>);

}

window.HeroSection = HeroSection;
