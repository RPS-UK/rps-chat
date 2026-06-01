/**
 * Restaurant Property Sellers — AI Chat Widget
 * Paste the <script> tag into your WordPress site footer.
 */

(function () {
  const PROXY_URL = 'https://rps-chat.vercel.app/api/chat';

  const COLORS = {
    primary: '#2C5F2E',
    secondary: '#FFD700',
    light: '#FFFFFF',
    dark: '#1a3a1c',
    border: '#c8dbc9',
    bg: '#f5f9f5',
  };

  const css = `
    #rps-chat-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 99999;
      width: 72px; height: 72px; border-radius: 50%;
      background: ${COLORS.primary};
      border: 3px solid ${COLORS.secondary};
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 3px;
      box-shadow: 0 6px 20px rgba(44,95,46,0.45);
      transition: transform 0.2s, box-shadow 0.2s;
      padding: 0;
    }
    #rps-chat-btn:hover { transform: scale(1.08); box-shadow: 0 8px 25px rgba(44,95,46,0.55); }
    #rps-chat-btn .rps-btn-icon {
      font-size: 11px; font-weight: 800; color: #fff;
      letter-spacing: 0.5px; font-family: -apple-system, sans-serif;
      line-height: 1;
    }
    #rps-chat-btn .rps-btn-label {
      font-size: 8px; font-weight: 700; color: ${COLORS.secondary};
      letter-spacing: 0.8px; font-family: -apple-system, sans-serif;
      line-height: 1; text-align: center;
    }
    #rps-chat-btn .rps-chat-svg {
      width: 28px; height: 28px; fill: #fff;
    }

    #rps-chat-box {
      position: fixed; bottom: 115px; right: 28px; z-index: 99999;
      width: 370px; height: 560px; border-radius: 16px; overflow: hidden;
      border: 1px solid ${COLORS.border};
      display: flex; flex-direction: column;
      background: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      transform: scale(0.95) translateY(10px); opacity: 0;
      transition: transform 0.25s, opacity 0.25s; pointer-events: none;
    }
    #rps-chat-box.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

    .rps-header {
      background: ${COLORS.primary};
      padding: 14px 16px; display: flex; align-items: center; gap: 10px; flex-shrink: 0;
      border-bottom: 3px solid ${COLORS.secondary};
    }
    .rps-header-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: ${COLORS.secondary};
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-weight: 800; font-size: 13px; color: ${COLORS.primary};
      letter-spacing: 0.3px;
    }
    .rps-header-title { font-size: 14px; font-weight: 700; margin: 0; color: #fff; }
    .rps-header-sub { font-size: 11px; color: ${COLORS.secondary}; margin: 2px 0 0; }
    .rps-close {
      margin-left: auto; background: none; border: none;
      color: #fff; cursor: pointer; font-size: 22px; opacity: 0.8; line-height: 1;
    }
    .rps-close:hover { opacity: 1; }
    .rps-online { width: 8px; height: 8px; border-radius: 50%; background: #4cdf6c; flex-shrink: 0; }

    .rps-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
      background: ${COLORS.bg};
    }
    .rps-msg {
      max-width: 84%; padding: 10px 14px; font-size: 13.5px;
      line-height: 1.55; white-space: pre-wrap;
    }
    .rps-msg.bot {
      background: #fff; color: #1a2e1b;
      border-radius: 4px 14px 14px 14px;
      border: 1px solid ${COLORS.border};
      align-self: flex-start;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .rps-msg.user {
      background: ${COLORS.primary}; color: #fff;
      border-radius: 14px 4px 14px 14px; align-self: flex-end;
    }
    .rps-msg.thinking { opacity: 0.5; font-style: italic; }
    .rps-msg a { color: ${COLORS.primary}; font-weight: 600; text-decoration: underline; }

    .rps-chips {
      display: flex; flex-wrap: wrap; gap: 7px; align-self: flex-start;
    }
    .rps-chip {
      font-size: 12.5px; padding: 6px 13px; border-radius: 20px;
      border: 1.5px solid ${COLORS.primary}; background: #fff;
      color: ${COLORS.primary}; cursor: pointer; font-weight: 500;
      transition: all 0.15s;
    }
    .rps-chip:hover { background: ${COLORS.primary}; color: #fff; }

    .rps-footer {
      padding: 10px 12px; border-top: 1px solid ${COLORS.border};
      background: #fff; display: flex; gap: 8px;
    }
    .rps-footer input {
      flex: 1; border: 1.5px solid ${COLORS.border}; border-radius: 10px;
      padding: 9px 13px; font-size: 13px; outline: none;
      font-family: inherit; color: #1a2e1b; background: ${COLORS.bg};
    }
    .rps-footer input:focus { border-color: ${COLORS.primary}; background: #fff; }
    .rps-footer button {
      background: ${COLORS.primary}; color: #fff; border: none;
      border-radius: 10px; padding: 0 16px; cursor: pointer;
      font-size: 13px; font-weight: 600; transition: background 0.15s;
    }
    .rps-footer button:hover { background: ${COLORS.dark}; }
    .rps-footer button:disabled { opacity: 0.4; cursor: default; }

    .rps-unread {
      position: absolute; top: 0; right: 0;
      width: 22px; height: 22px; border-radius: 50%;
      background: #e53e3e; color: #fff; font-size: 12px;
      font-weight: 700; display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, sans-serif; border: 2px solid #fff;
    }

    .rps-powered {
      text-align: center; font-size: 10px; color: #999;
      padding: 4px; background: #fff; border-top: 1px solid ${COLORS.border};
      flex-shrink: 0;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const btnWrap = document.createElement('div');
  btnWrap.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:99999;';

  btnWrap.innerHTML = `
    <button id="rps-chat-btn" aria-label="Chat with RPS">
      <svg class="rps-chat-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
      </svg>
      <span class="rps-btn-label">AI CHAT SUPPORT</span>
    </button>

    <div id="rps-chat-box" role="dialog" aria-label="RPS Assistant">
      <div class="rps-header">
        <div class="rps-header-avatar">RPS</div>
        <div>
          <p class="rps-header-title">RPS Assistant</p>
          <p class="rps-header-sub">Restaurant Property Sellers</p>
        </div>
        <div class="rps-online"></div>
        <button class="rps-close" id="rps-close" aria-label="Close">✕</button>
      </div>
      <div class="rps-messages" id="rps-messages"></div>
      <div class="rps-footer">
        <input type="text" id="rps-input" placeholder="Type your message..." />
        <button id="rps-send">Send</button>
      </div>
      <div class="rps-powered">Powered by AI · Restaurant Property Sellers</div>
    </div>
  `;

  document.body.appendChild(btnWrap);

  let history = [];
  let isOpen = false;
  let unread = 0;

  const box = document.getElementById('rps-chat-box');
  const msgs = document.getElementById('rps-messages');
  const inp = document.getElementById('rps-input');
  const sendBtn = document.getElementById('rps-send');
  const chatBtn = document.getElementById('rps-chat-btn');

  function toggleChat() {
    isOpen = !isOpen;
    box.classList.toggle('open', isOpen);
    const svg = chatBtn.querySelector('.rps-chat-svg');
    const label = chatBtn.querySelector('.rps-btn-label');
    if (isOpen) {
      clearUnread();
      inp.focus();
      svg.innerHTML = '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>';
      label.textContent = 'CLOSE';
    } else {
      svg.innerHTML = '<path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>';
      label.textContent = 'AI CHAT SUPPORT';
    }
  }

  function clearUnread() {
    unread = 0;
    const badge = chatBtn.querySelector('.rps-unread');
    if (badge) badge.remove();
  }

  function bumpUnread() {
    if (isOpen) return;
    unread++;
    let badge = chatBtn.querySelector('.rps-unread');
    if (!badge) { badge = document.createElement('div'); badge.className = 'rps-unread'; chatBtn.appendChild(badge); }
    badge.textContent = unread;
  }

  function addMsg(text, role) {
    const d = document.createElement('div');
    d.className = 'rps-msg ' + (role === 'user' ? 'user' : role === 'thinking' ? 'bot thinking' : 'bot');
    if (role === 'thinking') d.id = 'rps-thinking';
    if (role === 'bot') {
      const linked = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      d.innerHTML = linked;
    } else {
      d.textContent = text;
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function addChips(options) {
    const wrap = document.createElement('div');
    wrap.className = 'rps-chips';
    options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'rps-chip';
      b.textContent = opt;
      b.onclick = () => { wrap.remove(); handleSend(opt); };
      wrap.appendChild(b);
    });
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function cleanText(text) {
    return text.replace(/LEAD_DATA:\s*\{[\s\S]*?\}/, '').trim();
  }

  async function handleSend(text) {
    text = (text || inp.value).trim();
    if (!text) return;
    inp.value = '';
    sendBtn.disabled = true;
    addMsg(text, 'user');
    history.push({ role: 'user', content: text });
    addMsg('Typing...', 'thinking');

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === 'text')?.text || 'Sorry, something went wrong.';
      const clean = cleanText(raw);
      document.getElementById('rps-thinking')?.remove();
      history.push({ role: 'assistant', content: raw });
      addMsg(clean, 'bot');
      bumpUnread();
    } catch {
      document.getElementById('rps-thinking')?.remove();
      addMsg('Sorry, there was a connection issue. Please try again.', 'bot');
    }

    sendBtn.disabled = false;
    inp.focus();
  }

  chatBtn.addEventListener('click', toggleChat);
  document.getElementById('rps-close').addEventListener('click', toggleChat);
  sendBtn.addEventListener('click', () => handleSend());
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  setTimeout(() => {
    addMsg("👋 Welcome to Restaurant Property Sellers!\n\nHow can I help you today?", 'bot');
    addChips(['🛒 I am a Buyer', '💰 I am a Seller', '🏢 I am a Landlord', '🤝 I am a Franchisor']);
    bumpUnread();
  }, 800);

})();
