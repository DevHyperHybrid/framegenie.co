// Shared helpers + FadeIn + AnimatedText components
const { useRef, useEffect, useLayoutEffect, useState, useMemo, useCallback } = React;
const { motion, useMotionValue, useSpring, useScroll, useTransform, useAnimationControls } = window.Motion;

const easeCurve = [0.25, 0.1, 0.25, 1];

function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
  replayOnScrollDown = false,
  viewport
}) {
  const ref = useRef(null);
  const controls = useAnimationControls();
  const scrollDirection = useRef('down');
  const lastScrollY = useRef(0);

  const hidden = useMemo(() => ({ opacity: 0, x, y }), [x, y]);
  const visible = useMemo(
    () => ({ opacity: 1, x: 0, y: 0, transition: { duration, delay, ease: easeCurve } }),
    [delay, duration]
  );
  const viewportConfig = viewport ?? { once: true, margin: '-80px', amount: 0 };

  useEffect(() => {
    if (!replayOnScrollDown) return;
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const cur = window.scrollY;
      if (cur > lastScrollY.current) scrollDirection.current = 'down';else
      if (cur < lastScrollY.current) scrollDirection.current = 'up';
      lastScrollY.current = cur;
      const el = ref.current;
      if (!el || scrollDirection.current !== 'up') return;
      const rect = el.getBoundingClientRect();
      if (rect.top >= window.innerHeight) controls.set(hidden);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls, hidden, replayOnScrollDown]);

  if (replayOnScrollDown) {
    return (
      <motion.div
        ref={ref}
        initial={hidden}
        animate={controls}
        onViewportEnter={() => {
          if (scrollDirection.current !== 'down') return;
          controls.set(hidden);
          controls.start(visible);
        }}
        viewport={{ ...viewportConfig, once: false }}
        className={className}
        style={style}>
        
        {children}
      </motion.div>);

  }

  return (
    <motion.div
      initial={hidden}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewportConfig}
      transition={{ duration, delay, ease: easeCurve }}
      className={className}
      style={style}>
      
      {children}
    </motion.div>);

}

const textVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.012 } } };
const charVariants = {
  hidden: { opacity: 0.15 },
  visible: { opacity: 1, transition: { duration: 0.24, ease: easeCurve } }
};

function AnimatedChar({ char }) {
  if (char === ' ') return <span> </span>;
  return <motion.span variants={charVariants}>{char}</motion.span>;
}

function AnimatedText({ text, className, style }) {
  const ref = useRef(null);
  const controls = useAnimationControls();
  const scrollDirection = useRef('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const cur = window.scrollY;
      if (cur > lastScrollY.current) scrollDirection.current = 'down';else
      if (cur < lastScrollY.current) scrollDirection.current = 'up';
      lastScrollY.current = cur;
      const el = ref.current;
      if (!el || scrollDirection.current !== 'up') return;
      const rect = el.getBoundingClientRect();
      if (rect.top >= window.innerHeight) controls.set('hidden');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  return (
    <motion.p
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={textVariants}
      onViewportEnter={() => {
        if (scrollDirection.current !== 'down') return;
        controls.set('hidden');
        controls.start('visible');
      }}
      viewport={{ once: false, margin: '-80px', amount: 0.2 }}
      className={className}
      style={style}>
      
      {text.split('').map((char, i) =>
      <AnimatedChar key={i} char={char} />
      )}
    </motion.p>);

}

function ContactButton() {
  const handleClick = () => {
    const target = document.getElementById('contact');
    if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
    }
  };
  return (
    <button
      onClick={handleClick}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit', textAlign: "center"
      }}
      className="site-contact-button px-8 py-3 text-xs text-white font-medium uppercase tracking-widest transition-opacity duration-200 hover:opacity-90 xl:px-12 xl:py-4 xl:text-base">
      
      Contact Me
    </button>);

}

function LiveProjectButton() {
  return (
    <>
      <div
        className="md:hidden flex-shrink-0 flex items-center justify-center"
        style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid rgba(215, 226, 234, 0.35)', background: 'transparent' }}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
        </span>
      </div>
      <button
        disabled
        className="site-live-button hidden md:flex rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-10 py-3.5 text-base items-center gap-2"
        style={{ fontFamily: 'inherit', background: 'transparent', cursor: 'default', pointerEvents: 'none', opacity: 1 }}>
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
        </span>
        Live Preview
      </button>
    </>
  );
}

Object.assign(window, {
  FadeIn, AnimatedText, ContactButton, LiveProjectButton,
  React, motion, useMotionValue, useSpring, useScroll, useTransform,
  useRef, useEffect, useLayoutEffect, useState, useMemo, useCallback
});
