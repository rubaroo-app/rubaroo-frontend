import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!phone) { toast.error('Phone number daalo!'); return; }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { phone });
      toast.success('OTP bheja gaya!');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP nahi gaya!');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) { toast.error('OTP daalo!'); return; }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-phone-otp', { phone, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Welcome back to RUBAROO!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP galat hai!');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">रूबरू</div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Apne account mein login karein</p>
        <div className="auth-form">
          {step === 'phone' && (
            <>
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="7011266957"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                />
              </div>
              <button className="btn-primary" onClick={handleSendOtp} disabled={loading}>
                {loading ? 'Bhej raha hoon...' : 'Get OTP'}
              </button>
            </>
          )}
          {step === 'otp' && (
            <>
              <p style={{color:'#9ca3af',textAlign:'center',marginBottom:16}}>+91 {phone} pe OTP bheja gaya hai</p>
              <div className="input-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="6 digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  autoFocus
                />
              </div>
              <button className="btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? 'Verifying...' : 'Login to RUBAROO'}
              </button>
              <p style={{textAlign:'center',marginTop:12}}>
                <span style={{color:'#FF3CAC',cursor:'pointer'}} onClick={() => setStep('phone')}>
                  ← Phone change karo
                </span>
              </p>
            </>
          )}
          <p className="auth-link">
            Account nahi hai? <Link to="/register">Register karein</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;
