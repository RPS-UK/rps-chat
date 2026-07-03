(function () {
  const PROXY_URL = 'https://rps-chat.vercel.app/api/chat';
  const GEOCODE_URL = 'https://rps-chat.vercel.app/api/geocode';
  const SESSION_KEY = 'rayan_session';

  const TYPE_SLUGS = {
    'Restaurant': 'restaurants-for-sale',
    'Cafe': 'cafes-for-sale',
    'Takeaway': 'takeaways-for-sale',
    'Pub': 'pubs-for-sale',
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
    #rayan-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 99999;
      display: flex; align-items: center; gap: 10px;
      background: #2a525e; border: 1.5px solid #ffbd4a;
      border-radius: 40px; padding: 10px 18px 10px 10px;
      cursor: pointer; font-family: 'Poppins', sans-serif;
      transition: transform 0.2s; box-shadow: 0 4px 16px rgba(42,82,94,0.35);
    }
    #rayan-btn:hover { transform: scale(1.03); }
    #rayan-btn .r-av { width: 38px; height: 38px; border-radius: 50%; background: #ffbd4a; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    #rayan-btn .r-av span { font-size: 15px; font-weight: 600; color: #2a525e; font-family: 'Poppins', sans-serif; }
    #rayan-btn .r-name { font-size: 15px; font-weight: 600; color: #fff; font-family: 'Poppins', sans-serif; letter-spacing: 0.2px; line-height: 1; display: block; }
    #rayan-btn .r-sub { font-size: 10px; color: #a8c9d0; font-family: 'Poppins', sans-serif; font-weight: 300; letter-spacing: 0.3px; margin-top: 2px; display: block; }
    #rayan-btn .r-unread { position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; border-radius: 50%; background: #e24b4a; color: #fff; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; border: 2px solid #fff; }
    #rayan-box { position: fixed; bottom: 100px; right: 28px; z-index: 99999; width: 380px; height: 620px; border-radius: 16px; overflow: hidden; border: 0.5px solid #c8d8dc; display: flex; flex-direction: column; background: #fff; font-family: 'Poppins', sans-serif; transform: scale(0.95) translateY(10px); opacity: 0; transition: transform 0.25s, opacity 0.25s; pointer-events: none; box-shadow: 0 8px 32px rgba(42,82,94,0.18); }
    #rayan-box.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    .r-header { background: #2a525e; padding: 14px 16px; display: flex; align-items: center; gap: 11px; flex-shrink: 0; }
    .r-header-av { width: 42px; height: 42px; border-radius: 50%; background: #ffbd4a; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .r-header-av span { font-size: 16px; font-weight: 600; color: #2a525e; font-family: 'Poppins', sans-serif; }
    .r-header-name { font-size: 16px; font-weight: 600; color: #fff; margin: 0; font-family: 'Poppins', sans-serif; letter-spacing: 0.2px; }
    .r-header-sub { font-size: 11px; color: #a8c9d0; margin: 2px 0 0; font-family: 'Poppins', sans-serif; font-weight: 300; letter-spacing: 0.3px; }
    .r-online { width: 8px; height: 8px; border-radius: 50%; background: #4cdf6c; flex-shrink: 0; }
    .r-close { margin-left: auto; background: none; border: none; color: #a8c9d0; cursor: pointer; font-size: 20px; line-height: 1; padding: 0; }
    .r-close:hover { color: #fff; }
    .r-messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 9px; background: #f2f6f7; }
    .r-msg { max-width: 86%; padding: 10px 14px; font-size: 13.5px; line-height: 1.6; font-family: 'Poppins', sans-serif; white-space: pre-wrap; }
    .r-msg.bot { background: #fff; color: #1a2e33; border-radius: 3px 14px 14px 14px; border: 0.5px solid #dde8ea; align-self: flex-start; font-weight: 400; }
    .r-msg.bot a { color: #ffbd4a; font-weight: 500; text-decoration: none; display: block; margin-top: 6px; font-size: 13px; }
    .r-msg.bot a.similar { color: #5a7a82; font-size: 12px; font-weight: 400; margin-top: 3px; }
    .r-msg.user { background: #2a525e; color: #fff; border-radius: 14px 3px 14px 14px; align-self: flex-end; font-weight: 400; }
    .r-msg.thinking { opacity: 0.5; font-style: italic; }
    .r-msg.hint { background: #fff8ec; color: #2a525e; border: 0.5px solid #ffbd4a; border-radius: 3px 14px 14px 14px; align-self: flex-start; font-size: 12px; font-weight: 300; font-style: italic; max-width: 90%; }
    .r-chips { display: flex; flex-direction: column; gap: 6px; align-self: stretch; }
    .r-chip { font-size: 13px; font-weight: 400; padding: 9px 14px; border-radius: 6px; border: 1px solid #ffbd4a; background: #fff; color: #2a525e; cursor: pointer; text-align: left; font-family: 'Poppins', sans-serif; transition: background 0.12s; letter-spacing: 0.1px; }
    .r-chip:hover { background: #fff8ec; }
    .r-footer { padding: 11px 13px; border-top: 0.5px solid #dde8ea; background: #fff; display: flex; gap: 8px; align-items: center; }
    .r-footer input { flex: 1; border: 0.5px solid #c8d8dc; border-radius: 6px; padding: 9px 12px; font-size: 13px; color: #1a2e33; background: #f2f6f7; font-family: 'Poppins', sans-serif; font-weight: 400; outline: none; }
    .r-footer input:focus { border-color: #2a525e; background: #fff; }
    .r-footer button { background: #2a525e; color: #ffbd4a; border: none; border-radius: 6px; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
    .r-footer button:hover { background: #1e3d47; }
    .r-footer button:disabled { opacity: 0.4; cursor: default; }
    .r-powered { text-align: center; font-size: 10px; color: #bbb; padding: 6px; background: #fff; letter-spacing: 0.4px; font-family: 'Poppins', sans-serif; font-weight: 300; border-top: 0.5px solid #f0ece3; }
    @media (max-width: 768px) {
      #rayan-btn {
        right: 14px;
        bottom: 14px;
        padding: 8px 14px 8px 8px;
      }
      #rayan-btn .r-av { width: 34px; height: 34px; }
      #rayan-btn .r-av span { font-size: 13px; }
      #rayan-btn .r-name { font-size: 13px; }
      #rayan-btn .r-sub { display: none; }

      #rayan-box {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100% !important;
        max-height: none !important;
        border-radius: 0 !important;
        border: none !important;
        box-shadow: none !important;
        transform: translateY(100%) !important;
        transition: transform 0.3s ease !important;
        opacity: 1 !important;
        pointer-events: none;
        display: flex !important;
        flex-direction: column !important;
      }
      #rayan-box.open {
        transform: translateY(0) !important;
        pointer-events: all !important;
      }
      .r-header {
        padding: 14px 16px;
        flex-shrink: 0;
      }
      .r-header-av { width: 40px; height: 40px; }
      .r-header-av span { font-size: 16px; }
      .r-header-name { font-size: 16px; }
      .r-header-sub { font-size: 11px; }
      .r-messages {
        flex: 1 !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 14px !important;
        gap: 10px !important;
        min-height: 0 !important;
        overscroll-behavior: contain;
      }
      .r-msg {
        font-size: 15px !important;
        padding: 11px 14px !important;
        max-width: 92% !important;
      }
      .r-msg.hint { font-size: 13px !important; }
      .r-chips { gap: 8px !important; }
      .r-chip {
        font-size: 15px !important;
        padding: 13px 16px !important;
        border-radius: 8px !important;
      }
      .r-footer {
        padding: 12px 14px !important;
        flex-shrink: 0 !important;
        padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
      }
      .r-footer input {
        font-size: 16px !important;
        padding: 12px !important;
        border-radius: 8px !important;
      }
      .r-footer button {
        width: 44px !important;
        height: 44px !important;
        font-size: 20px !important;
        border-radius: 8px !important;
      }
      .r-powered {
        font-size: 11px !important;
        padding: 6px !important;
        flex-shrink: 0 !important;
      }
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
      <div><span class="r-name">Rayan</span><span class="r-sub">Your sales advisor</span></div>
    </button>
    <div id="rayan-box" role="dialog" aria-label="Rayan — RPS Assistant">
      <div class="r-header">
        <div class="r-header-av"><span>R</span></div>
        <div><p class="r-header-name">Rayan</p><p class="r-header-sub">Restaurant Property Sellers</p></div>
        <div class="r-online"></div>
        <button class="r-close" id="rayan-close" aria-label="Close">&#x2715;</button>
      </div>
      <div class="r-messages" id="rayan-msgs"></div>
      <div class="r-footer">
        <input type="text" id="rayan-input" placeholder="Type your requirement..." />
        <button id="rayan-send" aria-label="Send">&#10148;</button>
      </div>
      <div class="r-powered">Meet Rayan &middot; Restaurant Property Sellers</div>
    </div>
  `;
  document.body.appendChild(wrap);

  // ── Session persistence across pages ──────────────────────────────────────
  function loadSession() {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  }

  function saveSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        history,
        state,
        pendingType,
        pendingPrice,
        msgData
      }));
    } catch {}
  }

  function clearSession() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }

  // ── State ─────────────────────────────────────────────────────────────────
  let session = loadSession();
  let history = session ? session.history : [];
  let state = session ? session.state : 'greeting';
  let pendingType = session ? session.pendingType : '';
  let pendingPrice = session ? session.pendingPrice : 0;
  let msgData = session ? session.msgData : []; // stores rendered messages for replay
  let isOpen = false;
  let unread = 0;
  let leadCaptured = false;

  const box = document.getElementById('rayan-box');
  const msgs = document.getElementById('rayan-msgs');
  const inp = document.getElementById('rayan-input');
  const sendBtn = document.getElementById('rayan-send');
  const btn = document.getElementById('rayan-btn');

  // ── Toggle ────────────────────────────────────────────────────────────────
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

  function clearChips() { document.querySelectorAll('.r-chips').forEach(c => c.remove()); }

  // ── Render a message ──────────────────────────────────────────────────────
  function renderMsg(data) {
    clearChips();
    const d = document.createElement('div');
    d.className = 'r-msg ' + data.role;
    d.style.whiteSpace = 'pre-wrap';
    d.textContent = data.text;
    if (data.links && data.links.length) {
      data.links.forEach(l => {
        const a = document.createElement('a');
        a.href = l.url; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = l.label;
        if (l.secondary) a.className = 'similar';
        d.appendChild(a);
      });
    }
    msgs.appendChild(d);
    if (msgData.length > 1) msgs.scrollTop = msgs.scrollHeight;
  }

  function addMsg(text, role, links) {
    const data = { text, role, links: links || [] };
    msgData.push(data);
    renderMsg(data);
    saveSession();
  }

  function addHint(text) {
    const d = document.createElement('div');
    d.className = 'r-msg hint';
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addChips(options) {
    const w = document.createElement('div');
    w.className = 'r-chips';
    options.forEach(o => {
      const b = document.createElement('button');
      b.className = 'r-chip'; b.textContent = o;
      b.onclick = () => { w.remove(); handleInput(o); };
      w.appendChild(b);
    });
    msgs.appendChild(w);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // ── Restore session messages on page load ─────────────────────────────────
  function restoreSession() {
    if (msgData && msgData.length) {
      msgData.forEach(d => renderMsg(d));
      msgs.scrollTop = 0;
      bumpUnread();
      // Restore interactive elements based on current state
      if (state === 'greeting' || !state) {
        addHint('e.g. "Restaurant in Ealing under £100k" or "I want to sell my cafe"');
        addChips(['I am looking to buy', 'I am thinking of selling', 'I am a landlord', 'Franchisor', 'Franchisee']);
      } else if (state === 'buyer') {
        addHint('e.g. "Restaurant in Ealing, budget £100,000"');
      } else if (state === 'buyer_location') {
        addHint('e.g. "Ealing" or "West London"');
      } else if (state === 'capture') {
        addHint('Please share your name, email and phone number.');
      }
    } else {
      showGreeting();
    }
  }

  function showGreeting() {
    state = 'greeting';
    addMsg("Hi, I'm Rayan — your sales advisor at Restaurant Property Sellers. How can I help you today?", 'bot');
    addHint('e.g. "Restaurant in Ealing under £100k" or "I want to sell my cafe"');
    addChips(['I am looking to buy', 'I am thinking of selling', 'I am a landlord', 'Franchisor', 'Franchisee']);
    saveSession();
    bumpUnread();
  }

  // ── Geocoding ─────────────────────────────────────────────────────────────
  async function geocode(location) {
    try {
      const res = await fetch(GEOCODE_URL + '?q=' + encodeURIComponent(location));
      const data = await res.json();
      if (data && data.lat) return data;
      return null;
    } catch { return null; }
  }

  // ── URL builder ───────────────────────────────────────────────────────────
  function buildSearchUrl(type, location, lat, lng, maxPrice, radius) {
    const base = 'https://restaurantpropertysellers.com/search-results/';
    const p = new URLSearchParams();
    if (type && TYPE_SLUGS[type]) p.append('type[]', TYPE_SLUGS[type]);
    if (location) p.set('search_location', location + ', UK');
    if (lat) p.set('lat', lat);
    if (lng) p.set('lng', lng);
    p.set('use_radius', 'on');
    p.set('radius', radius || '3');
    if (maxPrice) p.set('max-price', maxPrice);
    return base + '?' + p.toString();
  }

  // ── Parse free text ───────────────────────────────────────────────────────
  function parseRequest(text) {
    const tl = text.toLowerCase();
    const types = { restaurant: 'Restaurant', cafe: 'Cafe', coffee: 'Cafe', takeaway: 'Takeaway', 'take away': 'Takeaway', pub: 'Pub', bar: 'Pub' };
    const budgetMap = {
      '25k': 25000, '25,000': 25000, '50k': 50000, '50,000': 50000,
      '75k': 75000, '80k': 80000, '80,000': 80000, '100k': 100000,
      '100,000': 100000, '150k': 150000, '150,000': 150000,
      '200k': 200000, '200,000': 200000, '250k': 250000,
      '300k': 300000, '300,000': 300000, '500k': 500000
    };
    const areas = [
      'ealing', 'harrow', 'hayes', 'hounslow', 'camden', 'croydon', 'wembley',
      'uxbridge', 'southall', 'greenford', 'acton', 'chiswick', 'hammersmith',
      'fulham', 'chelsea', 'westminster', 'islington', 'hackney', 'stratford',
      'ilford', 'romford', 'barking', 'tooting', 'wimbledon', 'kingston',
      'richmond', 'twickenham', 'staines', 'bloomsbury', 'kenton', 'raynes park',
      'swiss cottage', 'brixton', 'peckham', 'lewisham', 'greenwich', 'woolwich',
      'slough', 'watford', 'enfield', 'barnet', 'edgware', 'walthamstow',
      'leyton', 'bethnal green', 'shoreditch', 'dalston', 'clapham', 'balham',
      'streatham', 'sutton', 'morden', 'ruislip', 'northolt', 'perivale',
      'hanwell', 'brentford', 'feltham', 'heston', 'eastcote', 'holborn',
      'pinner', 'stanmore', 'wealdstone', 'alperton', 'sudbury', 'hendon',
      'clerkenwell', 'farringdon', 'barbican', 'aldgate', 'whitechapel',
      'stepney', 'poplar', 'canary wharf', 'isle of dogs', 'bermondsey',
      'southwark', 'vauxhall', 'stockwell', 'oval', 'kennington',
      'elephant and castle', 'borough', 'london bridge', 'bank', 'moorgate',
      'liverpool street', 'brick lane', 'spitalfields', 'mile end', 'bow',
      'forest gate', 'manor park', 'seven kings', 'goodmayes', 'chadwell heath',
      'kingsbury', 'queensbury', 'burnt oak', 'colindale', 'brent cross',
      'golders green', 'finchley', 'east finchley', 'highgate', 'archway',
      'tufnell park', 'kentish town', 'chalk farm', 'belsize park', 'hampstead',
      'cricklewood', 'willesden', 'harlesden', 'kensal green', 'ladbroke grove',
      'notting hill', 'bayswater', 'paddington', 'marylebone', 'mayfair',
      'soho', 'covent garden', 'strand', 'waterloo', 'lambeth', 'battersea',
      'wandsworth', 'putney', 'roehampton', 'mortlake', 'kew', 'barnes',
      'shepherd's bush', 'white city', 'wood lane', 'latimer road',
      'tottenham', 'wood green', 'palmers green', 'winchmore hill', 'southgate',
      'oakwood', 'cockfosters', 'new southgate', 'friern barnet', 'new barnet',
      'east barnet', 'hadley wood', 'potters bar', 'waltham cross',
      'cheshunt', 'broxbourne', 'hertford', 'upminster', 'hornchurch',
      'dagenham', 'rainham', 'purfleet', 'grays', 'tilbury'
    ];

    let type = '', location = '', maxPrice = 0;
    for (const [k, v] of Object.entries(types)) { if (tl.includes(k)) { type = v; break; } }
    for (const area of areas) {
      if (tl.includes(area)) {
        location = area.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        break;
      }
    }
    if (!location) {
      if (tl.includes('north west london')) location = 'North West London';
      else if (tl.includes('west london')) location = 'West London';
      else if (tl.includes('north london')) location = 'North London';
      else if (tl.includes('central london')) location = 'Central London';
      else if (tl.includes('east london')) location = 'East London';
      else if (tl.includes('south london')) location = 'South London';
    }
    for (const [k, v] of Object.entries(budgetMap)) { if (tl.includes(k)) { maxPrice = v; break; } }
    if (!maxPrice) {
      const m = tl.match(/£\s*(\d[\d,]*)/);
      if (m) maxPrice = parseInt(m[1].replace(/,/g, ''));
    }
    return { type, location, maxPrice };
  }

  // ── Buyer search ──────────────────────────────────────────────────────────
  async function processBuyerRequest(text) {
    const { type, location, maxPrice } = parseRequest(text);

    if (!location) {
      addMsg('Which area are you looking in? For example, Ealing, Harrow or West London.', 'bot');
      addHint('e.g. "Ealing" or "West London"');
      state = 'buyer_location';
      pendingType = type;
      pendingPrice = maxPrice;
      saveSession();
      return;
    }

    addMsg('Searching for listings near ' + location + '...', 'bot');

    const geo = await geocode(location);
    const lat = geo ? geo.lat : null;
    const lng = geo ? geo.lng : null;
    const formattedLocation = geo ? geo.formatted : location;

    // Remove the "Searching..." message
    const lastMsg = msgs.lastElementChild;
    if (lastMsg && lastMsg.textContent.includes('Searching')) {
      lastMsg.remove();
      msgData.pop();
    }

    const exactUrl = buildSearchUrl(type, formattedLocation, lat, lng, maxPrice, '3');
    const broaderUrl = buildSearchUrl(type, formattedLocation, lat, lng, maxPrice, '6');
    const similarUrl = buildSearchUrl('', formattedLocation, lat, lng, 0, '6');
    const typeLabel = type || 'Businesses';
    const priceLabel = maxPrice ? ' — under £' + maxPrice.toLocaleString() : '';

    addMsg('Here are listings matching your requirement.', 'bot', [
      { url: exactUrl, label: 'View ' + typeLabel + ' within 3 miles of ' + formattedLocation + priceLabel },
      { url: broaderUrl, label: 'Expand to 6 miles (more results)', secondary: true },
      { url: similarUrl, label: 'See all listings near ' + formattedLocation, secondary: true }
    ]);

    setTimeout(() => {
      addMsg('To receive alerts when new matching listings are added, may I take your name, email and phone number?', 'bot');
      state = 'capture';
      saveSession();
    }, 300);
  }

  // ── AI call ───────────────────────────────────────────────────────────────
  async function callAI(text) {
    history.push({ role: 'user', content: text });
    const thinking = document.createElement('div');
    thinking.className = 'r-msg bot thinking';
    thinking.id = 'rayan-thinking';
    thinking.textContent = '...';
    msgs.appendChild(thinking);
    msgs.scrollTop = msgs.scrollHeight;

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === 'text')?.text || 'Sorry, something went wrong.';
      const clean = raw.replace(/LEAD_DATA:\s*\{[\s\S]*?\}/, '').trim();

      document.getElementById('rayan-thinking')?.remove();
      history.push({ role: 'assistant', content: raw });

      clearChips();
      const linked = clean.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, (_, label, url) => {
        return `__LINK__${label}__URL__${url}__END__`;
      });

      const parts = linked.split(/__LINK__|__END__/);
      const msgEl = document.createElement('div');
      msgEl.className = 'r-msg bot';
      msgEl.style.whiteSpace = 'pre-wrap';

      const links = [];
      let plainText = '';
      parts.forEach(part => {
        if (part.includes('__URL__')) {
          const [label, url] = part.split('__URL__');
          links.push({ url, label });
        } else {
          plainText += part;
        }
      });

      msgEl.textContent = plainText.trim();
      links.forEach(l => {
        const a = document.createElement('a');
        a.href = l.url; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = l.label;
        msgEl.appendChild(a);
      });

      msgs.appendChild(msgEl);
      msgs.scrollTop = msgs.scrollHeight;
      msgData.push({ text: plainText.trim(), role: 'bot', links });

      if (raw.includes('LEAD_DATA:')) {
        leadCaptured = true;
        state = 'done';
      }

      saveSession();
      bumpUnread();
    } catch {
      document.getElementById('rayan-thinking')?.remove();
      addMsg('Sorry, there was a connection issue. Please try again.', 'bot');
    }
    sendBtn.disabled = false;
    inp.focus();
  }

  // ── Main input handler ────────────────────────────────────────────────────
  async function handleInput(text) {
    clearChips();
    addMsg(text, 'user');
    const tl = text.toLowerCase();

    if (state === 'done') {
      addMsg('Your enquiry has been noted. Our team will be in touch shortly.', 'bot');
      return;
    }

    if (state === 'capture') {
      sendBtn.disabled = true;
      callAI(text);
      return;
    }

    if (state === 'buyer_location') {
      const location = text.trim();
      // Also try to parse from the text in case they typed a full sentence
      const parsed = parseRequest(text);
      const finalLocation = parsed.location || location;
      addMsg('Searching for listings near ' + finalLocation + '...', 'bot');
      const geo = await geocode(finalLocation);
      const lat = geo ? geo.lat : null;
      const lng = geo ? geo.lng : null;
      const formattedLocation = geo ? geo.formatted : location;
      const lastMsg = msgs.lastElementChild;
      if (lastMsg && lastMsg.textContent.includes('Searching')) { lastMsg.remove(); msgData.pop(); }
      const exactUrl = buildSearchUrl(pendingType, formattedLocation, lat, lng, pendingPrice, '3');
      const broaderUrl = buildSearchUrl(pendingType, formattedLocation, lat, lng, pendingPrice, '6');
      const similarUrl = buildSearchUrl('', formattedLocation, lat, lng, 0, '6');
      addMsg('Here are listings near ' + formattedLocation + '.', 'bot', [
        { url: exactUrl, label: 'View listings within 3 miles of ' + formattedLocation },
        { url: broaderUrl, label: 'Expand to 6 miles (more results)', secondary: true },
        { url: similarUrl, label: 'See all listings near ' + formattedLocation, secondary: true }
      ]);
      setTimeout(() => {
        addMsg('May I take your name, email and phone number to send you alerts for new listings?', 'bot');
        state = 'capture'; saveSession();
      }, 300);
      return;
    }

    if (state === 'seller' || state === 'landlord' || state === 'franchisor' || state === 'franchisee') {
      sendBtn.disabled = true; callAI(text); return;
    }

    if (tl === 'i am looking to buy') {
      state = 'buyer';
      addMsg('Please describe what you are looking for and I will find matching listings for you.', 'bot');
      addHint('e.g. "Restaurant in Ealing, budget £100,000"');
      saveSession();
    } else if (tl === 'i am thinking of selling' || (tl.includes('sell') && !tl.includes('seller'))) {
      state = 'seller'; sendBtn.disabled = true; history.push({ role: 'user', content: text }); callAI(text);
    } else if (tl === 'i am a landlord' || tl.includes('landlord')) {
      state = 'landlord'; sendBtn.disabled = true; callAI(text);
    } else if (tl === 'franchisor' || (tl.includes('franchisor') && !tl.includes('franchisee'))) {
      state = 'franchisor'; sendBtn.disabled = true; callAI(text);
    } else if (tl === 'franchisee' || tl.includes('franchisee')) {
      state = 'franchisee'; sendBtn.disabled = true; callAI(text);
    } else if (
      tl.includes('buy') || tl.includes('looking') || tl.includes('restaurant') ||
      tl.includes('cafe') || tl.includes('takeaway') || tl.includes('pub') || tl.includes('bar')
    ) {
      state = 'buyer';
      processBuyerRequest(text);
    } else {
      sendBtn.disabled = true; callAI(text);
    }
  }

  function send() {
    const v = inp.value.trim();
    if (!v) return;
    inp.value = '';
    handleInput(v);
  }

  btn.addEventListener('click', toggleChat);
  document.getElementById('rayan-close').addEventListener('click', toggleChat);
  sendBtn.addEventListener('click', send);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  // ── Init ──────────────────────────────────────────────────────────────────
  setTimeout(() => { restoreSession(); setTimeout(() => { msgs.scrollTop = 0; }, 50); }, 800);

})();
