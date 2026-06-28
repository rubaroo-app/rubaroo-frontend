import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

const API = 'https://rubaroo-production-dfa1.up.railway.app';

function OtpVerify() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search); const phone = location.state?.phone || params.get("phone") || localStorage.getItem("rubaroo_phone") || "";
  const name = location.state?.name || '';

  const handleVerify = async () => {
    if (!otp || otp.length < 6) { toast.error('6 digit OTP daalo!'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/verify-phone-otp`, { phone, otp, name });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Welcome to RUBAROO!');
      navigate('/profile-setup');
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP galat hai!');
    }
    setLoading(false);
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const otpArr = otp.padEnd(6, ' ').split('');
    otpArr[index] = val[0];
    const newOtp = otpArr.join('').replace(/ /g, '');
    setOtp(newOtp);
    const inputs = document.querySelectorAll('.otp-box');
    if (inputs[index + 1]) inputs[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const otpArr = otp.padEnd(6, ' ').split('');
      otpArr[index] = '';
      setOtp(otpArr.join('').replace(/ /g, ''));
      const inputs = document.querySelectorAll('.otp-box');
      if (inputs[index - 1]) inputs[index - 1].focus();
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${API}/api/auth/send-otp`, { phone });
      toast.success('OTP dobara bheja gaya!');
    } catch (err) {
      toast.error('Resend failed!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="r-purple">R</span>U<span className="r-purple">B</span>A<span className="r-purple">R</span>O<span className="r-purple">O</span>
        </div>
        <div className="auth-logo-hindi">
          <span style={{color:'#7B2FBE'}}>रू</span>ब<span style={{color:'#7B2FBE'}}>रू</span>
        </div>
        <h2 className="auth-title">OTP Verify Karein 📱</h2>
        <p className="auth-subtitle">OTP bheja gaya: <strong style={{color:'#FFC200'}}>{phone}</strong></p>
        <div className="otp-row">
          {[0,1,2,3,4,5].map(i => (
            <input key={i} className="otp-box" maxLength={1} type="text" inputMode="numeric" value={otp[i] || ''} autoFocus={i === 0} onChange={(e) => handleOtpChange(e, i)} onKeyDown={(e) => handleOtpKeyDown(e, i)} />
          ))}
        </div>
        <button className="btn-primary" onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify & Join RUBAROO →'}
        </button>
        <p className="auth-link">OTP nahi aaya? <span onClick={handleResend}>Resend karein</span></p>
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

export default OtpVerify;

