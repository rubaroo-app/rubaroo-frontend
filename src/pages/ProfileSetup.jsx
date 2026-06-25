import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
const ProfileSetup = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ photo: null, photoPreview: null, name: "", age: "", gender: "", bio: "", intent: "" });
  const handlePhotoClick = () => fileInputRef.current.click();
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setForm((f) => ({ ...f, photo: file, photoPreview: reader.result })); };
    reader.readAsDataURL(file);
  };
  const handleChange = (field, value) => { setForm((f) => ({ ...f, [field]: value })); setError(""); };
  const validateStep = () => {
    if (step === 1) {
      if (!form.name.trim()) return "Please enter your name.";
      if (!form.age || form.age < 18 || form.age > 60) return "Age must be between 18-60.";
      if (!form.gender) return "Please select your gender.";
    }
    if (step === 2) { if (!form.intent) return "Please select your intent."; }
    return null;
  };
  const nextStep = () => { const err = validateStep(); if (err) return setError(err); setError(""); setStep((s) => s + 1); };
  const handleSubmit = async () => {
    if (!form.bio.trim()) return setError("Please write something about yourself.");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("age", form.age);
      formData.append("gender", form.gender);
      formData.append("bio", form.bio);
      formData.append("intent", form.intent);
      if (form.photo) formData.append("photo", form.photo);
      const res = await fetch("http://localhost:5000/api/profile/setup", { method: "POST", headers: { Authorization: "Bearer " + token }, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      navigate("/dashboard");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  const styles = {
    page: { minHeight: "100vh", background: "linear-gradient(160deg, #0A1F6E 0%, #060e33 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'Segoe UI', sans-serif" },
    card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,194,0,0.15)", borderRadius: "20px", padding: "36px 28px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" },
    logo: { textAlign: "center", fontSize: "28px", fontWeight: "800", color: "#FFC200", letterSpacing: "2px", marginBottom: "4px" },
    tagline: { textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "28px", letterSpacing: "1.5px", textTransform: "uppercase" },
    progressBar: { display: "flex", gap: "8px", marginBottom: "28px" },
    progressDot: (active, done) => ({ flex: 1, height: "4px", borderRadius: "2px", background: done ? "#FFC200" : active ? "#FFC200" : "rgba(255,255,255,0.15)", opacity: done ? 1 : active ? 0.9 : 0.4 }),
    stepLabel: { color: "rgba(255,255,255,0.5)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px", textAlign: "center" },
    photoCircle: { width: "110px", height: "110px", borderRadius: "50%", border: "2px dashed rgba(255,194,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", margin: "0 auto 24px", overflow: "hidden", background: "rgba(255,194,0,0.06)" },
    photoImg: { width: "100%", height: "100%", objectFit: "cover" },
    label: { color: "rgba(255,255,255,0.6)", fontSize: "12px", marginBottom: "6px", display: "block" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "12px 14px", color: "#fff", fontSize: "15px", outline: "none", marginBottom: "16px", boxSizing: "border-box" },
    textarea: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "12px 14px", color: "#fff", fontSize: "15px", outline: "none", marginBottom: "16px", boxSizing: "border-box", resize: "none", minHeight: "100px", fontFamily: "inherit" },
    chipRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" },
    chip: (sel) => ({ padding: "9px 18px", borderRadius: "50px", border: sel ? "1.5px solid #FFC200" : "1.5px solid rgba(255,255,255,0.15)", background: sel ? "rgba(255,194,0,0.15)" : "rgba(255,255,255,0.04)", color: sel ? "#FFC200" : "rgba(255,255,255,0.6)", fontSize: "13px", cursor: "pointer", fontWeight: sel ? "600" : "400" }),
    intentRow: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
    intentCard: (sel) => ({ padding: "14px 16px", borderRadius: "12px", border: sel ? "1.5px solid #FFC200" : "1.5px solid rgba(255,255,255,0.1)", background: sel ? "rgba(255,194,0,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }),
    intentText: (sel) => ({ color: sel ? "#FFC200" : "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: sel ? "600" : "400" }),
    intentSub: { color: "rgba(255,255,255,0.35)", fontSize: "11px", marginTop: "2px" },
    btn: { width: "100%", padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg, #FFC200, #e6aa00)", border: "none", color: "#0A1F6E", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "8px" },
    backBtn: { background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", marginTop: "14px", display: "block", textAlign: "center", width: "100%" },
    error: { background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#ff6b6b", fontSize: "13px", marginBottom: "14px", textAlign: "center" },
    skipText: { textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "12px", marginTop: "16px", cursor: "pointer" },
  };
  const intents = [
    { value: "casual", label: "Casual Hangout", sub: "Friends, fun, casual dating" },
    { value: "serious", label: "Serious Relationship", sub: "Long term, serious relationship" },
    { value: "marriage", label: "Marriage", sub: "Looking for a life partner" },
  ];
  const genders = ["Male", "Female", "Non-binary", "Other"];
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>RUBAROO</div>
        <div style={styles.tagline}>Your City. Your Person.</div>
        <div style={styles.progressBar}>
          {[1,2,3].map((s) => (<div key={s} style={styles.progressDot(step===s, step>s)} />))}
        </div>
        {step===1 && (<>
          <div style={styles.stepLabel}>Step 1 of 3 - Basic Info</div>
          <div style={styles.photoCircle} onClick={handlePhotoClick}>
            {form.photoPreview
              ? (<img src={form.photoPreview} alt="preview" style={styles.photoImg} />)
              : (<div style={{textAlign:"center"}}><div style={{fontSize:"36px",color:"rgba(255,194,0,0.7)",fontWeight:"300",lineHeight:1}}>+</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",marginTop:"6px"}}>Add Photo</div></div>)
            }
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} style={{display:"none"}} onChange={handlePhotoChange} />
          <label style={styles.label}>Name</label>
          <input style={styles.input} placeholder="Your Name" value={form.name} onChange={(e)=>handleChange("name",e.target.value)} />
          <label style={styles.label}>Age</label>
          <input style={styles.input} type="number" placeholder="18-60" min={18} max={60} value={form.age} onChange={(e)=>handleChange("age",e.target.value)} />
          <label style={styles.label}>Gender</label>
          <div style={styles.chipRow}>
            {genders.map((g)=>(<div key={g} style={styles.chip(form.gender===g)} onClick={()=>handleChange("gender",g)}>{g}</div>))}
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button style={styles.btn} onClick={nextStep}>Next</button>
        </>)}
        {step===2 && (<>
          <div style={styles.stepLabel}>Step 2 of 3 - Your Intent</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:"14px",marginBottom:"18px",textAlign:"center"}}>Why are you here?</div>
          <div style={styles.intentRow}>
            {intents.map((intent)=>(
              <div key={intent.value} style={styles.intentCard(form.intent===intent.value)} onClick={()=>handleChange("intent",intent.value)}>
                <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"rgba(255,194,0,0.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"#FFC200",fontWeight:"700",fontSize:"16px",flexShrink:0}}>
                  {intent.value==="casual"?"C":intent.value==="serious"?"S":"M"}
                </div>
                <div>
                  <div style={styles.intentText(form.intent===intent.value)}>{intent.label}</div>
                  <div style={styles.intentSub}>{intent.sub}</div>
                </div>
              </div>
            ))}
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button style={styles.btn} onClick={nextStep}>Next</button>
          <button style={styles.backBtn} onClick={()=>setStep(1)}>Back</button>
        </>)}
        {step===3 && (<>
          <div style={styles.stepLabel}>Step 3 of 3 - About You</div>
          <div style={{color:"rgba(255,255,255,0.7)",fontSize:"14px",marginBottom:"18px",textAlign:"center"}}>Tell people about yourself</div>
          <label style={styles.label}>Bio</label>
          <textarea style={styles.textarea} placeholder="E.g. Delhi guy, chai lover, weekend at Lodhi Garden. Looking for a genuine connection..." value={form.bio} maxLength={200} onChange={(e)=>handleChange("bio",e.target.value)} />
          <div style={{color:"rgba(255,255,255,0.25)",fontSize:"11px",marginBottom:"16px",textAlign:"right"}}>{form.bio.length}/200</div>
          {error && <div style={styles.error}>{error}</div>}
          <button style={{...styles.btn,opacity:loading?0.7:1}} onClick={handleSubmit} disabled={loading}>{loading?"Saving...":"Complete Profile"}</button>
          <button style={styles.backBtn} onClick={()=>setStep(2)}>Back</button>
          <div style={styles.skipText} onClick={()=>navigate("/dashboard")}>Skip for now</div>
        </>)}
      </div>
    </div>
  );
};
export default ProfileSetup;