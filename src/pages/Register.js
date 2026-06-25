import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!name || !phone) {
      toast.error('Name aur phone dono bharein');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://rubaroo-production-dfa1.up.railway.app/api/auth/send-otp', { phone });
      toast.success('OTP bheja gaya!');
      navigate('/verify-otp', { state: { phone, name } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP bhejne mein dikkat');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">रूबरू</div>
        <h2 className="auth-title">Join RUBARU</h2>
        <p className="auth-subtitle">India ka premium dating platform</p>
        <div className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="Aapka naam" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={handleSendOTP} disabled={loading}>
            {loading ? 'OTP bhej rahe hain...' : 'Get OTP'}
          </button>
          <p className="auth-link">Already account hai? <Link to="/">Login karein</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;