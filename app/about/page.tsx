export default function AboutPage() {
  const team = [
    { name: 'Romaine Jackson', role: 'Founder & Editor-in-Chief', bio: 'Gaming since the NES era. Believes great games journalism makes the industry better.', emoji: '🎮' },
    { name: 'Jordan Kim', role: 'Senior Reviews Editor', bio: 'RPG specialist and trophy hunter. Has beaten every FromSoftware game at least twice.', emoji: '⚔️' },
    { name: 'Sam Torres', role: 'Esports Correspondent', bio: 'Former competitive player. Covers the biggest tournaments around the world.', emoji: '🏆' },
    { name: 'Morgan Lee', role: 'Hardware Editor', bio: 'Builds a new PC every year. Knows the benchmark for every GPU released since 2010.', emoji: '🖥️' },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 className="font-display" style={{ fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 16 }}>
          ABOUT <span style={{ color: '#00ff88' }}>LEVELUP</span>
        </h1>
        <p style={{ fontSize: 17, color: '#8888aa', maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
          We are a passionate team of gamers, critics, and journalists dedicated to covering the games industry with depth, honesty, and enthusiasm.
        </p>
      </div>

      

      {/* Mission */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 48 }}>
        <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 14, padding: 28 }}>
          <div style={{ fontSize: 28, marginBottom: 14 }}>⭐</div>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 10 }}>OUR MISSION</h2>
          <p style={{ fontSize: 14, color: '#8888aa', lineHeight: 1.75 }}>
            LevelUp Network exists to give gamers the information they need to make smart choices and engage more deeply with the games they love. We publish honest reviews, in-depth guides, and breaking news — no hype, no paid promotion, just real coverage.
          </p>
        </div>
        <div style={{ background: '#111120', border: '1px solid #252540', borderRadius: 14, padding: 28 }}>
          <div style={{ fontSize: 28, marginBottom: 14 }}>🏆</div>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 10 }}>OUR STANDARDS</h2>
          <p style={{ fontSize: 14, color: '#8888aa', lineHeight: 1.75 }}>
            Every review score is based on hands-on time with the final product. We never accept payment for coverage. Our editorial team operates independently. If we recommend it, it is because we genuinely believe in it.
          </p>
        </div>
      </div>

      {/* Team */}
      <div style={{ marginBottom: 48 }}>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 20 }}>👥 THE TEAM</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {team.map(({ name, role, bio, emoji }) => (
            <div key={name} style={{ background: '#111120', border: '1px solid #252540', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>{emoji}</div>
              <div className="font-display" style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{name}</div>
              <div className="font-display" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#00ff88', marginBottom: 10 }}>{role}</div>
              <div style={{ fontSize: 12, color: '#6b6b8a', lineHeight: 1.65 }}>{bio}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#1a1a2e', border: '1px solid rgba(0,255,136,.2)', borderRadius: 16, padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>✍️</div>
        <h2 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.04em', marginBottom: 12 }}>WRITE FOR US</h2>
        <p style={{ fontSize: 15, color: '#8888aa', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
          Are you a passionate gamer with a voice? Pitch us your ideas.
        </p>
        <a href="/contact" style={{ padding: '10px 28px', background: '#00ff88', color: '#05050a', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '.04em' }}>
          GET IN TOUCH
        </a>
      </div>
    </div>
  );
}