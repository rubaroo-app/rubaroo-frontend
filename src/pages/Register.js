import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import RubarooLogo from '../components/RubarooLogo';

const API = 'https://rubaroo-production-dfa1.up.railway.app';

function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!name.trim()) { toast.error('Naam daalo!'); return; }
    if (!phone || phone.length < 10) { toast.error('Valid phone number daalo!'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/send-otp`, { phone: '+91' + phone });
      toast.success('OTP bheja gaya!');
      navigate('/verify-otp', { state: { phone: '+91' + phone, name } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP bhejne mein dikkat');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="r-purple">R</span>U<span className="r-purple">B</span>A<span className="r-purple">R</span>O<span className="r-purple">O</span>
        </div>
        <div className="auth-logo-hindi">
          <span style={{color:'#7B2FBE'}}>à¤°à¥‚</span>à¤¬<span style={{color:'#7B2FBE'}}>à¤°à¥‚</span>
        </div>
        <h2 className="auth-title">Join RUBAROO âš¥</h2>
        <p className="auth-subtitle">Delhi NCR ka premium dating platform</p>
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" placeholder="Aapka naam" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <div className="phone-row">
            <button className="phone-flag">ðŸ‡®ðŸ‡³ +91</button>
            <input className="phone-input" type="tel" placeholder="Mobile number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} />
          </div>
        </div>
        <button className="btn-primary" onClick={handleSendOTP} disabled={loading}>
          {loading ? 'OTP bhej rahe hain...' : 'Get OTP â†’'}
        </button>
        <p className="auth-link">Already account hai? <Link to="/login">Login karein</Link></p>
      </div>
      <div className="auth-ticker">
        <div className="ticker-track">
          {['Delhi NCR Only','Verified Profiles','Free to Join','AI-Powered Matching','Zero Fake Profiles','Real Connections',
            'Delhi NCR Only','Verified Profiles','Free to Join','AI-Powered Matching','Zero Fake Profiles','Real Connections'].map((t,i) => (
            <span key={i} className="ticker-item">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Register;



