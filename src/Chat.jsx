import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const API = 'http://localhost:5000';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; color: #fff; font-family: 'DM Sans', sans-serif; }

  .rc-wrap {
    min-height: 100vh;
    background: #000;
    display: flex;
    flex-direction: column;
  }

  /* TOPBAR */
  .rc-topbar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 28px;
    border-bottom: 1px solid #111;
    background: #000;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .rc-back {
    background: none;
    border: 1px solid #222;
    color: #666;
    width: 36px;
    height: 36px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .rc-back:hover { border-color: #fff; color: #fff; }

  .rc-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #111;
    border: 1px solid #222;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .rc-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .rc-user-info { flex: 1; }

  .rc-user-name {
    font-family: 'Cormorant Garant', serif;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 1px;
  }

  .rc-user-status {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #333;
    margin-top: 2px;
  }

  .rc-user-status.online { color: #1a7a1a; }

  .rc-logo {
    font-family: 'Cormorant Garant', serif;
    font-size: 14px;
    letter-spacing: 6px;
    color: #222;
    text-transform: uppercase;
  }

  .rc-logo span { color: #7B2FBE; }

  /* MESSAGES AREA */
  .rc-messages {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 120px;
  }

  .rc-messages::-webkit-scrollbar { width: 4px; }
  .rc-messages::-webkit-scrollbar-track { background: #000; }
  .rc-messages::-webkit-scrollbar-thumb { background: #111; border-radius: 2px; }

  /* DATE DIVIDER */
  .rc-date-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 16px 0;
  }

  .rc-date-divider::before,
  .rc-date-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #0d0d0d;
  }

  .rc-date-label {
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #222;
  }

  /* MESSAGE BUBBLES */
  .rc-msg-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }

  .rc-msg-row.mine { flex-direction: row-reverse; }

  .rc-msg-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #111;
    border: 1px solid #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .rc-msg-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .rc-bubble {
    max-width: 65%;
    padding: 12px 16px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: 0.3px;
    position: relative;
  }

  .rc-bubble.theirs {
    background: #0d0d0d;
    border: 1px solid #161616;
    color: #ccc;
    border-radius: 2px 12px 12px 2px;
  }

  .rc-bubble.mine {
    background: #fff;
    color: #000;
    border-radius: 12px 2px 2px 12px;
  }

  .rc-bubble-time {
    font-size: 9px;
    letter-spacing: 1px;
    margin-top: 4px;
    opacity: 0.4;
    text-align: right;
  }

  .rc-bubble.mine .rc-bubble-time { color: #000; }
  .rc-bubble.theirs .rc-bubble-time { color: #fff; }

  /* TYPING INDICATOR */
  .rc-typing {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    opacity: 0.6;
  }

  .rc-typing-dots {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
    background: #0d0d0d;
    border: 1px solid #161616;
    border-radius: 2px 12px 12px 2px;
  }

  .rc-typing-dots span {
    width: 6px;
    height: 6px;
    background: #333;
    border-radius: 50%;
    animation: rcDot 1.2s infinite;
  }

  .rc-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .rc-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes rcDot {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* INPUT AREA */
  .rc-input-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 24px;
    background: #000;
    border-top: 1px solid #0d0d0d;
    display: flex;
    gap: 12px;
    align-items: flex-end;
    z-index: 100;
  }

  .rc-input {
    flex: 1;
    background: #080808;
    border: 1px solid #1a1a1a;
    border-radius: 2px;
    padding: 14px 18px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    resize: none;
    outline: none;
    min-height: 52px;
    max-height: 120px;
    transition: border-color 0.2s;
    line-height: 1.5;
  }

  .rc-input::placeholder { color: #2a2a2a; letter-spacing: 1px; }
  .rc-input:focus { border-color: #2a2a2a; }

  .rc-send {
    width: 52px;
    height: 52px;
    background: #fff;
    border: none;
    border-radius: 2px;
    color: #000;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .rc-send:hover { background: #e0e0e0; transform: scale(1.04); }
  .rc-send:disabled { background: #0d0d0d; color: #222; cursor: not-allowed; transform: none; }

  /* EMPTY STATE */
  .rc-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    opacity: 0.3;
    padding-bottom: 80px;
  }

  .rc-empty-icon { font-size: 40px; }

  .rc-empty-text {
    font-family: 'Cormorant Garant', serif;
    font-size: 18px;
    color: #fff;
    letter-spacing: 2px;
  }

  .rc-empty-sub {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #fff;
  }

  /* LOADING */
  .rc-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #000;
    font-family: 'Cormorant Garant', serif;
    font-size: 18px;
    color: #222;
    letter-spacing: 4px;
  }

  @media (max-width: 768px) {
    .rc-messages { padding: 20px 16px; padding-bottom: 100px; }
    .rc-input-wrap { padding: 12px 16px; }
    .rc-bubble { max-width: 80%; }
  }
`;

let socketInstance = null;

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [matchInfo, setMatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const token = localStorage.getItem('token');
  const myId = localStorage.getItem('userId');

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API}/api/chat/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMessages(data.messages || []);

        // Get match info from matches
        const mRes = await fetch(`${API}/api/swipe/matches`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const mData = await mRes.json();
        const match = (mData.matches || []).find(m => m._id === matchId);
        if (match) {
          const other = match.users?.find(u => u._id !== myId);
          setMatchInfo(other);
        }
      } catch (e) {
        console.error('History fetch error:', e);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [matchId, token, myId]);

  // Socket setup
  useEffect(() => {
    if (!token) return;

    socketInstance = io(API, {
      auth: { token },
      transports: ['websocket']
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      socketInstance.emit('join_room', matchId);
    });

    socketInstance.on('disconnect', () => setConnected(false));

    socketInstance.on('receive_message', (msg) => {
      setMessages(prev => {
        const exists = prev.some(m => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    socketInstance.on('user_typing', () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    });

    socketInstance.on('user_stop_typing', () => setIsTyping(false));

    return () => {
      socketInstance?.disconnect();
      socketInstance = null;
    };
  }, [matchId, token]);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleTyping = (e) => {
    setText(e.target.value);
    socketInstance?.emit('typing', matchId);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketInstance?.emit('stop_typing', matchId);
    }, 1000);

    // Auto resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const handleSend = () => {
    if (!text.trim() || !socketInstance) return;
    socketInstance.emit('send_message', { matchId, text: text.trim() });
    setText('');
    if (inputRef.current) {
      inputRef.current.style.height = '52px';
    }
    socketInstance.emit('stop_typing', matchId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = formatDate(msg.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  if (loading) return (
    <>
      <style>{FONTS + styles}</style>
      <div className="rc-loading">RUBAROO</div>
    </>
  );

  return (
    <>
      <style>{FONTS + styles}</style>
      <div className="rc-wrap">

        {/* TOPBAR */}
        <header className="rc-topbar">
          <button className="rc-back" onClick={() => navigate('/dashboard')}>←</button>
          <div className="rc-avatar">
            {matchInfo?.photos?.[0]
              ? <img src={`${API}/${matchInfo.photos[0]}`} alt={matchInfo.name} />
              : '◈'}
          </div>
          <div className="rc-user-info">
            <div className="rc-user-name">
              {matchInfo?.name || 'Your Match'}
            </div>
            <div className={`rc-user-status ${connected ? 'online' : ''}`}>
              {isTyping ? 'Typing...' : connected ? 'Online' : 'Connecting...'}
            </div>
          </div>
          <div className="rc-logo"><span>R</span>UBAROO</div>
        </header>

        {/* MESSAGES */}
        <div className="rc-messages">
          {messages.length === 0 ? (
            <div className="rc-empty">
              <div className="rc-empty-icon">◈</div>
              <div className="rc-empty-text">Start the conversation</div>
              <div className="rc-empty-sub">Say something thoughtful</div>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="rc-date-divider">
                  <span className="rc-date-label">{date}</span>
                </div>
                {msgs.map((msg, i) => {
                  const isMine = msg.senderId === myId ||
                    msg.senderId?._id === myId ||
                    msg.senderId?.toString() === myId;
                  return (
                    <div key={msg._id || i} className={`rc-msg-row ${isMine ? 'mine' : ''}`}>
                      {!isMine && (
                        <div className="rc-msg-avatar">
                          {matchInfo?.photos?.[0]
                            ? <img src={`${API}/${matchInfo.photos[0]}`} alt="" />
                            : '◈'}
                        </div>
                      )}
                      <div className={`rc-bubble ${isMine ? 'mine' : 'theirs'}`}>
                        {msg.text}
                        <div className="rc-bubble-time">{formatTime(msg.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          {isTyping && (
            <div className="rc-typing">
              <div className="rc-msg-avatar">◈</div>
              <div className="rc-typing-dots">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="rc-input-wrap">
          <textarea
            ref={inputRef}
            className="rc-input"
            placeholder="Write something..."
            value={text}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="rc-send"
            onClick={handleSend}
            disabled={!text.trim()}
          >
            ➤
          </button>
        </div>

      </div>
    </>
  );
}