(function () {
  const PROXY_URL = 'https://rps-chat.vercel.app/api/chat';

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
    #rayan-btn .r-av {
      width: 38px; height: 38px; border-radius: 50%;
      background: #ffbd4a; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
    }
    #rayan-btn .r-av span { font-size: 15px; font-weight: 600; color: #2a525e; font-family: 'Poppins', sans-serif; }
    #rayan-btn .r-name { font-size: 15px; font-weight: 600; color: #fff; font-family: 'Poppins', sans-serif; letter-spacing: 0.2px; line-height: 1; display: block; }
    #rayan-btn .r-sub { font-size: 10px; color: #a8c9d0; font-family: 'Poppins', sans-serif; font-weight: 300; letter-spacing: 0.3px; margin-top: 2px; display: block; }
    #rayan-btn .r-unread { position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; border-radius: 50%; background: #e24b4a; color: #fff; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; border: 2px solid #fff; }

    #rayan-box {
      position: fixed; bottom: 100px; right: 28px; z-index: 99999;
      width: 360px; height: 560px; border-radius: 16px;
      overflow: hidden; border: 0.5px solid #c8d8dc;
      display: flex; flex-direction: column; background: #fff;
      font-family: 'Poppins', sans-serif;
      transform: scale(0.95) translateY(10px); opacity: 0;
      transition: transform 0.25s, opacity 0.25s; pointer-events: none;
      box-shadow: 0 8px 32px rgba(42,82,94,0.18);
    }
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
    .r-chip.secondary { border-color: #c8d8dc; color: #5a7a82; font-size: 12px; }
    .r-chip.secondary:hover { background: #f2f6f7; }

    .r-footer { padding: 11px 13px; border-top: 0.5px solid #dde8ea; background: #fff; display: flex; gap: 8px; align-items: center; }
    .r-footer input { flex: 1; border: 0.5px solid #c8d8dc; border-radius: 6px; padding: 9px 12px; font-size: 13px; color: #1a2e33; background: #f2f6f7; font-family: 'Poppins', sans-serif; font-weight: 400; outline: none; }
    .r-footer input:focus { border-color: #2a525e; background: #fff; }
    .r-footer button { background: #2a525e; color: #ffbd4a; border: none; border-radius: 6px; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
    .r-footer button:hover { background: #1e3d47; }
    .r-footer button:disabled { opacity: 0.4; cursor: default; }
    .r-powered { text-align: center; font-size: 10px; color: #bbb; padding: 6px; background: #fff; letter-spacing: 0.4px; font-family: 'Poppins', sans-serif; font-weight: 300; border-top: 0.5px solid #f0ece3; }

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
        <input type="text" id="rayan-input" placeholder="Type your requirement..." />
        <button id="rayan-send" aria-label="Send">&#10148;</button>
      </div>
      <div class="r-powered">Meet Rayan &middot; Restaurant Property Sellers</div>
    </div>
  `;
  document.body.appendChild(wrap);

  let history = [];
  let isOpen = false;
  let unread = 0;
  let state = 'greeting';
  let pendingType = '';
  let pendingPrice = 0;

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

  function clearChips() { document.querySelectorAll('.r-chips').forEach(c => c.remove()); }

  function addMsg(text, role, links) {
    clearChips();
    const d = document.createElement('div');
    d.className = 'r-msg ' + role;
    d.style.whiteSpace = 'pre-wrap';
    d.textContent = text;
    if (links && links.length) {
      links.forEach(l => {
        const a = document.createElement('a');
        a.href = l.url; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = l.label;
        if (l.secondary) a.className = 'similar';
        d.appendChild(a);
      });
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addHint(text) {
    const d = document.createElement('div');
    d.className = 'r-msg hint';
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addChips(options, secondary) {
    const w = document.createElement('div');
    w.className = 'r-chips';
    options.forEach(o => {
      const b = document.createElement('button');
      b.className = 'r-chip' + (secondary ? ' secondary' : '');
      b.textContent = o;
      b.onclick = () => { w.remove(); handleInput(o); };
      w.appendChild(b);
    });
    msgs.appendChild(w);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // Geocode location using Google Maps (already loaded on RPS site)
  async function geocode(location) {
    return new Promise((resolve) => {
      if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location + ', UK' }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const loc = results[0].geometry.location;
            const formatted = results[0].formatted_address;
            resolve({ lat: loc.lat(), lng: loc.lng(), formatted });
          } else {
            resolve(null);
          }
        });
      } else {
        resolve(null);
      }
    });
  }

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
      'streatham', 'norwood', 'sutton', 'morden', 'ruislip', 'northolt',
      'perivale', 'hanwell', 'brentford', 'feltham', 'ashford', 'heston'
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
      if (tl.includes('west london')) location = 'West London';
      else if (tl.includes('north west london')) location = 'North West London';
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

  async function processBuyerRequest(text) {
    const { type, location, maxPrice } = parseRequest(text);

    if (!location) {
      addMsg('Which area are you looking in? For example, Ealing, Harrow or West London.', 'bot');
      addHint('e.g. "Ealing" or "West London"');
      state = 'buyer_location';
      pendingType = type;
      pendingPrice = maxPrice;
      return;
    }

    addMsg('Searching for listings within 3 miles of ' + location + '...', 'bot');

    const geo = await geocode(location);
    const lat = geo ? geo.lat : null;
    const lng = geo ? geo.lng : null;
    const formattedLocation = geo ? geo.formatted.split(',')[0] : location;

    clearChips();
    const lastMsg = msgs.lastElementChild;
    if (lastMsg && lastMsg.textContent.includes('Searching')) lastMsg.remove();

    const exactUrl = buildSearchUrl(type, formattedLocation, lat, lng, maxPrice, '3');
    const broaderUrl = buildSearchUrl(type, formattedLocation, lat, lng, maxPrice, '6');
    const similarUrl = buildSearchUrl('', formattedLocation, lat, lng, 0, '5');

    const label = [type || 'Businesses', 'within 3 miles of', formattedLocation, maxPrice ? '— under £' + maxPrice.toLocaleString() : ''].filter(Boolean).join(' ');

    addMsg('Here are listings matching your requirement.', 'bot', [
      { url: exactUrl, label: 'View ' + label.replace('within 1 mile', 'within 3 miles') },
      { url: broaderUrl, label: 'Expand to 6 miles (more results)', secondary: true },
      { url: similarUrl, label: 'See all listings near ' + formattedLocation, secondary: true }
    ]);

    setTimeout(() => {
      addMsg('To receive alerts when new matching listings are added, may I take your name, email and phone number?', 'bot');
      state = 'capture';
    }, 300);
  }

  async function callAI(text) {
    history.push({ role: 'user', content: text });
    const d = document.createElement('div');
    d.className = 'r-msg bot thinking'; d.id = 'rayan-thinking'; d.textContent = '...';
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;

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
      const el = document.createElement('div');
      el.className = 'r-msg bot'; el.style.whiteSpace = 'pre-wrap';
      const linked = clean.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      el.innerHTML = linked;
      msgs.appendChild(el); msgs.scrollTop = msgs.scrollHeight;
      bumpUnread();
    } catch {
      document.getElementById('rayan-thinking')?.remove();
      addMsg('Sorry, there was a connection issue. Please try again.', 'bot');
    }
    sendBtn.disabled = false;
    inp.focus();
  }

  async function handleInput(text) {
    clearChips();
    addMsg(text, 'user');
    const tl = text.toLowerCase();

    if (state === 'buyer_location') {
      const location = text.trim();
      const geo = await geocode(location);
      const lat = geo ? geo.lat : null;
      const lng = geo ? geo.lng : null;
      const formattedLocation = geo ? geo.formatted.split(',')[0] : location;
      const exactUrl = buildSearchUrl(pendingType, formattedLocation, lat, lng, pendingPrice, '3');
      const broaderUrl = buildSearchUrl(pendingType, formattedLocation, lat, lng, pendingPrice, '6');
      const similarUrl = buildSearchUrl('', formattedLocation, lat, lng, 0, '5');
      setTimeout(() => {
        addMsg('Here are listings near ' + formattedLocation + '.', 'bot', [
          { url: exactUrl, label: 'View listings within 3 miles of ' + formattedLocation },
          { url: broaderUrl, label: 'Expand to 6 miles (more results)', secondary: true },
          { url: similarUrl, label: 'See all listings near ' + formattedLocation, secondary: true }
        ]);
        addMsg('May I take your name, email and phone number to send you alerts for new listings?', 'bot');
        state = 'capture';
      }, 400);
      return;
    }

    if (state === 'capture' || state === 'seller' || state === 'landlord' || state === 'franchisor' || state === 'franchisee') {
      sendBtn.disabled = true;
      callAI(text);
      return;
    }

    if (tl === 'i am looking to buy') {
      state = 'buyer';
      setTimeout(() => {
        addMsg('Please describe what you are looking for and I will find matching listings for you.', 'bot');
        addHint('e.g. "Restaurant in Ealing, budget £100,000"');
      }, 350);
    } else if (tl === 'i am thinking of selling' || tl.includes('sell')) {
      state = 'seller'; sendBtn.disabled = true; callAI(text);
    } else if (tl === 'i am a landlord' || tl.includes('landlord')) {
      state = 'landlord'; sendBtn.disabled = true; callAI(text);
    } else if (tl === 'franchisor' || tl.includes('franchisor')) {
      state = 'franchisor'; sendBtn.disabled = true; callAI(text);
    } else if (tl === 'franchisee' || tl.includes('franchisee')) {
      state = 'franchisee'; sendBtn.disabled = true; callAI(text);
    } else if (tl.includes('buy') || tl.includes('looking') || tl.includes('restaurant') || tl.includes('cafe') || tl.includes('takeaway') || tl.includes('pub') || tl.includes('bar')) {
      state = 'buyer';
      processBuyerRequest(text);
    } else {
      sendBtn.disabled = true;
      callAI(text);
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

  setTimeout(() => {
    addMsg("Welcome to Restaurant Property Sellers. I'm Rayan, your property advisor.\n\nHow can I help you today? Simply type your requirement or choose an option below.", 'bot');
    addHint('e.g. "Restaurant in Ealing under £100k" or "I want to sell my cafe"');
    addChips(['I am looking to buy', 'I am thinking of selling', 'I am a landlord', 'Franchisor', 'Franchisee']);
    bumpUnread();
  }, 800);

})();
