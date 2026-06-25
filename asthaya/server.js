const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 7842;
const JWT_SECRET = 'asthaya_heal_secret_2025';
const DB_PATH = path.join(__dirname, 'db.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── DB helpers ──────────────────────────────────────────────
function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
function hashPwd(p) {
  return crypto.createHash('sha256').update(p + 'asthaya_salt').digest('hex');
}
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── Auth middleware ──────────────────────────────────────────
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(h.replace('Bearer ', ''), JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

// ── Seed products ────────────────────────────────────────────
function seedProducts() {
  const db = readDB();
  if (db.products && db.products.length > 0) return;
  db.products = [
    // Bath & Body — Soaps
    { id: 'p1', name: 'Chi Crystal Soap', category: 'Handmade Soaps', subcategory: 'Crystal Soaps', price: 450, originalPrice: 450, description: 'Infused with programmed crystals to cleanse your energy field while purifying skin. Each soap is handcrafted with organic glycerine and charged under moonlight.', ingredients: 'Organic Glycerine, Rose Quartz Crystal, Lavender Essential Oil, Kaolin Clay', weight: '100g', emoji: '🔮', tag: 'Bestseller', stock: 50, rating: 4.8, reviews: 124 },
    { id: 'p2', name: 'Goat Milk Nourish Soap', category: 'Handmade Soaps', subcategory: 'Goat Milk Soaps', price: 380, originalPrice: 380, description: 'Pure goat milk soap deeply nourishes and softens skin. Rich in vitamins A, D, and E with natural lactic acid for gentle exfoliation.', ingredients: 'Fresh Goat Milk, Coconut Oil, Shea Butter, Oat Extract, Honey', weight: '100g', emoji: '🐐', tag: 'New', stock: 40, rating: 4.7, reviews: 89 },
    { id: 'p3', name: 'Coffee Massage Soap', category: 'Handmade Soaps', subcategory: 'Glycerine Soaps', price: 350, originalPrice: 350, description: 'A wake-up ritual in bar form. Ground coffee exfoliates deeply while coconut oil moisturises. Perfect for cellulite reduction and energising mornings.', ingredients: 'Coffee Grounds, Coconut Oil, Glycerine, Vitamin E, Cedarwood Oil', weight: '100g', emoji: '☕', tag: 'Bestseller', stock: 60, rating: 4.9, reviews: 210 },
    { id: 'p4', name: 'Wishful Massage Soap', category: 'Handmade Soaps', subcategory: 'Limited Edition', price: 350, originalPrice: 420, description: 'A dreamy blend of jasmine and ylang-ylang. This limited-edition soap is infused with golden flecks and set an intention of abundance with every use.', ingredients: 'Jasmine Extract, Ylang-Ylang Oil, 24K Gold Dust, Shea Butter, Vitamin C', weight: '100g', emoji: '✨', tag: 'Limited', stock: 20, rating: 4.8, reviews: 67 },
    { id: 'p5', name: 'Shuddhi Purifying Soap', category: 'Handmade Soaps', subcategory: 'Glycerine Soaps', price: 320, originalPrice: 320, description: 'Shuddhi means "purification". This neem and tulsi soap draws out impurities while balancing skin pH. Your daily Ayurvedic cleansing ritual.', ingredients: 'Neem Extract, Tulsi Oil, Turmeric, Activated Charcoal, Tea Tree Oil', weight: '100g', emoji: '🌿', tag: null, stock: 55, rating: 4.6, reviews: 145 },

    // Bath & Body — Scrubs
    { id: 'p6', name: 'Shuddhi Sea Salt Scrub', category: 'Bath & Body', subcategory: 'Sea Salt Paste Scrubs', price: 650, originalPrice: 750, description: 'A luxurious sea salt paste infused with healing crystals and Himalayan pink salt. Removes dead skin, opens energy channels, and leaves skin luminous.', ingredients: 'Dead Sea Salt, Himalayan Pink Salt, Sunflower Oil, Rose Absolute, Programmed Quartz', weight: '200g', emoji: '🌊', tag: '13% Off', stock: 35, rating: 4.7, reviews: 98 },
    { id: 'p7', name: 'Coffee on the Go Scrub', category: 'Bath & Body', subcategory: 'Sea Salt Paste Scrubs', price: 750, originalPrice: 750, description: 'Your energising morning ritual. Double-action coffee + sugar scrub activates circulation, reduces puffiness, and delivers antioxidants deep into skin.', ingredients: 'Colombian Coffee, Brown Sugar, Coconut Oil, Vanilla Bean, Cinnamon Extract', weight: '200g', emoji: '☕', tag: 'Bestseller', stock: 45, rating: 4.9, reviews: 187 },
    { id: 'p8', name: 'Ananda Foot Soak Salt', category: 'Bath & Body', subcategory: 'Bath Salts to Apply', price: 550, originalPrice: 550, description: 'Ananda means "bliss". Soak tired feet in this mineral-rich blend to relieve pain, reduce inflammation, and restore energy flow through marma points.', ingredients: 'Himalayan Salt, Epsom Salt, Peppermint Oil, Tea Tree, Eucalyptus, Dried Marigold', weight: '250g', emoji: '🦶', tag: 'New', stock: 30, rating: 4.8, reviews: 73 },

    // Body Wash
    { id: 'p9', name: 'Lavender Body Wash', category: 'Bath & Body', subcategory: 'Body Wash', price: 550, originalPrice: 550, description: 'A calming lavender body wash to melt stress away. Gentle enough for daily use, infused with real lavender from Himalayan farms.', ingredients: 'Lavender Extract, Aloe Vera, Coconut Surfactant, Vitamin E, Chamomile', weight: '300ml', emoji: '💜', tag: 'New', stock: 50, rating: 4.7, reviews: 56 },
    { id: 'p10', name: 'Auraso Body Wash', category: 'Bath & Body', subcategory: 'Body Wash', price: 550, originalPrice: 550, description: 'Auraso means "golden essence". This uplifting citrus-floral wash energises your aura and fills your bathroom with the scent of possibility.', ingredients: 'Sweet Orange, Ylang-Ylang, Coconut Base, Shea Butter Extract, Gold Mica', weight: '300ml', emoji: '🌟', tag: 'New', stock: 45, rating: 4.6, reviews: 42 },
    { id: 'p11', name: 'Bed of Roses Body Wash', category: 'Bath & Body', subcategory: 'Body Wash', price: 550, originalPrice: 550, description: 'A romantic rose-forward body wash with Bulgarian rose absolute. Deeply moisturising and heart-chakra opening. Your evening unwinding ritual.', ingredients: 'Bulgarian Rose Absolute, Rosehip Oil, Glycerine, Geranium, Aloe Vera', weight: '300ml', emoji: '🌹', tag: null, stock: 40, rating: 4.8, reviews: 91 },
    { id: 'p12', name: 'Lemon Zest Body Wash', category: 'Bath & Body', subcategory: 'Body Wash', price: 550, originalPrice: 550, description: 'Zingy, bright, and utterly uplifting. Sicilian lemon + ginger to supercharge your morning. Natural vitamin C brightens skin over time.', ingredients: 'Sicilian Lemon, Ginger Extract, Green Tea, Citric Acid, Vitamin C', weight: '300ml', emoji: '🍋', tag: null, stock: 38, rating: 4.5, reviews: 61 },

    // Body Oils
    { id: 'p13', name: 'Body & Massage Oil', category: 'Bath & Body', subcategory: 'Bath and Body Oil', price: 750, originalPrice: 750, description: 'A deeply nourishing full-body oil that doubles as a massage blend. Sesame base balances all three doshas in Ayurvedic tradition.', ingredients: 'Cold-Pressed Sesame, Sweet Almond, Vitamin E, Lavender, Frankincense', weight: '100ml', emoji: '🫙', tag: 'Bestseller', stock: 55, rating: 4.8, reviews: 132 },
    { id: 'p14', name: 'Jyotulsi Massage Oil', category: 'Bath & Body', subcategory: 'Bath and Body Oil', price: 750, originalPrice: 750, description: 'Jyotulsi (sacred basil + light). This rare formulation combines holy basil with Ayurvedic herbs known to activate prana and restore vitality.', ingredients: 'Holy Basil (Tulsi), Sesame, Brahmi, Ashwagandha Extract, Sandalwood', weight: '100ml', emoji: '🌱', tag: 'New', stock: 25, rating: 4.9, reviews: 48 },
    { id: 'p15', name: 'Coffee Me Body Butter', category: 'Bath & Body', subcategory: 'Bath and Body Oil', price: 750, originalPrice: 800, description: 'Whipped to cloud-like perfection. This coffee-infused body butter melts into skin leaving zero grease — just silky, caffeinated brilliance.', ingredients: 'Shea Butter, Coffee Butter, Cocoa Butter, Coffee Oil, Vanilla Absolute', weight: '150g', emoji: '🍫', tag: 'Bestseller', stock: 60, rating: 5.0, reviews: 201 },

    // Face Care
    { id: 'p16', name: 'Rose Face Mist', category: 'Bath & Body', subcategory: 'Face Mist', price: 550, originalPrice: 550, description: 'A pure Bulgarian rose water mist that hydrates, sets makeup, and opens the heart chakra. Spritz morning and night for a dewy glow.', ingredients: 'Bulgarian Rose Water, Aloe Vera Juice, Glycerine, Rose Otto, Hyaluronic Acid', weight: '100ml', emoji: '🌸', tag: 'Bestseller', stock: 65, rating: 4.8, reviews: 178 },
    { id: 'p17', name: 'As You Like It Face Mist', category: 'Bath & Body', subcategory: 'Face Mist', price: 650, originalPrice: 650, description: 'A customisable mood mist with adaptogens. Sets your emotional tone for the day — uplifting citrus notes with grounding patchouli underneath.', ingredients: 'Witch Hazel, Patchouli, Sweet Orange, Ashwagandha Water, Colloidal Silver', weight: '100ml', emoji: '✨', tag: 'New', stock: 30, rating: 4.7, reviews: 54 },

    // Foot Care
    { id: 'p18', name: 'Ananda Foot Cream', category: 'Bath & Body', subcategory: 'Foot Care', price: 420, originalPrice: 420, description: 'Deeply healing foot cream for cracked heels and tired feet. Urea + shea butter + peppermint to soften, heal, and revive.', ingredients: 'Urea 10%, Shea Butter, Peppermint Oil, Tea Tree, Beeswax, Vitamin E', weight: '75g', emoji: '🩺', tag: null, stock: 40, rating: 4.6, reviews: 87 },

    // Wellness — Aura Sprays
    { id: 'p19', name: 'Aura Cleansing Spray', category: 'Wellness', subcategory: 'Aura Sprays', price: 650, originalPrice: 650, description: 'Cleanse and reset your energy field with this powerful blend of sage, palo santo, and protective crystals. Use after stressful encounters.', ingredients: 'Sacred Sage Hydrosol, Palo Santo, Black Tourmaline Water, Frankincense, Selenite', weight: '100ml', emoji: '🌀', tag: 'Bestseller', stock: 55, rating: 4.9, reviews: 203 },
    { id: 'p20', name: 'Harmony Spray', category: 'Wellness', subcategory: 'Aura Sprays', price: 1100, originalPrice: 1100, description: 'Restore balance to relationships and spaces. Rose and ylang-ylang frequencies create harmony wherever you spray. Includes rose quartz essence.', ingredients: 'Rose Hydrosol, Ylang-Ylang, Rose Quartz Crystal Water, Geranium, Bergamot', weight: '150ml', emoji: '🌺', tag: 'New', stock: 28, rating: 4.8, reviews: 92 },
    { id: 'p21', name: 'Protection Spray', category: 'Wellness', subcategory: 'Aura Sprays', price: 1100, originalPrice: 1100, description: 'Your energetic shield. Black tourmaline and obsidian-charged water create a protective field. Spray around yourself or your home perimeter.', ingredients: 'Black Tourmaline Water, Obsidian Essence, Myrrh, Vetiver, Cedarwood', weight: '150ml', emoji: '🛡️', tag: 'New', stock: 22, rating: 4.9, reviews: 76 },
    { id: 'p22', name: 'Prosperity Spray', category: 'Wellness', subcategory: 'Aura Sprays', price: 1500, originalPrice: 1500, description: 'Activate abundance frequencies with citrine and pyrite-charged water. Cinnamon and bergamot attract opportunity. Spray on your wallet, workspace, and self.', ingredients: 'Citrine Crystal Water, Pyrite Essence, Cinnamon Bark, Bergamot, Sweet Orange', weight: '150ml', emoji: '💛', tag: 'Premium', stock: 18, rating: 4.9, reviews: 61 },
    { id: 'p23', name: 'Healers Spray', category: 'Wellness', subcategory: 'Aura Sprays', price: 380, originalPrice: 380, description: 'Designed for healers, therapists, and empaths. Clears absorbed energies and restores your own field between sessions. Compact 50ml bottle.', ingredients: 'White Sage, Lavender, Amethyst Water, Eucalyptus, Rosemary', weight: '50ml', emoji: '💚', tag: 'Bestseller', stock: 70, rating: 4.8, reviews: 156 },

    // Wellness — Essential Oils
    { id: 'p24', name: 'Aura Cleansing Essential Oil', category: 'Wellness', subcategory: 'Essential Oils', price: 1650, originalPrice: 1650, description: 'A rare blend of 12 sacred oils formulated to cleanse the biofield. Use in diffuser, bath, or diluted for anointing. Potent and transformative.', ingredients: 'Frankincense, Myrrh, Sandalwood, Clary Sage, Vetiver, Palo Santo, Cedarwood, Rose', weight: '10ml', emoji: '⚗️', tag: 'Premium', stock: 15, rating: 5.0, reviews: 44 },
    { id: 'p25', name: 'Bulgarian Lavender Essential Oil', category: 'Wellness', subcategory: 'Essential Oils', price: 1500, originalPrice: 1500, description: 'Single-origin Bulgarian lavender oil, harvested at peak bloom from the Valley of Roses. The finest therapeutic-grade lavender available.', ingredients: '100% Pure Lavandula Angustifolia (Bulgaria)', weight: '10ml', emoji: '💐', tag: 'Pure', stock: 20, rating: 4.9, reviews: 89 },

    // Wellness — Room & Home
    { id: 'p26', name: 'Room Mist — Serenity', category: 'Wellness', subcategory: 'Room Mists', price: 750, originalPrice: 750, description: 'Transform any room into a sanctuary. Lavender, chamomile, and moonstone water create an atmosphere of deep calm and rest.', ingredients: 'Lavender Hydrosol, Chamomile, Moonstone Water, Vetiver, Roman Chamomile', weight: '200ml', emoji: '🏠', tag: 'New', stock: 35, rating: 4.7, reviews: 62 },
    { id: 'p27', name: 'Floor Aura Cleanser', category: 'Wellness', subcategory: 'Floor Aura Cleanser', price: 550, originalPrice: 550, description: 'Add to your mopping water to energetically cleanse your home. Camphor, salt, and sacred herbs clear stagnant energy from your living space.', ingredients: 'Camphor Water, Rock Salt, Neem, Eucalyptus, Citronella, Lemongrass', weight: '500ml', emoji: '🧹', tag: null, stock: 45, rating: 4.6, reviews: 73 },
    { id: 'p28', name: 'Healers Hand Wash', category: 'Wellness', subcategory: 'Healers Hand Wash', price: 350, originalPrice: 350, description: 'Antibacterial and energetically purifying. Neem + tulsi kills 99.9% of germs while selenite water clears absorbed energies from healing work.', ingredients: 'Neem, Tulsi, Selenite Water, Aloe Vera, Tea Tree, Lemon', weight: '250ml', emoji: '🙌', tag: null, stock: 80, rating: 4.5, reviews: 112 },
    { id: 'p29', name: 'Shuddhi Hand Wash', category: 'Wellness', subcategory: 'Healers Hand Wash', price: 350, originalPrice: 350, description: 'Purification in every wash. Sacred geometry encoded formula with Himalayan water, neem, and rose. Gentle on skin, fierce on impurity.', ingredients: 'Himalayan Spring Water, Neem, Rose, Aloe, Coconut Surfactant', weight: '250ml', emoji: '💧', tag: 'Bestseller', stock: 90, rating: 4.7, reviews: 167 },

    // Himalayan Salt Lamp
    { id: 'p30', name: 'Himalayan Pink Salt Lamp', category: 'Wellness', subcategory: 'Himalayan Pink Rock Salt Lamp', price: 1800, originalPrice: 2200, description: 'Authentic Himalayan pink salt lamp from the Khewra mines. Emits negative ions to purify air, improve sleep, and create a healing ambience. Includes bulb and cord.', ingredients: 'Himalayan Pink Rock Salt, Wooden Base, 15W Bulb', weight: '2-3kg', emoji: '🪔', tag: '18% Off', stock: 15, rating: 4.8, reviews: 134 },

    // Incense
    { id: 'p31', name: 'Daily Hawan Dhoop', category: 'Wellness', subcategory: 'Incense Sticks', price: 450, originalPrice: 450, description: 'Traditional hawan dhoop made from 25 sacred herbs. Daily burning purifies the home, removes negative energies, and invites blessings. Pack of 25.', ingredients: 'Gugal, Camphor, Sandalwood, Cow Ghee, Loban, Benzoin, Sacred Herbs', weight: '100g (25 pieces)', emoji: '🌫️', tag: 'New', stock: 60, rating: 4.7, reviews: 88 },
    { id: 'p32', name: 'Camphor Healing Sticks', category: 'Wellness', subcategory: 'Incense Sticks', price: 350, originalPrice: 350, description: 'Pure camphor incense sticks for space clearing and meditation. Instantly elevates vibration and clears mental fog.', ingredients: 'Natural Camphor, Sandalwood Powder, Frankincense, Natural Binder', weight: '50g', emoji: '🕯️', tag: null, stock: 75, rating: 4.6, reviews: 95 },

    // Gifts & Combos
    { id: 'p33', name: 'The Healing Starter Kit', category: 'Gifts & Combos', subcategory: 'Gifts and Combos', price: 1800, originalPrice: 2400, description: 'The perfect introduction to Asthaya healing. Includes Chi Crystal Soap, Aura Cleansing Spray, Rose Face Mist, and a Healers Hand Wash in a beautiful gift box.', ingredients: 'See individual products', weight: 'Set of 4', emoji: '🎁', tag: '25% Off', stock: 20, rating: 4.9, reviews: 45 },
    { id: 'p34', name: 'Bath Ritual Box', category: 'Gifts & Combos', subcategory: 'Gifts and Combos', price: 2200, originalPrice: 2800, description: 'Complete bath ritual experience. Coffee Scrub + Lavender Body Wash + Body Butter + Ananda Foot Soak. A luxurious gift for yourself or someone you love.', ingredients: 'See individual products', weight: 'Set of 4', emoji: '🛁', tag: '21% Off', stock: 15, rating: 5.0, reviews: 38 },
    { id: 'p35', name: 'Aura Healing Bundle', category: 'Gifts & Combos', subcategory: 'Gifts and Combos', price: 2800, originalPrice: 3600, description: 'Complete your energetic protection and healing practice. Includes Aura Cleansing Spray, Protection Spray, Healers Spray, and Essential Oil.', ingredients: 'See individual products', weight: 'Set of 4', emoji: '💫', tag: '22% Off', stock: 10, rating: 4.9, reviews: 29 },
  ];
  db.orders = [];
  db.users = [];
  writeDB(db);
  console.log('Seeded', db.products.length, 'products');
}

seedProducts();

// ══════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  const db = readDB();
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
  const user = { id: genId(), name, email, password: hashPwd(password), createdAt: Date.now(), addresses: [] };
  db.users.push(user);
  writeDB(db);
  const token = jwt.sign({ id: user.id, email, name }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === hashPwd(password));
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/auth/me', auth, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ id: user.id, name: user.name, email: user.email, addresses: user.addresses || [] });
});

// ══════════════════════════════════════
//  PRODUCT ROUTES
// ══════════════════════════════════════
app.get('/api/products', (req, res) => {
  const db = readDB();
  const { category, subcategory, search, sort } = req.query;
  let products = db.products;
  if (category) products = products.filter(p => p.category === category);
  if (subcategory) products = products.filter(p => p.subcategory === subcategory);
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
  }
  if (sort === 'price_asc') products = [...products].sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') products = [...products].sort((a, b) => b.price - a.price);
  if (sort === 'rating') products = [...products].sort((a, b) => b.rating - a.rating);
  res.json(products);
});

app.get('/api/products/categories', (req, res) => {
  const db = readDB();
  const cats = {};
  db.products.forEach(p => {
    if (!cats[p.category]) cats[p.category] = new Set();
    cats[p.category].add(p.subcategory);
  });
  const result = Object.entries(cats).map(([cat, subs]) => ({ category: cat, subcategories: [...subs] }));
  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const db = readDB();
  const p = db.products.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

// ══════════════════════════════════════
//  CART ROUTES
// ══════════════════════════════════════
app.get('/api/cart', auth, (req, res) => {
  const db = readDB();
  const cart = db.cart ? db.cart.filter(c => c.userId === req.user.id) : [];
  const enriched = cart.map(item => {
    const p = db.products.find(p => p.id === item.productId);
    return p ? { ...item, product: p } : null;
  }).filter(Boolean);
  res.json(enriched);
});

app.post('/api/cart', auth, (req, res) => {
  const { productId, qty = 1 } = req.body;
  const db = readDB();
  if (!db.cart) db.cart = [];
  const idx = db.cart.findIndex(c => c.userId === req.user.id && c.productId === productId);
  if (idx >= 0) db.cart[idx].qty += qty;
  else db.cart.push({ id: genId(), userId: req.user.id, productId, qty });
  writeDB(db);
  res.json({ ok: true });
});

app.put('/api/cart/:id', auth, (req, res) => {
  const { qty } = req.body;
  const db = readDB();
  const idx = db.cart.findIndex(c => c.id === req.params.id && c.userId === req.user.id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  if (qty <= 0) db.cart.splice(idx, 1);
  else db.cart[idx].qty = qty;
  writeDB(db);
  res.json({ ok: true });
});

app.delete('/api/cart/:id', auth, (req, res) => {
  const db = readDB();
  db.cart = db.cart.filter(c => !(c.id === req.params.id && c.userId === req.user.id));
  writeDB(db);
  res.json({ ok: true });
});

// ══════════════════════════════════════
//  ORDER ROUTES
// ══════════════════════════════════════
app.post('/api/orders', auth, (req, res) => {
  const { items, address, paymentMethod } = req.body;
  if (!items || !items.length || !address) return res.status(400).json({ error: 'Missing order details' });

  const db = readDB();
  const orderItems = items.map(i => {
    const p = db.products.find(p => p.id === i.productId);
    if (!p) throw new Error('Product not found: ' + i.productId);
    return { productId: p.id, name: p.name, price: p.price, qty: i.qty, emoji: p.emoji };
  });
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 80;
  const total = subtotal + shipping;

  const order = {
    id: 'AWH-' + Date.now().toString(36).toUpperCase(),
    userId: req.user.id,
    userName: req.user.name,
    items: orderItems,
    address,
    paymentMethod: paymentMethod || 'COD',
    subtotal, shipping, total,
    status: 'Confirmed',
    createdAt: Date.now()
  };

  if (!db.orders) db.orders = [];
  db.orders.push(order);

  // Clear user cart
  db.cart = (db.cart || []).filter(c => c.userId !== req.user.id);
  writeDB(db);

  res.json({ order });
});

app.get('/api/orders', auth, (req, res) => {
  const db = readDB();
  const orders = (db.orders || []).filter(o => o.userId === req.user.id)
    .sort((a, b) => b.createdAt - a.createdAt);
  res.json(orders);
});

app.get('/api/orders/:id', auth, (req, res) => {
  const db = readDB();
  const order = (db.orders || []).find(o => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// SPA fallback
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Asthaya server running on port ${PORT}`));
