import React, { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:5000';

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
`;

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: #000;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .rb-dashboard {
    min-height: 100vh;
    background: #000;
    display: flex;
    flex-direction: column;
  }

  /* ── TOPBAR ── */
  .rb-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px;
    border-bottom: 1px solid #1a1a1a;
    position: sticky;
    top: 0;
    background: #000;
    z-index: 100;
  }

  .rb-logo {
    font-family: 'Cormorant Garant', serif;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 8px;
    color: #fff;
    text-transform: uppercase;
  }

  .rb-logo span {
    color: #7B2FBE;
  }

  .rb-nav {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .rb-nav-btn {
    background: none;
    border: 1px solid #222;
    color: #aaa;
    padding: 8px 18px;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .rb-nav-btn:hover {
    border-color: #fff;
    color: #fff;
  }

  .rb-nav-btn.active {
    background: #fff;
    color: #000;
    border-color: #fff;
  }

  .rb-logout-btn {
    background: none;
    border: 1px solid #333;
    color: #555;
    padding: 8px 16px;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    margin-left: 12px;
  }

  .rb-logout-btn:hover {
    border-color: #E8173A;
    color: #E8173A;
  }

  /* ── MAIN CONTENT ── */
  .rb-main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 48px 24px;
    gap: 40px;
  }

  /* ── SWIPE SECTION ── */
  .rb-swipe-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    flex: 1;
    max-width: 420px;
  }

  .rb-section-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #444;
  }

  /* ── CARD ── */
  .rb-card-stack {
    position: relative;
    width: 340px;
    height: 480px;
  }

  .rb-card {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .rb-card-bg {
    flex: 1;
    background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .rb-card-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
  }

  .rb-card-bg-placeholder {
    font-size: 72px;
    opacity: 0.15;
    user-select: none;
  }

  .rb-card-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to top, #0d0d0d 0%, transparent 100%);
  }

  .rb-card-info {
    padding: 20px 24px;
    background: #0d0d0d;
  }

  .rb-card-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 26px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 1px;
  }

  .rb-card-age {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #666;
    letter-spacing: 1px;
    margin-top: 2px;
  }

  .rb-card-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .rb-tag {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #555;
    border: 1px solid #222;
    padding: 3px 8px;
    border-radius: 2px;
  }

  /* ── ACTION BUTTONS ── */
  .rb-actions {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .rb-btn-pass {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid #333;
    background: #000;
    color: #fff;
    font-size: 22px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rb-btn-pass:hover {
    border-color: #E8173A;
    color: #E8173A;
    transform: scale(1.08);
  }

  .rb-btn-like {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px solid #fff;
    background: #fff;
    color: #000;
    font-size: 26px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rb-btn-like:hover {
    background: #f0f0f0;
    transform: scale(1.08);
  }

  .rb-btn-super {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1px solid #7B2FBE;
    background: #000;
    color: #7B2FBE;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rb-btn-super:hover {
    background: #7B2FBE;
    color: #fff;
    transform: scale(1.08);
  }

  .rb-empty-state {
    width: 340px;
    height: 480px;
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .rb-empty-icon {
    font-size: 48px;
    opacity: 0.2;
  }

  .rb-empty-text {
    font-family: 'Cormorant Garant', serif;
    font-size: 20px;
    color: #333;
    letter-spacing: 2px;
  }

  .rb-empty-sub {
    font-size: 11px;
    color: #2a2a2a;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* ── MATCHES SECTION ── */
  .rb-matches-section {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .rb-matches-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #111;
  }

  .rb-matches-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    letter-spacing: 2px;
  }

  .rb-matches-count {
    font-size: 10px;
    letter-spacing: 2px;
    color: #444;
    text-transform: uppercase;
  }

  .rb-match-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: #080808;
    border: 1px solid #111;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }

  .rb-match-card:hover {
    border-color: #2a2a2a;
    background: #0d0d0d;
  }

  .rb-match-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #1a1a1a;
    border: 1px solid #222;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .rb-match-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .rb-match-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 16px;
    color: #ddd;
    letter-spacing: 1px;
  }

  .rb-match-sub {
    font-size: 10px;
    color: #333;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .rb-no-matches {
    padding: 32px 16px;
    text-align: center;
    color: #222;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: 1px dashed #111;
    border-radius: 2px;
  }

  /* ── MATCH POPUP ── */
  .rb-popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    animation: rbFadeIn 0.3s ease;
  }

  @keyframes rbFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .rb-popup {
    background: #0d0d0d;
    border: 1px solid #222;
    border-radius: 4px;
    padding: 48px 40px;
    text-align: center;
    max-width: 360px;
    width: 90%;
    animation: rbSlideUp 0.3s ease;
  }

  @keyframes rbSlideUp {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  .rb-popup-label {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #7B2FBE;
    margin-bottom: 16px;
  }

  .rb-popup-title {
    font-family: 'Cormorant Garant', serif;
    font-size: 36px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 3px;
    margin-bottom: 8px;
  }

  .rb-popup-sub {
    font-size: 12px;
    color: #444;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  .rb-popup-btn {
    display: block;
    width: 100%;
    padding: 14px;
    background: #fff;
    color: #000;
    border: none;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    margin-bottom: 10px;
    transition: background 0.2s;
  }

  .rb-popup-btn:hover { background: #e8e8e8; }

  .rb-popup-btn-secondary {
    display: block;
    width: 100%;
    padding: 14px;
    background: none;
    color: #333;
    border: 1px solid #1e1e1e;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .rb-popup-btn-secondary:hover {
    border-color: #333;
    color: #666;
  }

  /* ── STATUS BAR ── */
  .rb-status {
    padding: 10px 32px;
    border-top: 1px solid #0d0d0d;
    background: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .rb-status-dot {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    letter-spacing: 2px;
    color: #2a2a2a;
    text-transform: uppercase;
  }

  .rb-status-dot::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #1a5c1a;
  }

  /* ── TICKER ── */
  .rb-ticker {
    background: #E8173A;
    padding: 8px 0;
    overflow: hidden;
    white-space: nowrap;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
  }

  .rb-ticker-inner {
    display: inline-block;
    animation: rbTicker 30s linear infinite;
  }

  @keyframes rbTicker {
    from { transform: translateX(100vw); }
    to   { transform: translateX(-100%); }
  }

  .rb-ticker-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
    padding: 0 48px;
  }

  /* ── LOADING ── */
  .rb-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #000;
    font-family: 'Cormorant Garant', serif;
    font-size: 18px;
    color: #222;
    letter-spacing: 4px;
  }

  .rb-tab-content { width: 100%; }

  @media (max-width: 768px) {
    .rb-main { flex-direction: column; align-items: center; padding: 24px 16px; }
    .rb-matches-section { width: 100%; max-width: 420px; }
    .rb-topbar { padding: 16px 20px; }
    .rb-logo { font-size: 18px; letter-spacing: 5px; }
  }
`;

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [matchPopup, setMatchPopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('discover');
  const [actionFeedback, setActionFeedback] = useState('');

  const token = localStorage.getItem('token');

  const fetchProfiles = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/swipe/profiles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (e) {
      console.error('Profiles fetch error:', e);
    }
  }, [token]);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/swipe/matches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (e) {
      console.error('Matches fetch error:', e);
    }
  }, [token]);

  useEffect(() => {
    const init = async () => {
      await fetchProfiles();
      await fetchMatches();
      setLoading(false);
    };
    init();
  }, [fetchProfiles, fetchMatches]);

  const showFeedback = (msg) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(''), 1200);
  };

  const handleLike = async () => {
    const profile = profiles[currentIdx];
    if (!profile) return;
    showFeedback('✦');
    try {
      const res = await fetch(`${API}/api/swipe/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ swipedId: profile._id })
      });
      const data = await res.json();
      if (data.match) {
        setMatchPopup(profile);
        fetchMatches();
      }
    } catch (e) { console.error(e); }
    setCurrentIdx(i => i + 1);
  };

  const handlePass = async () => {
    const profile = profiles[currentIdx];
    if (!profile) return;
    showFeedback('✕');
    try {
      await fetch(`${API}/api/swipe/pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ swipedId: profile._id })
      });
    } catch (e) { console.error(e); }
    setCurrentIdx(i => i + 1);
  };

  const handleSuperLike = async () => {
    const profile = profiles[currentIdx];
    if (!profile) return;
    showFeedback('★');
    try {
      const res = await fetch(`${API}/api/swipe/superlike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ swipedId: profile._id })
      });
      const data = await res.json();
      if (data.match) {
        setMatchPopup(profile);
        fetchMatches();
      }
    } catch (e) { console.error(e); }
    setCurrentIdx(i => i + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const currentProfile = profiles[currentIdx];

  if (loading) {
    return (
      <>
        <style>{FONTS + styles}</style>
        <div className="rb-loading">RUBAROO</div>
      </>
    );
  }

  return (
    <>
      <style>{FONTS + styles}</style>

      <div className="rb-dashboard">
        {/* TOPBAR */}
        <header className="rb-topbar">
          <div className="rb-logo"><span>R</span>UBAROO</div>
          <nav className="rb-nav">
            <button
              className={`rb-nav-btn ${tab === 'discover' ? 'active' : ''}`}
              onClick={() => setTab('discover')}
            >Discover</button>
            <button
              className={`rb-nav-btn ${tab === 'matches' ? 'active' : ''}`}
              onClick={() => setTab('matches')}
            >
              Matches {matches.length > 0 && `(${matches.length})`}
            </button>
            <button
              className="rb-nav-btn"
              onClick={() => window.location.href = '/upgrade'}
            >Upgrade</button>
            <button className="rb-logout-btn" onClick={handleLogout}>Exit</button>
          </nav>
        </header>

        {/* MAIN */}
        <main className="rb-main">

          {/* ── DISCOVER TAB ── */}
          {tab === 'discover' && (
            <>
              <div className="rb-swipe-section">
                <span className="rb-section-label">Your City. Your Person.</span>

                {/* CARD */}
                {currentProfile ? (
                  <div className="rb-card-stack">
                    <div className="rb-card">
                      <div className="rb-card-bg">
                        {currentProfile.photos && currentProfile.photos[0] ? (
                          <img src={`${API}/${currentProfile.photos[0]}`} alt={currentProfile.name} />
                        ) : (
                          <div className="rb-card-bg-placeholder">◈</div>
                        )}
                        <div className="rb-card-gradient" />
                        {actionFeedback && (
                          <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%,-50%)',
                            fontSize: '72px', opacity: 0.9,
                            animation: 'rbFadeIn 0.2s ease',
                            pointerEvents: 'none'
                          }}>{actionFeedback}</div>
                        )}
                      </div>
                      <div className="rb-card-info">
                        <div className="rb-card-name">
                          {currentProfile.name || 'Anonymous'}
                          <span style={{ fontFamily: 'DM Sans', fontSize: '14px', color: '#555', marginLeft: '8px', fontWeight: 300 }}>
                            {currentProfile.age}
                          </span>
                        </div>
                        <div className="rb-card-age">
                          {currentProfile.location || 'Delhi NCR'}
                        </div>
                        <div className="rb-card-tags">
                          {(currentProfile.interests || []).slice(0, 3).map((t, i) => (
                            <span key={i} className="rb-tag">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rb-empty-state">
                    <div className="rb-empty-icon">◈</div>
                    <div className="rb-empty-text">All Caught Up</div>
                    <div className="rb-empty-sub">Check back tomorrow</div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                {currentProfile && (
                  <div className="rb-actions">
                    <button className="rb-btn-pass" onClick={handlePass} title="Pass">✕</button>
                    <button className="rb-btn-like" onClick={handleLike} title="Like">♥</button>
                    <button className="rb-btn-super" onClick={handleSuperLike} title="Super Like">★</button>
                  </div>
                )}
              </div>

              {/* MATCHES SIDEBAR */}
              <div className="rb-matches-section">
                <div className="rb-matches-header">
                  <span className="rb-matches-title">Matches</span>
                  <span className="rb-matches-count">{matches.length} total</span>
                </div>
                {matches.length === 0 ? (
                  <div className="rb-no-matches">No matches yet</div>
                ) : (
                  matches.map((m, i) => {
                    const other = m.users?.find(u => u._id !== localStorage.getItem('userId'));
                    return (
                      <div
                        key={i}
                        className="rb-match-card"
                        onClick={() => window.location.href = `/chat/${m._id}`}
                      >
                        <div className="rb-match-avatar">
                          {other?.photos?.[0]
                            ? <img src={`${API}/${other.photos[0]}`} alt={other.name} />
                            : '◈'}
                        </div>
                        <div>
                          <div className="rb-match-name">{other?.name || 'Match'}</div>
                          <div className="rb-match-sub">Tap to chat</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* ── MATCHES TAB ── */}
          {tab === 'matches' && (
            <div className="rb-tab-content">
              <div className="rb-matches-section" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <div className="rb-matches-header">
                  <span className="rb-matches-title">Your Matches</span>
                  <span className="rb-matches-count">{matches.length} connections</span>
                </div>
                {matches.length === 0 ? (
                  <div className="rb-no-matches" style={{ padding: '48px' }}>
                    Start swiping to find your person
                  </div>
                ) : (
                  matches.map((m, i) => {
                    const other = m.users?.find(u => u._id !== localStorage.getItem('userId'));
                    return (
                      <div
                        key={i}
                        className="rb-match-card"
                        onClick={() => window.location.href = `/chat/${m._id}`}
                        style={{ padding: '18px 20px' }}
                      >
                        <div className="rb-match-avatar" style={{ width: '52px', height: '52px' }}>
                          {other?.photos?.[0]
                            ? <img src={`${API}/${other.photos[0]}`} alt={other.name} />
                            : '◈'}
                        </div>
                        <div>
                          <div className="rb-match-name" style={{ fontSize: '18px' }}>{other?.name || 'Match'}</div>
                          <div className="rb-match-sub">Connected · Tap to chat</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </main>

        {/* STATUS BAR */}
        <div className="rb-status">
          <span className="rb-status-dot">Delhi NCR Active</span>
          <span style={{ fontSize: '10px', color: '#1a1a1a', letterSpacing: '2px' }}>RUBAROO v1.0</span>
        </div>

        {/* TICKER */}
        <div className="rb-ticker">
          <span className="rb-ticker-inner">
            <span className="rb-ticker-text">
              Delhi NCR's Premium Dating Experience &nbsp;·&nbsp;
              Your City. Your Person. &nbsp;·&nbsp;
              रूबरू &nbsp;·&nbsp;
              Swipe Thoughtfully &nbsp;·&nbsp;
              Genuine Connections Only &nbsp;·&nbsp;
              Delhi NCR's Premium Dating Experience &nbsp;·&nbsp;
              Your City. Your Person. &nbsp;·&nbsp;
              रूबरू &nbsp;·&nbsp;
            </span>
          </span>
        </div>

        {/* MATCH POPUP */}
        {matchPopup && (
          <div className="rb-popup-overlay" onClick={() => setMatchPopup(null)}>
            <div className="rb-popup" onClick={e => e.stopPropagation()}>
              <div className="rb-popup-label">✦ It's a Match</div>
              <div className="rb-popup-title">
                {matchPopup.name?.split(' ')[0] || 'Someone'}
              </div>
              <div className="rb-popup-sub">liked you back</div>
              <button className="rb-popup-btn" onClick={() => {
                setMatchPopup(null);
                fetchMatches();
                setTab('matches');
              }}>
                View Match
              </button>
              <button className="rb-popup-btn-secondary" onClick={() => setMatchPopup(null)}>
                Keep Swiping
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}