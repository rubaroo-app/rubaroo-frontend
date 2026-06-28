import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import RubarooLogo from '../components/RubarooLogo';

const API = 'https://rubaroo-production-dfa1.up.railway.app';

function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) { toast.error('Valid phone number daalo!'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/send-otp`, { phone: '+91' + phone });
      toast.success('OTP bheja gaya!');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP nahi gaya!');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) { toast.error('6 digit OTP daalo!'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/verify-phone-otp`, { phone: '+91' + phone, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Welcome back to RUBAROO!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP galat hai!');
    }
    setLoading(false);
  };

  const handleOtpChange = (e, index, inputs) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const otpArr = otp.split('');
    otpArr[index] = val[0];
    setOtp(otpArr.join(''));
    if (val && inputs[index + 1]) inputs[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index, inputs) => {
    if (e.key === 'Backspace') {
      const otpArr = otp.split('');
      otpArr[index] = '';
      setOtp(otpArr.join(''));
      if (inputs[index - 1]) inputs[index - 1].focus();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="r-purple">R</span>U<span className="r-purple">B</span>A<span className="r-purple">R</span>O<span className="r-purple">O</span>
        </div>
        <div className="auth-logo-hindi">
          <span style={{color:'#7B2FBE'}}>à¤°à¥‚</span>à¤¬<span style={{color:'#7B2FBE'}}>à¤°à¥‚</span>
        </div>

        <h2 className="auth-title">Welcome Back â™¥</h2>
        <p className="auth-subtitle">Apne account mein login karein</p>

        {step === 'phone' && (
          <>
            <div className="input-group">
              <label>Phone Number</label>
              <div className="phone-row">
                <button className="phone-flag">ðŸ‡®ðŸ‡³ +91</button>
                <input
                  className="phone-input"
                  type="tel"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  autoFocus
                />
              </div>
            </div>
            <button className="btn-primary" onClick={handleSendOtp} disabled={loading}>
              {loading ? 'Bhej raha hoon...' : 'Send OTP â†’'}
            </button>
            <p className="auth-link" style={{marginTop: 24}}>
              Account nahi hai? <Link to="/register">Register karein</Link>
            </p>
          </>
        )}

        {step === 'otp' && (
          <>
            <p style={{color:'rgba(255,255,255,0.5)', textAlign:'center', fontSize:13, marginBottom:8}}>
              OTP bheja gaya: <strong style={{color:'#FFC200'}}>+91 {phone}</strong>
            </p>
            <div className="otp-row" id="otp-inputs">
              {[0,1,2,3,4,5].map(i => (
                <input
                  key={i}
                  className="otp-box"
                  maxLength={1}
                  type="text"
                  inputMode="numeric"
                  value={otp[i] || ''}
                  autoFocus={i === 0}
                  onChange={(e) => {
                    const inputs = document.querySelectorAll('.otp-box');
                    handleOtpChange(e, i, inputs);
                  }}
                  onKeyDown={(e) => {
                    const inputs = document.querySelectorAll('.otp-box');
                    handleOtpKeyDown(e, i, inputs);
                  }}
                />
              ))}
            </div>
            <button className="btn-primary" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Login to RUBAROO â†’'}
            </button>
            <button className="btn-secondary" onClick={() => setStep('phone')}>
              â† Phone change karo
            </button>
          </>
        )}
      </div>

      {/* Ticker */}
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

export default Login;

