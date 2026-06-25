import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

const PLANS = [
  { key: "plus", name: "Plus", price: 199, color: "#60a5fa", features: ["50 likes/day", "See who liked you", "Advanced filters", "Priority support"] },
  { key: "gold", name: "Gold", price: 499, color: "#FFC200", popular: true, features: ["Unlimited likes", "See who liked you", "SuperLike x5/day", "Read receipts", "Boost profile", "AI Matchmaking"] },
  { key: "business", name: "Business", price: 999, color: "#f472b6", features: ["Everything in Gold", "Verified badge", "Top of discover", "Dedicated support", "Analytics dashboard"] },
];

export default function Upgrade() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("gold");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem("token");

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const orderRes = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected })
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error);
      const verifyRes = await fetch(`${API}/api/payment/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected, orderId: orderData.order.id })
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) throw new Error(verifyData.error);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.plan = verifyData.plan;
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      alert("Payment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = PLANS.find(p => p.key === selected);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button onClick={() => navigate("/dashboard")} style={s.backBtn}>← Back</button>
        <div style={s.logo}>RUBAROO</div>
        <div style={{ width: 60 }} />
      </div>

      {success ? (
        <div style={s.successBox}>
          <div style={s.successEmoji}>🎉</div>
          <div style={s.successText}>Plan Activated!</div>
          <div style={s.successSub}>Redirecting to dashboard...</div>
        </div>
      ) : (
        <>
          <div style={s.heroText}>
            <h1 style={s.title}>Upgrade Your Plan</h1>
            <p style={s.sub}>Find your person faster with premium features</p>
          </div>

          <div style={s.plansCol}>
            {PLANS.map((plan) => (
              <div key={plan.key} style={{ ...s.planCard, border: selected === plan.key ? `2px solid ${plan.color}` : "2px solid rgba(255,255,255,0.08)", background: selected === plan.key ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)", position: "relative" }} onClick={() => setSelected(plan.key)}>
                {plan.popular && <div style={s.popularBadge}>Most Popular</div>}
                <div style={{ ...s.planName, color: plan.color }}>{plan.name}</div>
                <div style={s.planPrice}>₹{plan.price}<span style={s.planPer}>/mo</span></div>
                <div style={s.featureList}>
                  {plan.features.map(f => (
                    <div key={f} style={s.featureItem}><span style={{ color: plan.color }}>✓</span> {f}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={s.bottomSection}>
            <button style={{ ...s.upgradeBtn, opacity: loading ? 0.7 : 1 }} onClick={handleUpgrade} disabled={loading}>
              {loading ? "Processing..." : `Upgrade to ${selectedPlan?.name} — ₹${selectedPlan?.price}/mo`}
            </button>
            <p style={s.secureText}>🔒 Secure payment via Razorpay</p>
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#07091a", color: "#fff", fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", padding: "0 0 40px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px" },
  backBtn: { background: "none", border: "none", color: "#9ca3af", fontSize: 14, cursor: "pointer" },
  logo: { fontSize: 18, fontWeight: 800, color: "#FFC200" },
  heroText: { textAlign: "center", padding: "20px 20px 10px" },
  title: { fontSize: 26, fontWeight: 800, margin: "0 0 8px", background: "linear-gradient(135deg, #fff, #FFC200)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  sub: { color: "#6b7280", fontSize: 14, margin: 0 },
  plansCol: { display: "flex", flexDirection: "column", gap: 12, padding: "20px 16px" },
  planCard: { borderRadius: 16, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s" },
  popularBadge: { position: "absolute", top: -10, right: 16, background: "linear-gradient(135deg, #FFC200, #f97316)", color: "#000", fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "3px 12px" },
  planName: { fontSize: 18, fontWeight: 800, marginBottom: 4 },
  planPrice: { fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 12 },
  planPer: { fontSize: 14, color: "#6b7280", fontWeight: 400 },
  featureList: { display: "flex", flexDirection: "column", gap: 6 },
  featureItem: { fontSize: 13, color: "#d1d5db", display: "flex", gap: 8, alignItems: "center" },
  bottomSection: { padding: "0 16px", textAlign: "center" },
  upgradeBtn: { width: "100%", padding: "16px", borderRadius: 14, background: "linear-gradient(135deg, #FFC200, #f472b6)", border: "none", color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(255,194,0,0.35)" },
  secureText: { color: "#4b5563", fontSize: 12, marginTop: 12 },
  successBox: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, minHeight: "80vh" },
  successEmoji: { fontSize: 64 },
  successText: { fontSize: 28, fontWeight: 800, color: "#FFC200" },
  successSub: { color: "#6b7280", fontSize: 14 },
};