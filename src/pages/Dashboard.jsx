import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://rubaroo-production-dfa1.up.railway.app";

const FALLBACK_PROFILES = [
  { _id: "mock1", name: "Priya Sharma", age: 26, location: { area: "Hauz Khas" }, bio: "Coffee lover | Startup life | Weekend hiker", matchScore: 94, photos: [{ url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop&crop=face" }] },
  { _id: "mock2", name: "Neha Kapoor", age: 24, location: { area: "Vasant Kunj" }, bio: "Artist | Delhi University | Dog mom", matchScore: 88, photos: [{ url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=face" }] },
  { _id: "mock3", name: "Ananya Singh", age: 28, location: { area: "Saket" }, bio: "Doctor | AIIMS | Bookworm & chai addict", matchScore: 91, photos: [{ url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop&crop=face" }] },
];

const NAV_ITEMS = [
  { icon: "🏠", label: "Discover", key: "discover" },
  { icon: "💬", label: "Matches", key: "matches" },
  { icon: "❤️", label: "Liked", key: "liked" },
  { icon: "👤", label: "Profile", key: "profile" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("discover");
  const [profiles, setProfiles] = useState(FALLBACK_PROFILES);
  const [currentCard, setCurrentCard] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedWith, setMatchedWith] = useState(null);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({ likedYou: 0, matchCount: 0 });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchProfiles();
    fetchMatches();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch(`${API}/api/profile/discover`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.profiles.length > 0) setProfiles(data.profiles);
    } catch (err) {}
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API}/api/match/my-matches`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setMatches(data.matches); setStats(s => ({ ...s, matchCount: data.count })); }
    } catch (err) {}
  };

  const handleSwipe = async (dir) => {
    const profile = profiles[currentCard];
    setSwipeDir(dir);
    if (dir === "right" || dir === "up") {
      try {
        const res = await fetch(`${API}/api/match/like/${profile._id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ isSuperLike: dir === "up" })
        });
        const data = await res.json();
        if (data.isMatch) {
          setMatchedWith(profile);
          setTimeout(() => setShowMatch(true), 400);
          setTimeout(() => { setShowMatch(false); setMatchedWith(null); fetchMatches(); }, 2800);
        }
      } catch (err) {}
    } else if (dir === "left") {
      try {
        await fetch(`${API}/api/match/pass/${profile._id}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      } catch (err) {}
    }
    setTimeout(() => { setSwipeDir(null); setCurrentCard(p => (p + 1) % profiles.length); }, 380);
  };

  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };

  const profile = profiles[currentCard];
  const photoUrl = profile?.photos?.[0]?.url || "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop&crop=face";

  return (
    <div style={s.root}>
      <div style={s.blob1} /><div style={s.blob2} />
      <header style={s.header}>
        <div style={s.logo}>रूबरू</div>
        <div style={s.headerRight}>
          <div style={s.locationPill}><span>📍</span> Delhi NCR</div>
          <button onClick={handleLogout} style={s.logoutBtn}>↩</button>
        </div>
      </header>
      <main style={s.main}>
        <div style={s.greeting}>
          <p style={s.greetSub}>Namaste 👋</p>
          <h1 style={s.greetName}>{user?.name || "User"}</h1>
          <p style={s.greetTag}>Your city. Your person. 💫</p>
        </div>
        <div style={s.statsRow}>
          {[{ label: "Profiles Today", value: profiles.length, icon: "👀" }, { label: "Liked You", value: stats.likedYou, icon: "❤️" }, { label: "Matches", value: stats.matchCount, icon: "🔥" }].map((st) => (
            <div key={st.label} style={s.statCard}>
              <span style={s.statIcon}>{st.icon}</span>
              <span style={s.statVal}>{st.value}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>
        {activeNav === "discover" && profile && (
          <div style={s.cardSection}>
            <div style={{ ...s.card, transform: swipeDir === "left" ? "rotate(-18deg) translateX(-120%)" : swipeDir === "right" ? "rotate(18deg) translateX(120%)" : "none", transition: swipeDir ? "transform 0.35s ease" : "none" }}>
              <img src={photoUrl} alt={profile.name} style={s.cardImg} />
              <div style={s.cardOverlay}>
                <div style={s.matchBadge}>{profile.matchScore || 90}% Match</div>
                <h2 style={s.cardName}>{profile.name}, {profile.age}</h2>
                <p style={s.cardArea}>📍 {profile.location?.area || "Delhi NCR"}</p>
                <p style={s.cardBio}>{profile.bio}</p>
              </div>
            </div>
            {showMatch && matchedWith && (
              <div style={s.matchPopup}>
                <div style={s.matchPopupInner}>
                  <p style={s.matchEmoji}>🎉</p>
                  <p style={s.matchText}>It's a Match!</p>
                  <p style={s.matchSub}>You & {matchedWith.name}</p>
                </div>
              </div>
            )}
            <div style={s.swipeBtns}>
              <button style={s.passBtn} onClick={() => handleSwipe("left")}>✕</button>
              <button style={s.superBtn} onClick={() => handleSwipe("up")}>⭐</button>
              <button style={s.likeBtn} onClick={() => handleSwipe("right")}>♥</button>
            </div>
          </div>
        )}
        {activeNav === "matches" && (
          <div style={s.section}>
            <p style={s.sectionTitle}>Your Matches</p>
            {matches.length === 0 ? (
              <div style={s.emptyState}><p style={s.emptyIcon}>💔</p><p style={s.emptyText}>No matches yet — keep swiping!</p></div>
            ) : (
              <div style={s.matchList}>
                {matches.map((m) => (
                  <div key={m.matchId} style={s.matchItem}>
                    <div style={s.matchThumb}>{m.user?.name?.[0] || "?"}</div>
                    <div><p style={s.matchName}>{m.user?.name}, {m.user?.age}</p><p style={s.matchArea}>📍 {m.user?.location?.area || "Delhi NCR"}</p></div>
                    <button style={s.chatBtn}>💬 Chat</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeNav === "liked" && (
          <div style={s.section}>
            <p style={s.sectionTitle}>Who Liked You</p>
            <div style={s.emptyState}>
              <p style={s.emptyIcon}>👀</p>
              <p style={s.emptyText}>Upgrade to Gold to see who liked you!</p>
              <button style={s.upgradeBtn} onClick={() => navigate("/upgrade")}>⚡ Upgrade ₹499/mo</button>
            </div>
          </div>
        )}
        {activeNav === "profile" && (
          <div style={s.profileTab}>
            <div style={s.profileAvatar}>{(user?.name || "R")[0].toUpperCase()}</div>
            <h2 style={s.profileName}>{user?.name || "User"}</h2>
            <p style={s.profilePhone}>📱 {user?.phone || ""}</p>
            <div style={s.planBadge}>🆓 Free Plan</div>
            <button style={s.upgradeBtn} onClick={() => navigate("/upgrade")}>⚡ Upgrade to Gold ₹499/mo</button>
            <button onClick={handleLogout} style={s.logoutBtnBig}>Logout</button>
          </div>
        )}
      </main>
      <nav style={s.bottomNav}>
        {NAV_ITEMS.map((n) => (
          <button key={n.key} style={{ ...s.navBtn, color: activeNav === n.key ? "#FFC200" : "#6b7280", borderTop: activeNav === n.key ? "2px solid #FFC200" : "2px solid transparent" }} onClick={() => setActiveNav(n.key)}>
            <span style={s.navIcon}>{n.icon}</span>
            <span style={s.navLabel}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#07091a", color: "#fff", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" },
  blob1: { position: "fixed", top: -120, right: -80, width: 320, height: 320, background: "radial-gradient(circle, rgba(255,194,0,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 },
  blob2: { position: "fixed", bottom: 60, left: -100, width: 280, height: 280, background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 10px", position: "relative", zIndex: 10 },
  logo: { fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg, #FFC200, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 1 },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  locationPill: { background: "rgba(255,194,0,0.12)", border: "1px solid rgba(255,194,0,0.3)", color: "#FFC200", borderRadius: 20, padding: "4px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 },
  logoutBtn: { background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", borderRadius: 10, padding: "6px 10px", cursor: "pointer", fontSize: 16 },
  main: { flex: 1, padding: "10px 20px 80px", position: "relative", zIndex: 5, overflowY: "auto" },
  greeting: { marginBottom: 20 },
  greetSub: { color: "#9ca3af", fontSize: 13, margin: 0 },
  greetName: { fontSize: 28, fontWeight: 800, margin: "2px 0", background: "linear-gradient(135deg, #fff 60%, #FFC200)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  greetTag: { color: "#6b7280", fontSize: 13, margin: 0 },
  statsRow: { display: "flex", gap: 10, marginBottom: 22 },
  statCard: { flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  statIcon: { fontSize: 18 },
  statVal: { fontSize: 20, fontWeight: 800, color: "#FFC200" },
  statLabel: { fontSize: 10, color: "#6b7280", textAlign: "center" },
  cardSection: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  card: { width: "100%", maxWidth: 360, borderRadius: 24, overflow: "hidden", position: "relative", height: 440, boxShadow: "0 25px 60px rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(7,9,26,0.97) 0%, rgba(7,9,26,0.6) 60%, transparent 100%)", padding: "20px 18px 16px" },
  matchBadge: { display: "inline-block", background: "linear-gradient(135deg, #FFC200, #f97316)", color: "#000", fontWeight: 700, fontSize: 11, borderRadius: 20, padding: "3px 10px", marginBottom: 6 },
  cardName: { fontSize: 22, fontWeight: 800, margin: "0 0 2px" },
  cardArea: { color: "#9ca3af", fontSize: 13, margin: "0 0 6px" },
  cardBio: { color: "#d1d5db", fontSize: 13, margin: "0 0 10px", lineHeight: 1.4 },
  swipeBtns: { display: "flex", gap: 20, justifyContent: "center", alignItems: "center" },
  passBtn: { width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.15)", border: "2px solid rgba(239,68,68,0.4)", color: "#ef4444", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  superBtn: { width: 44, height: 44, borderRadius: "50%", background: "rgba(59,130,246,0.15)", border: "2px solid rgba(59,130,246,0.4)", color: "#60a5fa", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  likeBtn: { width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #FFC200, #f472b6)", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(255,194,0,0.35)" },
  matchPopup: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  matchPopupInner: { background: "linear-gradient(135deg, #1a0a2e, #0a1f6e)", border: "2px solid #FFC200", borderRadius: 24, padding: "32px 40px", textAlign: "center", boxShadow: "0 0 60px rgba(255,194,0,0.4)" },
  matchEmoji: { fontSize: 48, margin: "0 0 8px" },
  matchText: { fontSize: 28, fontWeight: 900, margin: "0 0 4px", background: "linear-gradient(135deg, #FFC200, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  matchSub: { color: "#9ca3af", fontSize: 14, margin: 0 },
  section: { paddingTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#fff" },
  matchList: { display: "flex", flexDirection: "column", gap: 12 },
  matchItem: { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)" },
  matchThumb: { width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #FFC200, #f472b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#000", flexShrink: 0 },
  matchName: { fontSize: 14, fontWeight: 700, margin: 0 },
  matchArea: { fontSize: 12, color: "#9ca3af", margin: "2px 0 0" },
  chatBtn: { marginLeft: "auto", background: "linear-gradient(135deg, #FFC200, #f472b6)", border: "none", color: "#000", fontWeight: 700, fontSize: 12, borderRadius: 20, padding: "6px 14px", cursor: "pointer" },
  emptyState: { textAlign: "center", paddingTop: 40 },
  emptyIcon: { fontSize: 48, margin: "0 0 12px" },
  emptyText: { color: "#6b7280", fontSize: 14, marginBottom: 20 },
  profileTab: { display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, gap: 12 },
  profileAvatar: { width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #FFC200, #f472b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: "#000", boxShadow: "0 8px 32px rgba(255,194,0,0.4)" },
  profileName: { fontSize: 22, fontWeight: 800, margin: 0 },
  profilePhone: { color: "#9ca3af", fontSize: 14, margin: 0 },
  planBadge: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 16px", fontSize: 13, color: "#d1d5db" },
  upgradeBtn: { background: "linear-gradient(135deg, #FFC200, #f472b6)", border: "none", color: "#000", fontWeight: 700, fontSize: 14, borderRadius: 24, padding: "12px 28px", cursor: "pointer", width: "100%", maxWidth: 300, boxShadow: "0 8px 24px rgba(255,194,0,0.35)" },
  logoutBtnBig: { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 24, padding: "10px 28px", fontSize: 14, cursor: "pointer", width: "100%", maxWidth: 300 },
  bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(7,9,26,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", zIndex: 50 },
  navBtn: { flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 14px", cursor: "pointer", gap: 2, transition: "color 0.2s" },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 10, fontWeight: 600 },
};
