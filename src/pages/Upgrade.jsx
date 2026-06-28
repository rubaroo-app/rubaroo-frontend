import React, { useState } from 'react';

const API = 'https://rubaroo-production-dfa1.up.railway.app';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; color: #fff; font-family: 'DM Sans', sans-serif; }
  .up-wrap { min-height: 100vh; background: #000; display: flex; flex-direction: column; }
  .up-topbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 32px; border-bottom: 1px solid #111; }
  .up-logo { font-family: 'Cormorant Garant', serif; font-size: 20px; font-weight: 600; letter-spacing: 8px; color: #fff; text-transform: uppercase; cursor: pointer; }
  .up-logo span { color: #7B2FBE; }
  .up-back { background: none; border: 1px solid #222; color: #666; padding: 8px 18px; border-radius: 2px; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .up-back:hover { border-color: #fff; color: #fff; }
  .up-hero { text-align: center; padding: 64px 24px 48px; }
  .up-hero-label { font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #7B2FBE; margin-bottom: 16px; }
  .up-hero-title { font-family: 'Cormorant Garant', serif; font-size: 48px; font-weight: 600; color: #fff; letter-spacing: 2px; margin-bottom: 12px; }
  .up-hero-sub { font-size: 13px; color: #444; letter-spacing: 2px; text-transform: uppercase; }
  .up-plans { display: flex; justify-content: center; gap: 20px; padding: 0 24px 64px; flex-wrap: wrap; max-width: 1100px; margin: 0 auto; width: 100%; }
  .up-plan { flex: 1; min-width: 220px; max-width: 260px; background: #080808; border: 1px solid #161616; border-radius: 4px; padding: 36px 28px; display: flex; flex-direction: column; gap: 20px; transition: all 0.3s; position: relative; cursor: pointer; }
  .up-plan:hover { border-color: #2a2a2a; transform: translateY(-4px); }
  .up-plan.featured { border-color: #fff; background: #0a0a0a; }
  .up-plan.free { border-color: #111; }
  .up-featured-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #fff; color: #000; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; padding: 4px 14px; border-radius: 2px; white-space: nowrap; }
  .up-plan-name { font-family: 'Cormorant Garant', serif; font-size: 22px; font-weight: 600; color: #fff; letter-spacing: 2px; }
  .up-plan-price { display: flex; align-items: flex-end; gap: 4px; }
  .up-plan-amount { font-family: 'Cormorant Garant', serif; font-size: 42px; font-weight: 600; color: #fff; line-height: 1; }
  .up-plan-period { font-size: 11px; color: #333; letter-spacing: 1px; margin-bottom: 6px; }
  .up-plan-features { display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .up-feature { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #555; letter-spacing: 1px; }
  .up-feature.active { color: #aaa; }
  .up-feature-dot { width: 4px; height: 4px; border-radius: 50%; background: #222; flex-shrink: 0; }
  .up-feature.active .up-feature-dot { background: #fff; }
  .up-plan-btn { width: 100%; padding: 14px; background: none; border: 1px solid #222; color: #444; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; border-radius: 2px; cursor: pointer; transition: all 0.2s; }
  .up-plan-btn:hover { border-color: #555; color: #888; }
  .up-plan.featured .up-plan-btn { background: #fff; color: #000; border-color: #fff; }
  .up-plan.featured .up-plan-btn:hover { background: #e8e8e8; }
  .up-plan-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .up-loading-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 999; font-family: 'Cormorant Garant', serif; font-size: 20px; color: #333; letter-spacing: 4px; }
  .up-ticker { background: #E8173A; padding: 8px 0; overflow: hidden; white-space: nowrap; position: fixed; bottom: 0; left: 0; right: 0; }
  .up-ticker-inner { display: inline-block; animation: upTicker 30s linear infinite; }
  @keyframes upTicker { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }
  .up-ticker-text { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #fff; padding: 0 48px; }
  @media (max-width: 768px) { .up-hero-title { font-size: 32px; } .up-plans { gap: 16px; } .up-plan { min-width: 100%; max-width: 100%; } }
`;

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    amount: '0',
    period: 'forever',
    features: [
      { text: '5 swipes per day', active: true },
      { text: 'Basic matching', active: true },
      { text: 'Limited chat', active: true },
      { text: 'No super likes', active: false },
      { text: 'No AI features', active: false },
    ],
    featured: false,
    btnText: 'Current Plan'
  },
  {
    id: 'plus',
    name: 'Plus',
    amount: '199',
    period: '/month',
    features: [
      { text: '50 swipes per day', active: true },
      { text: 'Advanced matching', active: true },
      { text: 'Unlimited chat', active: true },
      { text: '5 super likes/day', active: true },
      { text: 'See who liked you', active: true },
    ],
    featured: false,
    btnText: 'Get Plus'
  },
  {
    id: 'gold',
    name: 'Gold',
    amount: '499',
    period: '/month',
    features: [
      { text: 'Unlimited swipes', active: true },
      { text: 'AI-powered matching', active: true },
      { text: 'Priority in discover', active: true },
      { text: 'Unlimited super likes', active: true },
      { text: 'AI conversation tips', active: true },
    ],
    featured: true,
    btnText: 'Get Gold'
  },
  {
    id: 'business',
    name: 'Business',
    amount: '999',
    period: '/month',
    features: [
      { text: 'Everything in Gold', active: true },
      { text: 'Verified badge', active: true },
      { text: 'Top of discover feed', active: true },
      { text: 'AI Trio access', active: true },
      { text: 'Dedicated support', active: true },
    ],
    featured: false,
    btnText: 'Get Business'
  }
];

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Upgrade() {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleUpgrade = async (plan) => {
    if (plan.id === 'free') return;
    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert('Razorpay load failed. Check internet.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ plan: plan.id })
      });

      const data = await res.json();
      if (!data.orderId) throw new Error('Order creation failed');

      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        'RUBAROO',
        description: data.planName,
        order_id:    data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                plan: plan.id
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert('✦ ' + plan.name + ' activated!');
              window.location.href = '/dashboard';
            }
          } catch (e) {
            alert('Verification failed. Contact support.');
          }
        },
        prefill: { contact: '' },
        theme: { color: '#ffffff' },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      alert('Something went wrong: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{FONTS + styles}</style>
      {loading && <div className="up-loading-overlay">Processing...</div>}
      <div className="up-wrap">
        <header className="up-topbar">
          <div className="up-logo" onClick={() => window.location.href = '/dashboard'}>
            <span>R</span>UBAROO
          </div>
          <button className="up-back" onClick={() => window.location.href = '/dashboard'}>
            ← Back
          </button>
        </header>

        <div className="up-hero">
          <div className="up-hero-label">✦ Membership</div>
          <div className="up-hero-title">Choose Your Plan</div>
          <div className="up-hero-sub">Unlock Delhi NCR's Premium Experience</div>
        </div>

        <div className="up-plans">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`up-plan ${plan.featured ? 'featured' : ''} ${plan.id === 'free' ? 'free' : ''}`}>
              {plan.featured && <div className="up-featured-badge">Most Popular</div>}
              <div className="up-plan-name">{plan.name}</div>
              <div className="up-plan-price">
                <div className="up-plan-amount">
                  {plan.amount === '0' ? 'Free' : '₹' + plan.amount}
                </div>
                {plan.amount !== '0' && (
                  <div className="up-plan-period">{plan.period}</div>
                )}
              </div>
              <div className="up-plan-features">
                {plan.features.map((f, i) => (
                  <div key={i} className={'up-feature' + (f.active ? ' active' : '')}>
                    <div className="up-feature-dot" />
                    {f.text}
                  </div>
                ))}
              </div>
              <button
                className="up-plan-btn"
                onClick={() => handleUpgrade(plan)}
                disabled={plan.id === 'free' || loading}
              >
                {plan.btnText}
              </button>
            </div>
          ))}
        </div>

        <div className="up-ticker">
          <span className="up-ticker-inner">
            <span className="up-ticker-text">
              Premium Memberships &nbsp;·&nbsp; Delhi NCR Exclusive &nbsp;·&nbsp;
              Secure Payments via Razorpay &nbsp;·&nbsp; रूबरू &nbsp;·&nbsp;
              Your City. Your Person. &nbsp;·&nbsp;
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
