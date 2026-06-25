import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';
function OtpVerify() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';
  const name = location.state?.name || '';
  const handleVerify = async () => {
    if (!otp) {
      toast.error('OTP bharein');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-phone-otp', {
        phone,
        otp,
        name
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Welcome to RUBAROO!');
      navigate('/profile-setup');
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP galat hai');
    }
    setLoading(false);
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">?????</div>
        <h2 className="auth-title">OTP Verify Karein</h2>
        <p className="auth-subtitle">
          +91 {phone} pe OTP bheja gaya hai
        </p>
        <div className="auth-form">
          <div className="input-group">
            <label>Enter OTP</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="6 digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              autoFocus
            />
          </div>
          <button
            className="btn-primary"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Join RUBAROO'}
          </button>
          <p className="auth-link">
            OTP nahi aaya?{' '}
            <span
              style={{color: '#FF3CAC', cursor: 'pointer'}}
              onClick={() => toast('Resend feature coming soon!')}
            >
              Resend karein
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
export default OtpVerify;
