const CONTACT_DRAFT_KEY = 'framegenie-contact-draft';

function loadContactDraft() {
  try {
    const raw = localStorage.getItem(CONTACT_DRAFT_KEY);
    if (!raw) return { name: '', email: '', message: '' };
    const parsed = JSON.parse(raw);
    return {
      name: parsed.name || '',
      email: parsed.email || '',
      message: parsed.message || ''
    };
  } catch (err) {
    return { name: '', email: '', message: '' };
  }
}

function ContactForm() {
  const draft = React.useRef(loadContactDraft()).current;
  const [name, setName] = React.useState(draft.name);
  const [email, setEmail] = React.useState(draft.email);
  const [message, setMessage] = React.useState(draft.message);
  const [status, setStatus] = React.useState('idle'); // idle | sending | success | error

  const WEB3FORMS_ACCESS_KEY = '30ff3b82-9b29-47c5-acd4-8424290e248a';

  // Persist every keystroke so the draft survives a page refresh.
  // Cleared only on a successful send or when the user empties the fields.
  React.useEffect(() => {
    try {
      if (!name && !email && !message) {
        localStorage.removeItem(CONTACT_DRAFT_KEY);
      } else {
        localStorage.setItem(CONTACT_DRAFT_KEY, JSON.stringify({ name, email, message }));
      }
    } catch (err) {
      /* ignore storage failures (private mode, quota, etc.) */
    }
  }, [name, email, message]);

  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const emailError = trimmedEmail !== '' && !emailValid;
  const nameValid = name.trim().length >= 2;
  const messageValid = trimmedMessage.length > 0;
  const isValid = nameValid && emailValid && messageValid;

  const inputStyle = {
    background: 'rgba(215, 226, 234, 0.05)',
    border: '1px solid rgba(215, 226, 234, 0.18)',
    color: '#D7E2EA',
    fontFamily: 'inherit',
    fontSize: '0.95rem'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || status === 'sending') return;
    setStatus('sending');

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New portfolio message from ${name.trim()}`,
      from_name: name.trim(),
      name: name.trim(),
      email: trimmedEmail,
      message: trimmedMessage
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
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
            Email *
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            aria-invalid={emailError}
            className={`rounded-xl px-4 py-3 outline-none transition-colors duration-200 ${emailError ? '' : 'focus:border-[#D7E2EA]/60'}`}
            style={{
              ...inputStyle,
              border: emailError ? '1px solid #E08B8B' : inputStyle.border,
              boxShadow: emailError ? '0 0 0 1px rgba(224, 139, 139, 0.45)' : 'none'
            }} />
          {emailError &&
          <span className="font-light" style={{ color: '#E08B8B', fontSize: '0.75rem' }}>
            Please enter a valid email address.
          </span>}
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="font-medium uppercase tracking-widest text-[0.7rem]" style={{ color: '#D7E2EA', opacity: 0.7 }}>
          Message *
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about your project..."
          rows={5}
          required
          className="rounded-xl px-4 py-3 outline-none resize-y transition-colors duration-200 focus:border-[#D7E2EA]/60"
          style={inputStyle}>
        </textarea>
      </label>
      <button
        type="submit"
        disabled={!isValid || status === 'sending'}
        style={{
          background: isValid
            ? 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'
            : 'rgba(215, 226, 234, 0.12)',
          boxShadow: isValid ? '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1' : 'none',
          outline: isValid ? '2px solid white' : '2px solid rgba(215, 226, 234, 0.2)',
          outlineOffset: '-3px',
          borderRadius: '14px',
          border: 'none',
          cursor: isValid && status !== 'sending' ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit',
          opacity: isValid && status !== 'sending' ? 1 : 0.55
        }}
        className="contact-submit-button mt-2 w-full py-4 text-white font-medium uppercase tracking-widest transition-opacity duration-200 hover:opacity-90">
        {status === 'sending' ? 'Sending…' : status === 'success' ? 'Message Sent ✓' : 'Send Message'}
      </button>

      {status === 'success' &&
      <p className="text-center font-light" style={{ color: '#7BE0A0', fontSize: '0.85rem' }}>
        Thanks! Your message has been sent. I'll get back to you soon.
      </p>}
      {status === 'error' &&
      <p className="text-center font-light" style={{ color: '#E08B8B', fontSize: '0.85rem' }}>
        Something went wrong. Please try again or email alihamdounn003@gmail.com directly.
      </p>}
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#D7E2EA" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="contact-card-label font-medium uppercase tracking-widest text-[0.65rem]" style={{ color: '#D7E2EA', opacity: 0.55 }}>WhatsApp</span>
                <a href="https://wa.me/96170014655?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project%20I%20have%20in%20mind." target="_blank" rel="noopener noreferrer" className="contact-card-value font-medium transition-opacity duration-200 hover:opacity-70" style={{ color: '#D7E2EA', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)', textDecoration: 'none' }}>
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
          © 2026 AI Video Specialist
        </p>
      </div>
    </section>);
}

window.ContactSection = ContactSection;
