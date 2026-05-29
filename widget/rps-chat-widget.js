/**
 * Restaurant Property Sellers — AI Chat Widget
 * Paste the <script> tag from embed-snippet.html into your WordPress site header.
 * Update PROXY_URL below after deploying to Vercel.
 */

(function () {
const PROXY_URL = 'https://rps-chat.vercel.app/api/chat';
  const COLORS = { primary: '#185FA5', light: '#E6F1FB', border: '#d0dff0' };

  const SYSTEM = `You are an AI assistant for Restaurant Property Sellers (RPS), a London-based hospitality business broker. You help buyers find restaurants, cafes, takeaways and pubs for sale, and help sellers get free valuations.

Key facts:
- No Sale No Fee for sellers. Fee is 5% of agreed premium, min £6,000 + VAT
- Letting fee: 10% of annual rent + VAT
- Listed on Rightmove, Zoopla, Daltons, RightBiz, BusinessesForSale
- Current listings: 62 restaurants, 37 cafes, 21 takeaways, 9 freehold properties, 3 franchises
- Serve London and wider UK
- Free confidential valuations available
- Website: https://restaurantpropertysellers.com

When you detect intent (buying, selling, letting) and collect a name or email, end your message with a JSON block on its own line like:
LEAD_DATA: {"name":"...","email":"...","intent":"buy|sell|let|browse","type":"Restaurant|Cafe|Takeaway|Pub|Property","budget":"...","location":"...","score":"hot|warm|cold"}

Score hot if: has budget, specific type, ready to act. Warm if: interested but vague. Cold if: just browsing.
Only emit LEAD_DATA once you have at least a name OR email. Keep responses concise and friendly.`;

  // ── Styles ────────────────────────────────────────────────────────────────
  const css = `
    #rps-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 56px; height: 56px; border-radius: 50%;
      background: ${COLORS.primary}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(24,95,165,0.35);
      transition: transform 0.2s;
    }
    #rps-chat-btn:hover { transform: scale(1.08); }
    #rps-chat-btn svg { width: 26px; height: 26px; fill: #fff; }

    #rps-chat-box {
      position: fixed; bottom: 90px; right: 24px; z-index: 99999;
      width: 360px; height: 520px; border-radius: 14px; overflow: hidden;
      border: 1px solid ${COLORS.border};
      display: flex; flex-direction: column;
      background: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      transform: scale(0.95) translateY(10px); opacity: 0;
      transition: transform 0.2s, opacity 0.2s; pointer-events: none;
    }
    #rps-chat-box.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

    .rps-header {
      background: ${COLORS.primary}; color: #fff;
      padding: 12px 16px; display: flex; align-items: center; gap: 10px; flex-shrink: 0;
    }
    .rps-header-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center; font-size: 17px;
    }
    .rps-header-title { font-size: 14px; font-weight: 600; margin: 0; }
    .rps-header-sub { font-size: 11px; opacity: 0.8; margin: 0; }
    .rps-close {
      margin-left: auto; background: none; border: none;
      color: #fff; cursor: pointer; font-size: 20px; line-height: 1; opacity: 0.8;
    }
    .rps-close:hover { opacity: 1; }

    .rps-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .rps-msg {
      max-width: 82%; padding: 9px 13px; font-size: 13px;
      line-height: 1.5; white-space: pre-wrap; border-radius: 4px;
    }
    .rps-msg.bot {
      background: #f1f5f9; color: #1e293b;
      border-radius: 4px 12px 12px 12px; align-self: flex-start;
    }
    .rps-msg.user {
      background: ${COLORS.primary}; color: ${COLORS.light};
      border-radius: 12px 4px 12px 12px; align-self: flex-end;
    }
    .rps-msg.thinking { opacity: 0.5; font-style: italic; }

    .rps-chips {
      display: flex; flex-wrap: wrap; gap: 6px; align-self: flex-start;
    }
    .rps-chip {
      font-size: 12px; padding: 4px 10px; border-radius: 14px;
      border: 1px solid ${COLORS.border}; background: #fff;
      color: ${COLORS.primary}; cursor: pointer; transition: background 0.15s;
    }
    .rps-chip:hover { background: ${COLORS.light}; }

    .rps-footer {
      padding: 10px 12px; border-top: 1px solid ${COLORS.border};
      background: #f8fafc; display: flex; gap: 8px;
    }
    .rps-footer input {
      flex: 1; border: 1px solid ${COLORS.border}; border-radius: 8px;
      padding: 8px 12px; font-size: 13px; outline: none;
      font-family: inherit; color: #1e293b;
    }
    .rps-footer input:focus { border-color: ${COLORS.primary}; }
    .rps-footer button {
      background: ${COLORS.primary}; color: #fff; border: none;
      border-radius: 8px; padding: 0 14px; cursor: pointer;
      font-size: 13px; transition: background 0.15s;
    }
    .rps-footer button:hover { background: #0c447c; }
    .rps-footer button:disabled { opacity: 0.4; cursor: default; }

    .rps-unread {
      position: absolute; top: 2px; right: 2px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #e24b4a; color: #fff; font-size: 11px;
      font-weight: 700; display: flex; align-items: center; justify-content: center;
      font-family: -apple-system, sans-serif;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── HTML ──────────────────────────────────────────────────────────────────
  const btnWrap = document.createElement('div');
  btnWrap.style.position = 'fixed';
  btnWrap.style.bottom = '24px';
  btnWrap.style.right = '24px';
  btnWrap.style.zIndex = '99999';

  btnWrap.innerHTML = `
    <button id="rps-chat-btn" aria-label="Open chat">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
      </svg>
    </button>

    <div id="rps-chat-box" role="dialog" aria-label="RPS AI chat">
      <div class="rps-header">
        <div class="rps-header-avatar">🏪</div>
        <div>
          <p class="rps-header-title">RPS Assistant</p>
          <p class="rps-header-sub">Restaurant Property Sellers</p>
        </div>
        <button class="rps-close" id="rps-close" aria-label="Close chat">✕</button>
      </div>
      <div class="rps-messages" id="rps-messages"></div>
      <div class="rps-footer">
        <input type="text" id="rps-input" placeholder="Ask about buying, selling or renting…" />
        <button id="rps-send">Send</button>
      </div>
    </div>
  `;

  document.body.appendChild(btnWrap);

  // ── State & logic ─────────────────────────────────────────────────────────
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
    if (isOpen) {
      clearUnread();
      inp.focus();
      const icon = chatBtn.querySelector('svg');
      icon.innerHTML = '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>';
    } else {
      const icon = chatBtn.querySelector('svg');
      icon.innerHTML = '<path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>';
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
    d.textContent = text;
    if (role === 'thinking') d.id = 'rps-thinking';
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

  function parseLead(text) {
    const m = text.match(/LEAD_DATA:\s*(\{.*\})/);
    if (!m) return null;
    try { return JSON.parse(m[1]); } catch { return null; }
  }

  function cleanText(text) {
    return text.replace(/LEAD_DATA:\s*\{.*\}/, '').trim();
  }

  function sendLeadToWebhook(lead) {
    // Optional: send lead data to your CRM or webhook
    // Replace with your HubSpot / Zapier / Make webhook URL
    const WEBHOOK_URL = ''; // e.g. 'https://hooks.zapier.com/hooks/catch/xxx/yyy/'
    if (!WEBHOOK_URL) return;
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, source: 'rps-chat-widget', timestamp: new Date().toISOString() }),
    }).catch(() => {}); // fail silently
  }

  async function handleSend(text) {
    text = (text || inp.value).trim();
    if (!text) return;
    inp.value = '';
    sendBtn.disabled = true;
    addMsg(text, 'user');
    history.push({ role: 'user', content: text });
    addMsg('Thinking…', 'thinking');

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === 'text')?.text || 'Sorry, something went wrong.';
      const lead = parseLead(raw);
      const clean = cleanText(raw);

      document.getElementById('rps-thinking')?.remove();
      history.push({ role: 'assistant', content: raw });
      addMsg(clean, 'bot');
      bumpUnread();

      if (lead) sendLeadToWebhook(lead);
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

  // ── Greeting ──────────────────────────────────────────────────────────────
  setTimeout(() => {
    addMsg("Hi! I'm the RPS Assistant. I can help you find a hospitality business to buy, arrange a free valuation if you're selling, or answer any questions about our listings.", 'bot');
    addChips(['I want to buy', 'I want to sell', 'How does it work?', 'View listings']);
    bumpUnread();
  }, 800);
})();
