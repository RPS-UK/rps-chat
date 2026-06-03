(function () {
  const PROXY_URL = 'https://rps-chat.vercel.app/api/chat';

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

    #rayan-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 99999;
      display: flex; align-items: center; gap: 10px;
      background: #2a525e; border: 1.5px solid #ffbd4a;
      border-radius: 40px; padding: 10px 18px 10px 10px;
      cursor: pointer; font-family: 'Poppins', sans-serif;
      transition: transform 0.2s;
    }
    #rayan-btn:hover { transform: scale(1.03); }
    #rayan-btn .r-av {
      width: 38px; height: 38px; border-radius: 50%;
      background: #ffbd4a; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
    }
    #rayan-btn .r-av span {
      font-size: 15px; font-weight: 600; color: #2a525e;
      font-family: 'Poppins', sans-serif;
    }
    #rayan-btn .r-name {
      font-size: 15px; font-weight: 600; color: #fff;
      font-family: 'Poppins', sans-serif; letter-spacing: 0.2px;
      line-height: 1; display: block;
    }
    #rayan-btn .r-sub {
      font-size: 10px; color: #a8c9d0;
      font-family: 'Poppins', sans-serif; font-weight: 300;
      letter-spacing: 0.3px; margin-top: 2px; display: block;
    }
    #rayan-btn .r-unread {
      position: absolute; top: -4px; right: -4px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #e24b4a; color: #fff; font-size: 11px;
      font-weight: 600; display: flex; align-items: center;
      justify-content: center; font-family: 'Poppins', sans-serif;
      border: 2px solid #fff;
    }

    #rayan-box {
      position: fixed; bottom: 100px; right: 28px; z-index: 99999;
      width: 360px; height: 540px; border-radius: 16px;
      overflow: hidden; border: 0.5px solid #c8d8dc;
      display: flex; flex-direction: column; background: #fff;
      font-family: 'Poppins', sans-serif;
      transform: scale(0.95) translateY(10px); opacity: 0;
      transition: transform 0.25s, opacity 0.25s; pointer-events: none;
    }
    #rayan-box.open {
      transform: scale(1) translateY(0); opacity: 1; pointer-events: all;
    }

    .r-header {
      background: #2a525e; padding: 14px 16px;
      display: flex; align-items: center; gap: 11px; flex-shrink: 0;
    }
    .r-header-av {
      width: 42px; height: 42px; border-radius: 50%;
      background: #ffbd4a; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
    }
    .r-header-av span {
      font-size: 16px; font-weight: 600; color: #2a525e;
      font-family: 'Poppins', sans-serif;
    }
    .r-header-name {
      font-size: 16px; font-weight: 600; color: #fff;
      margin: 0; font-family: 'Poppins', sans-serif; letter-spacing: 0.2px;
    }
    .r-header-sub {
      font-size: 11px; color: #a8c9d0; margin: 2px 0 0;
      font-family: 'Poppins', sans-serif; font-weight: 300; letter-spacing: 0.3px;
    }
    .r-online {
      width: 8px; height: 8px; border-radius: 50%;
      background: #4cdf6c; flex-shrink: 0;
    }
    .r-close {
      margin-left: auto; background: none; border: none;
      color: #a8c9d0; cursor: pointer; font-size: 20px;
      line-height: 1; padding: 0;
    }
    .r-close:hover { color: #fff; }

    .r-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 9px;
      background: #f2f6f7;
    }
    .r-msg {
      max-width: 85%; padding: 10px 14px;
      font-size: 13.5px; line-height: 1.6;
      font-family: 'Poppins', sans-serif; white-space: pre-wrap;
    }
    .r-msg.bot {
      background: #fff; color: #1a2e33;
      border-radius: 3px 14px 14px 14px;
      border: 0.5px solid #dde8ea; align-self: flex-start;
      font-weight: 400;
    }
    .r-msg.bot a {
      color: #ffbd4a; font-weight: 500; text-decoration: none;
      display: inline-block; margin-top: 6px; font-size: 13px;
    }
    .r-msg.user {
      background: #2a525e; color: #fff;
      border-radius: 14px 3px 14px 14px; align-self: flex-end;
      font-weight: 400;
    }
    .r-msg.thinking { opacity: 0.5; font-style: italic; }

    .r-chips {
      display: flex; flex-direction: column;
      gap: 6px; align-self: stretch;
    }
    .r-chip {
      font-size: 13px; font-weight: 400; padding: 9px 14px;
      border-radius: 6px; border: 1px solid #ffbd4a;
      background: #fff; color: #2a525e; cursor: pointer;
      text-align: left; font-family: 'Poppins', sans-serif;
      transition: background 0.15s; letter-spacing: 0.1px;
    }
    .r-chip:hover { background: #fff8ec; }

    .r-footer {
      padding: 11px 13px; border-top: 0.5px solid #dde8ea;
      background: #fff; display: flex; gap: 8px; align-items: center;
    }
    .r-footer input {
      flex: 1; border: 0.5px solid #c8d8dc; border-radius: 6px;
      padding: 9px 12px; font-size: 13px; color: #1a2e33;
      background: #f2f6f7; font-family: 'Poppins', sans-serif;
      font-weight: 400; outline: none;
    }
    .r-footer input:focus { border-color: #2a525e; background: #fff; }
    .r-footer button {
      background: #2a525e; color: #ffbd4a; border: none;
      border-radius: 6px; width: 36px; height: 36px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-size: 16px;
    }
    .r-footer button:hover { background: #1e3d47; }
    .r-footer button:disabled { opacity: 0.4; cursor: default; }
    .r-powered {
      text-align: center; font-size: 10px; color: #aaa;
      padding: 6px; background: #fff; letter-spacing: 0.4px;
      font-family: 'Poppins', sans-serif; font-weight: 300;
      border-top: 0.5px solid #f0ece3;
    }

    @media (max-width: 420px) {
      #rayan-box { width: calc(100vw - 20px); right: 10px; bottom: 90px; }
      #rayan-btn { right: 10px; bottom: 16px; }
      #rayan-btn .r-sub { display: none; }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;bottom:0;right:0;z-index:99999;';
  wrap.innerHTML = `
    <button id="rayan-btn" aria-label="Chat with Rayan">
      <div class="r-av"><span>R</span></div>
      <div>
        <span class="r-name">Rayan</span>
        <span class="r-sub">Your property advisor</span>
      </div>
    </button>

    <div id="rayan-box" role="dialog" aria-label="Rayan — RPS Assistant">
      <div class="r-header">
        <div class="r-header-av"><span>R</span></div>
        <div>
          <p class="r-header-name">Rayan</p>
          <p class="r-header-sub">Restaurant Property Sellers</p>
        </div>
        <div class="r-online"></div>
        <button class="r-close" id="rayan-close" aria-label="Close">&#x2715;</button>
      </div>
      <div class="r-messages" id="rayan-msgs"></div>
      <div class="r-footer">
        <input type="text" id="rayan-input" placeholder="Type a message..." />
        <button id="rayan-send" aria-label="Send">&#10148;</button>
      </div>
      <div class="r-powered">Meet Rayan &middot; Restaurant Property Sellers</div>
    </div>
  `;
  document.body.appendChild(wrap);

  let history = [];
  let isOpen = false;
  let unread = 0;

  const box = document.getElementById('rayan-box');
  const msgs = document.getElementById('rayan-msgs');
  const inp = document.getElementById('rayan-input');
  const sendBtn = document.getElementById('rayan-send');
  const btn = document.getElementById('rayan-btn');

  function toggleChat() {
    isOpen = !isOpen;
    box.classList.toggle('open', isOpen);
    if (isOpen) { clearUnread(); inp.focus(); }
  }

  function clearUnread() {
    unread = 0;
    const b = btn.querySelector('.r-unread');
    if (b) b.remove();
  }

  function bumpUnread() {
    if (isOpen) return;
    unread++;
    let b = btn.querySelector('.r-unread');
    if (!b) { b = document.createElement('div'); b.className = 'r-unread'; btn.appendChild(b); }
    b.textContent = unread;
  }

  function addMsg(text, role) {
    const d = document.createElement('div');
    d.className = 'r-msg ' + (role === 'user' ? 'user' : role === 'thinking' ? 'bot thinking' : 'bot');
    if (role === 'thinking') d.id = 'rayan-thinking';
    if (role === 'bot') {
      const linked = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>');
      d.innerHTML = linked;
    } else {
      d.textContent = text;
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addChips(options) {
    const w = document.createElement('div');
    w.className = 'r-chips';
    options.forEach(o => {
      const b = document.createElement('button');
      b.className = 'r-chip'; b.textContent = o;
      b.onclick = () => { w.remove(); handleSend(o); };
      w.appendChild(b);
    });
    msgs.appendChild(w);
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
    addMsg('...', 'thinking');

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === 'text')?.text || 'Sorry, something went wrong.';
      const clean = cleanText(raw);
      document.getElementById('rayan-thinking')?.remove();
      history.push({ role: 'assistant', content: raw });
      addMsg(clean, 'bot');
      bumpUnread();
    } catch {
      document.getElementById('rayan-thinking')?.remove();
      addMsg('Sorry, there was a connection issue. Please try again.', 'bot');
    }

    sendBtn.disabled = false;
    inp.focus();
  }

  btn.addEventListener('click', toggleChat);
  document.getElementById('rayan-close').addEventListener('click', toggleChat);
  sendBtn.addEventListener('click', () => handleSend());
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  setTimeout(() => {
    addMsg('Welcome to Restaurant Property Sellers. I\'m Rayan, your property advisor. How may I assist you today?', 'bot');
    addChips(['I am looking to buy', 'I am thinking of selling', 'I am a landlord', 'I represent a franchise']);
    bumpUnread();
  }, 800);

})();
