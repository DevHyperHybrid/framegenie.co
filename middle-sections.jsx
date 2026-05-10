const ALL_IMAGES = [
  'assets/marquee/09-applina.png',
  'assets/marquee/02-alligator.png?v=3',
  'assets/marquee/03-applino.png',
  'assets/marquee/04-bananito.png',
  'assets/marquee/05-hairlaser.png',
  'assets/marquee/06-nurse.png',
  'assets/marquee/07-talking.png',
  'assets/marquee/08-two.png',
  'assets/marquee/01-grandma.png?v=2',
  'assets/marquee/10-bananita.png',
];
const ROW1 = [ALL_IMAGES[0], ALL_IMAGES[2], ALL_IMAGES[4], ALL_IMAGES[6], ALL_IMAGES[8]];
const ROW2 = [ALL_IMAGES[1], ALL_IMAGES[3], ALL_IMAGES[5], ALL_IMAGES[7], ALL_IMAGES[9]];
const DESKTOP_ROW2 = [ALL_IMAGES[1], ALL_IMAGES[3], ALL_IMAGES[5], ALL_IMAGES[9], ALL_IMAGES[7]];
const MOBILE_ROW1 = [ALL_IMAGES[0], ALL_IMAGES[6], ALL_IMAGES[4], ALL_IMAGES[2], ALL_IMAGES[8]];

function MarqueeSection() {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const h = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const raw = (window.scrollY - top + window.innerHeight) * 0.3;
      setOffset(raw);
    };
    window.addEventListener('scroll', h, { passive: true });
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1279px)');
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);
    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  const row1Images = isMobile ? MOBILE_ROW1 : ROW1;
  const row2Images = isMobile ? ROW2 : DESKTOP_ROW2;

  return (
    <section ref={ref} className="pt-24 xl:pt-40 pb-10 overflow-hidden" style={{ background: '#0C0C0C' }}>
      <div className="flex flex-col gap-1.5 xl:gap-24">
        <div className="marquee-row-1 flex justify-center gap-0 xl:gap-36" style={{ transform: `translateX(${offset - (isMobile ? 200 : 320)}px)`, willChange: 'transform' }}>
          {row1Images.map((src, i) => (
            <div key={i} className="flex h-[270px] w-[300px] md:h-[300px] md:w-[340px] lg:h-[330px] lg:w-[390px] flex-shrink-0 items-center justify-center overflow-hidden xl:h-[360px] xl:w-[420px]">
              <img src={src} alt="" loading="lazy" className="w-full h-full object-contain object-center" />
            </div>
          ))}
        </div>
        <div className="marquee-row-2 flex justify-center gap-6 xl:gap-56" style={{ transform: `translateX(${-(offset - (isMobile ? 200 : 320))}px)`, willChange: 'transform' }}>
          {row2Images.map((src, i) => (
            <div key={i} className="flex h-[270px] w-auto md:h-[300px] lg:h-[330px] flex-shrink-0 items-center justify-center xl:h-[360px] xl:w-[420px] xl:overflow-hidden"
              style={isMobile && i === 3 ? { marginLeft: '83px' } : {}}>
              <img src={src} alt="" loading="lazy" className="h-full w-auto xl:w-full xl:object-contain xl:object-center" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const ABOUT_TEXT =
  "Passionate and creative AI content creator who loves building ideas into engaging visual experiences through storytelling, video editing, website creation, and trend-driven content that captures attention and connects with audiences.";

function AboutSection() {
  return (
    <section id="about" className="relative flex min-h-0 items-start justify-center px-5 pt-20 pb-16 md:px-10 md:pt-28 xl:min-h-screen xl:items-center xl:px-10 xl:py-20" style={{ background: '#0C0C0C' }}>
      <FadeIn delay={0.15} x={-120} y={0} duration={1.0} replayOnScrollDown className="about-decoration absolute top-[4%] left-[1%] xl:left-[4%] pointer-events-none">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="" className="w-[120px] md:w-[155px] xl:w-[210px]" />
      </FadeIn>
      <FadeIn delay={0.3} x={-120} y={0} duration={1.0} replayOnScrollDown className="about-decoration absolute bottom-[8%] left-[3%] xl:left-[10%] pointer-events-none">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="" className="w-[100px] md:w-[135px] xl:w-[180px]" />
      </FadeIn>
      <FadeIn delay={0.2} x={120} y={0} duration={1.0} replayOnScrollDown className="about-decoration absolute top-[4%] right-[1%] xl:right-[4%] pointer-events-none">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="" className="w-[120px] md:w-[155px] xl:w-[210px]" />
      </FadeIn>
      <FadeIn delay={0.35} x={120} y={0} duration={1.0} replayOnScrollDown className="about-decoration absolute bottom-[8%] right-[3%] xl:right-[10%] pointer-events-none">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="" className="w-[130px] md:w-[165px] xl:w-[220px]" />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-10 xl:gap-16">
        <FadeIn delay={0} y={90} duration={0.9} replayOnScrollDown>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            About me
          </h2>
        </FadeIn>
        <div className="flex flex-col items-center gap-16 xl:gap-24">
          <AnimatedText text={ABOUT_TEXT} className="about-copy font-medium text-center leading-relaxed max-w-[560px]" style={{ color: '#D7E2EA', fontSize: 'clamp(1rem, 2vw, 1.35rem)' }} />
          <FadeIn delay={0.2} y={40} duration={0.7} replayOnScrollDown>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  { num: '01', name: 'AI Short-Form Video Creation', desc: 'Crafting punchy, scroll-stopping short videos optimized for TikTok, Reels, and Shorts using cutting-edge AI generation tools.' },
  { num: '02', name: 'AI Image Generation & Creative Visual Design', desc: 'Producing high-impact still imagery and creative visuals using AI generation pipelines, refined for brand and editorial use.' },
  { num: '03', name: 'Viral Content & Trend-Based Video Production', subname: '', desc: 'Identifying emerging trends and turning them into shareable, on-brand video content built to perform across platforms.' },
  { num: '04', name: 'AI Character Animation & Storytelling', desc: 'Bringing characters and narratives to life with AI-driven animation, performance, and cinematic storytelling techniques.' },
  { num: '05', name: 'AI-Powered Product & Brand Commercials', desc: 'Producing polished, cinematic product spots and brand commercials end-to-end using state-of-the-art AI video tooling.' },
];

function ServicesSection() {
  return (
    <section id="services" className="rounded-t-[40px] px-5 py-20 md:px-10 md:py-28 xl:rounded-t-[60px] xl:px-10 xl:py-32" style={{ background: '#FFFFFF' }}>
      <FadeIn delay={0} y={80} duration={0.85} replayOnScrollDown>
        <h2 className="font-black uppercase text-center mb-16 xl:mb-28" style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 12vw, 160px)' }}>Services</h2>
      </FadeIn>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn
            key={s.num}
            delay={i * 0.11}
            duration={0.72}
            y={60}
            replayOnScrollDown
            viewport={{ margin: '-60px', amount: 0.3 }}
            style={{
              borderTop: i === 0 ? '1px solid rgba(12, 12, 12, 0.15)' : undefined,
              borderBottom: '1px solid rgba(12, 12, 12, 0.15)',
            }}
            className="flex items-start gap-6 py-8 xl:gap-10 xl:py-12"
          >
            <span className="service-number font-black leading-none flex-shrink-0" style={{ color: '#0C0C0C', fontSize: 'clamp(3rem, 10vw, 140px)', lineHeight: 1 }}>{s.num}</span>
            <div className="flex flex-col gap-2 pt-2">
              <span className="service-title font-medium uppercase" style={{ color: '#0C0C0C', fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{s.name}</span>
              <span className="service-desc font-light leading-relaxed max-w-2xl" style={{ color: '#0C0C0C', opacity: 0.6, fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>{s.desc}</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { MarqueeSection, AboutSection, ServicesSection });
