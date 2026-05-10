function ContactForm() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();
  const emailValid = trimmedEmail === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const nameValid = name.trim().length >= 2;
  const isValid = nameValid && emailValid;

  const inputStyle = {
    background: 'rgba(215, 226, 234, 0.05)',
    border: '1px solid rgba(215, 226, 234, 0.18)',
    color: '#D7E2EA',
    fontFamily: 'inherit',
    fontSize: '0.95rem'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    const emailText = trimmedEmail ? ` (${trimmedEmail})` : '';
    const messageText = trimmedMessage ? `\n\n${trimmedMessage}` : '';
    const text = `Hi Ali, I'm ${name.trim()}${emailText}.${messageText}`;
    const url = `https://wa.me/96170014655?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-[#D7E2EA]/20 p-5 flex flex-col gap-5 xl:p-8"
      style={{ background: 'rgba(215, 226, 234, 0.03)' }}>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-medium uppercase tracking-widest text-[0.7rem]" style={{ color: '#D7E2EA', opacity: 0.7 }}>Name *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="rounded-xl px-4 py-3 outline-none transition-colors duration-200 focus:border-[#D7E2EA]/60"
            style={inputStyle} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-medium uppercase tracking-widest text-[0.7rem]" style={{ color: '#D7E2EA', opacity: 0.7 }}>
            Email <span style={{ fontSize: '0.58rem', opacity: 0.72 }}>(Optional)</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="rounded-xl px-4 py-3 outline-none transition-colors duration-200 focus:border-[#D7E2EA]/60"
            style={inputStyle} />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="font-medium uppercase tracking-widest text-[0.7rem]" style={{ color: '#D7E2EA', opacity: 0.7 }}>
          Message <span style={{ fontSize: '0.58rem', opacity: 0.72 }}>(Optional)</span>
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about your project..."
          rows={5}
          className="rounded-xl px-4 py-3 outline-none resize-y transition-colors duration-200 focus:border-[#D7E2EA]/60"
          style={inputStyle}>
        </textarea>
      </label>
      <button
        type="submit"
        disabled={!isValid}
        style={{
          background: isValid
            ? 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'
            : 'rgba(215, 226, 234, 0.12)',
          boxShadow: isValid ? '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1' : 'none',
          outline: isValid ? '2px solid white' : '2px solid rgba(215, 226, 234, 0.2)',
          outlineOffset: '-3px',
          borderRadius: '14px',
          border: 'none',
          cursor: isValid ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit',
          opacity: isValid ? 1 : 0.55
        }}
        className="contact-submit-button mt-2 w-full py-4 text-white font-medium uppercase tracking-widest transition-opacity duration-200 hover:opacity-90">
        Send Message
      </button>
    </form>);
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="relative px-5 py-24 -mt-10 z-20 rounded-t-[40px] xl:px-10 xl:py-32 xl:-mt-14 xl:rounded-t-[60px]"
      style={{ background: '#0C0C0C' }}>
      <div className="max-w-3xl mx-auto">
        <FadeIn delay={0} y={60} duration={0.85} replayOnScrollDown>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-6 xl:mb-8"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}>
            Let's Work Together
          </h2>
        </FadeIn>

        <FadeIn delay={0.12} y={30} duration={0.7} replayOnScrollDown>
          <p
            className="contact-subtitle font-light text-center leading-relaxed mx-auto mb-10 max-w-[280px] md:max-w-[460px] xl:mb-14 xl:max-w-none xl:whitespace-nowrap"
            style={{ color: '#D7E2EA', opacity: 0.7, fontSize: 'clamp(0.78rem, 1.4vw, 1.15rem)' }}>
            Interested in discussing a project or just want to say hi? Drop me a message.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} y={30} duration={0.7} replayOnScrollDown>
          <div className="grid grid-cols-1 gap-4 mb-6 xl:grid-cols-2">
            <div
              className="flex items-center gap-4 p-5 rounded-2xl border border-[#D7E2EA]/20"
              style={{ background: 'rgba(215, 226, 234, 0.04)' }}>
              <div
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(215, 226, 234, 0.08)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D7E2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 5L2 7" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="contact-card-label font-medium uppercase tracking-widest text-[0.65rem]" style={{ color: '#D7E2EA', opacity: 0.55 }}>Email</span>
                <a href="mailto:alihamdounn003@gmail.com" className="contact-card-value font-medium truncate transition-opacity duration-200 hover:opacity-70" style={{ color: '#D7E2EA', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)', textDecoration: 'none' }}>
                  alihamdounn003@gmail.com
                </a>
              </div>
            </div>

            <div
              className="flex items-center gap-4 p-5 rounded-2xl border border-[#D7E2EA]/20"
              style={{ background: 'rgba(215, 226, 234, 0.04)' }}>
              <div
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(215, 226, 234, 0.08)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D7E2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="contact-card-label font-medium uppercase tracking-widest text-[0.65rem]" style={{ color: '#D7E2EA', opacity: 0.55 }}>Phone</span>
                <a href="tel:+96170014655" className="contact-card-value font-medium transition-opacity duration-200 hover:opacity-70" style={{ color: '#D7E2EA', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)', textDecoration: 'none' }}>
                  +961 70 014 655
                </a>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.28} y={30} duration={0.7} replayOnScrollDown>
          <ContactForm />
        </FadeIn>

        <p
          className="font-light uppercase tracking-widest text-center mt-12 xl:mt-16"
          style={{ color: '#D7E2EA', opacity: 0.5, fontSize: 'clamp(0.7rem, 1vw, 0.85rem)' }}>
          © 2026 Ali — AI Video Specialist
        </p>
      </div>
    </section>);
}

window.ContactSection = ContactSection;
