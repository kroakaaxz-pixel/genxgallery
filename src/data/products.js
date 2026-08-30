export const categories = [
  {
    id: 'posters',
    name: 'Posters',
    tagline: 'Unframed prints, ready for your own frame.',
    description: 'High-quality giclée prints on archival paper. Affordable, flexible, and perfect for those who already have a frame setup.',
    accent: '#2D6A4F',
  },
  {
    id: 'framed-posters',
    name: 'Framed Posters',
    tagline: 'Gallery-ready, frame included.',
    description: 'Premium prints in handcrafted frames. Choose your frame material, size, and finish — ready to hang out of the box.',
    accent: '#C23B22',
  },
];

export const subCategories = [
  { id: 'anime', name: 'Anime', accent: '#6B4C9A' },
  { id: 'cars', name: 'Cars', accent: '#C23B22' },
  { id: 'bikes', name: 'Bikes', accent: '#D4A017' },
  { id: 'others', name: 'Others', accent: '#2D6A4F' },
];

export const getSubCategoryById = (id) => subCategories.find((s) => s.id === id);

export const frameMaterials = [
  { id: 'black', name: 'Black', hex: '#1A1A1A' },
  { id: 'white', name: 'White', hex: '#F5F5F5' },
  { id: 'silver', name: 'Silver', hex: '#C0C0C0' },
];

export const frameSizes = [
  { id: 'a5', label: 'A5 (6×8")', width: 6, height: 8, price: 1499 },
  { id: 'a4', label: 'A4 (8×12")', width: 8, height: 12, price: 2299 },
];

export const posterSizes = [
  { id: 'a5', label: 'A5 (6×8")', price: 399 },
  { id: 'a4', label: 'A4 (8×12")', price: 699 },
];

export const textures = [
  { id: 'matte', name: 'Matte', upcharge: 0 },
  { id: 'glossy', name: 'Glossy', upcharge: 200 },
];

export const productStatuses = ['Active', 'Draft', 'Out of Stock', 'Sold Out'];

export const products = [
  // === FRAMED POSTERS — CARS ===
  {
    id: 1,
    name: 'Skyline at Dusk',
    category: 'framed-posters',
    subCategory: 'cars',
    description: 'R34 GT-R silhouetted against a Tokyo sunset. The car that launched a thousand dreams.',
    price: 2299,
    discountPercent: 15,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=800&fit=crop',
    badge: 'Best Seller',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: true,
  },
  {
    id: 2,
    name: 'Porsche 911 Study',
    category: 'framed-posters',
    subCategory: 'cars',
    description: 'A clean-side profile of the 993 generation. Timeless lines, timeless car.',
    price: 2699,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=800&fit=crop',
    badge: 'New',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: true,
    isSpecialDeal: false,
  },
  {
    id: 3,
    name: 'Midnight Runner',
    category: 'framed-posters',
    subCategory: 'cars',
    description: 'AE86 in the mountain pass. Touge legends never die.',
    price: 2099,
    discountPercent: 10,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: true,
  },
  {
    id: 4,
    name: 'Lambo & Gold',
    category: 'framed-posters',
    subCategory: 'cars',
    description: 'Murciélago in a gallery setting. Excess as art form.',
    price: 3199,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=800&fit=crop',
    badge: 'Limited',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: false,
  },

  // === FRAMED POSTERS — ANIME ===
  {
    id: 5,
    name: 'Neon District',
    category: 'framed-posters',
    subCategory: 'anime',
    description: 'Cyberpunk cityscape in the style of Ghost in the Shell. Rain-soaked streets and electric dreams.',
    price: 2499,
    discountPercent: 20,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=800&fit=crop',
    badge: 'Popular',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: true,
  },
  {
    id: 6,
    name: 'Mecha Blueprint',
    category: 'framed-posters',
    subCategory: 'anime',
    description: 'Technical illustration of a giant robot in the style of Evangelion cutaway diagrams.',
    price: 2299,
    discountPercent: 0,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: true,
    isSpecialDeal: false,
  },
  {
    id: 7,
    name: 'Spirit Forest',
    category: 'framed-posters',
    subCategory: 'anime',
    description: 'Miyazaki-inspired forest spirit scene. Hand-painted aesthetic, giclée printed.',
    price: 2899,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&h=800&fit=crop',
    badge: 'Staff Pick',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: true,
    isSpecialDeal: false,
  },
  {
    id: 8,
    name: 'Samurai Moon',
    category: 'framed-posters',
    subCategory: 'anime',
    description: 'Ronin under a blood moon. Bold linework meets ukiyo-e composition.',
    price: 2399,
    discountPercent: 5,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: false,
  },

  // === FRAMED POSTERS — OTHERS ===
  {
    id: 9,
    name: 'Brutalist Summer',
    category: 'framed-posters',
    subCategory: 'others',
    description: 'Minimalist concert poster for a fictional festival. Risograph-style two-color print.',
    price: 1699,
    discountPercent: 0,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: true,
    isSpecialDeal: false,
  },
  {
    id: 10,
    name: 'Coffee & Typography',
    category: 'framed-posters',
    subCategory: 'others',
    description: 'Swiss-style typographic print. Clean, precise, and endlessly wall-worthy.',
    price: 1599,
    discountPercent: 25,
    sizes: ['a5'],
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: true,
  },
  {
    id: 11,
    name: 'Vintage Travel',
    category: 'framed-posters',
    subCategory: 'others',
    description: 'Retro-futuristic travel poster for a city that never was. Offset print aesthetic.',
    price: 1899,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: false,
  },
  {
    id: 12,
    name: 'Cinema Noir',
    category: 'framed-posters',
    subCategory: 'others',
    description: 'Fictional film poster in the tradition of 70s exploitation cinema. Bold, loud, unforgettable.',
    price: 1999,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=800&fit=crop',
    badge: 'New',
    naturalRatio: 0.67,
    status: 'Active',
    isNewArrival: true,
    isSpecialDeal: false,
  },
  {
    id: 13,
    name: 'Space Oddity',
    category: 'framed-posters',
    subCategory: 'others',
    description: 'Vintage NASA-inspired astronomy print. Retro science meets modern framing.',
    price: 2099,
    discountPercent: 10,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: true,
  },

  // === POSTERS (unframed) — CARS ===
  {
    id: 14,
    name: 'GT-R Profile',
    category: 'posters',
    subCategory: 'cars',
    description: 'Clean side-profile of the R35 GT-R. Minimal, bold, automotive art.',
    price: 699,
    discountPercent: 0,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: true,
    isSpecialDeal: false,
  },
  {
    id: 15,
    name: 'Turbo Silhouette',
    category: 'posters',
    subCategory: 'cars',
    description: 'Silhouette study of a tuned JDM legend. Dark tones, sharp lines.',
    price: 599,
    discountPercent: 10,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: true,
  },

  // === POSTERS (unframed) — ANIME ===
  {
    id: 16,
    name: 'Neon Runner',
    category: 'posters',
    subCategory: 'anime',
    description: 'Cyberpunk runner in a neon-lit alley. Vibrant, high-contrast print.',
    price: 599,
    discountPercent: 0,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: true,
    isSpecialDeal: false,
  },
  {
    id: 17,
    name: 'Spirit Deer',
    category: 'posters',
    subCategory: 'anime',
    description: 'Miyazaki-inspired forest spirit as a young deer. Soft watercolor aesthetic.',
    price: 499,
    discountPercent: 0,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&h=800&fit=crop',
    badge: 'New',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: true,
    isSpecialDeal: false,
  },

  // === POSTERS (unframed) — BIKES ===
  {
    id: 18,
    name: 'Café Racer Study',
    category: 'posters',
    subCategory: 'bikes',
    description: 'Vintage café racer in a moody garage setting. Warm tones, film grain.',
    price: 599,
    discountPercent: 0,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: true,
    isSpecialDeal: false,
  },

  // === POSTERS (unframed) — OTHERS ===
  {
    id: 19,
    name: 'Risograph Flowers',
    category: 'posters',
    subCategory: 'others',
    description: 'Abstract floral composition in risograph-style two-color print.',
    price: 499,
    discountPercent: 15,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
    isNewArrival: false,
    isSpecialDeal: true,
  },
];

export const getProductById = (id) => products.find((p) => p.id === Number(id));

export const getActiveProducts = () => products.filter((p) => p.status === 'Active');

export const getProductsByCategory = (category) =>
  products.filter((p) => p.category === category && p.status === 'Active');

export const getProductsBySubCategory = (category, subCategory) =>
  products.filter((p) => p.category === category && p.subCategory === subCategory && p.status === 'Active');

export const getCategoryById = (id) => categories.find((c) => c.id === id);

export const getPosterSizes = () => posterSizes;

export const getSizePrice = (sizeId) => {
  const size = frameSizes.find((s) => s.id === sizeId);
  return size ? size.price : 0;
};

export const getPosterSizePrice = (sizeId) => {
  const size = posterSizes.find((s) => s.id === sizeId);
  return size ? size.price : 0;
};

export const getDiscountedPrice = (product) => {
  if (!product.discountPercent) return product.price;
  return Math.round(product.price * (1 - product.discountPercent / 100));
};

export const getDiscountedSizePrice = (product, sizeId) => {
  const basePrice = getSizePrice(sizeId);
  if (!product.discountPercent) return basePrice;
  return Math.round(basePrice * (1 - product.discountPercent / 100));
};

export const getNewArrivals = () =>
  products.filter((p) => p.status === 'Active' && p.isNewArrival);

export const getSpecialDeals = () =>
  products.filter((p) => p.status === 'Active' && p.isSpecialDeal);

// Mock review data — display-only, read-only for now.
// A real review system would need backend storage and authentication.
const reviewData = {
  1: { rating: 4.8, reviewCount: 47, reviews: [
    { name: 'Arjun M.', rating: 5, date: '2026-08-10', comment: 'The R34 print is stunning. Colors are rich and the frame quality is exceptional. Hangs perfectly in my study.' },
    { name: 'Priya K.', rating: 5, date: '2026-08-02', comment: 'Bought this for my husband\'s birthday. He\'s obsessed. The packaging was also excellent — no damage during shipping.' },
    { name: 'Rohan S.', rating: 4, date: '2026-07-20', comment: 'Great print, solid frame. Only minor note: the A5 size is smaller than I expected. Go A4 if you want impact.' },
  ]},
  2: { rating: 4.6, reviewCount: 32, reviews: [
    { name: 'Vikram T.', rating: 5, date: '2026-08-15', comment: 'Clean, elegant, and exactly what my office needed. The 993 profile is timeless.' },
    { name: 'Meera J.', rating: 4, date: '2026-07-28', comment: 'Beautiful print. The black frame is sleek. Wish there were more size options though.' },
  ]},
  3: { rating: 4.7, reviewCount: 28, reviews: [
    { name: 'Karan D.', rating: 5, date: '2026-08-12', comment: 'Touge vibes captured perfectly. The moody tones are even better in person than in the photos.' },
    { name: 'Nisha R.', rating: 5, date: '2026-07-30', comment: 'Already ordered a second one for my garage wall. Perfect gift for any JDM fan.' },
  ]},
  4: { rating: 4.9, reviewCount: 19, reviews: [
    { name: 'Aditya P.', rating: 5, date: '2026-08-08', comment: 'This is gallery-worthy. The gold frame option makes it look like a piece from an actual exhibition.' },
    { name: 'Sana L.', rating: 5, date: '2026-07-15', comment: 'Worth every penny. The print quality is museum-level. Stunned by the detail.' },
  ]},
  5: { rating: 4.8, reviewCount: 56, reviews: [
    { name: 'Zara H.', rating: 5, date: '2026-08-20', comment: 'Ghost in the Shell vibes done right. The neon colors pop against the black frame. Absolutely love it.' },
    { name: 'Irfan A.', rating: 5, date: '2026-08-05', comment: 'Best anime print I\'ve ever bought. The rain-soaked cityscape is mesmerizing.' },
    { name: 'Tanya B.', rating: 4, date: '2026-07-22', comment: 'Gorgeous print. The cyberpunk aesthetic fits my setup perfectly. Delivery was fast too.' },
  ]},
  6: { rating: 4.5, reviewCount: 21, reviews: [
    { name: 'Dev M.', rating: 5, date: '2026-08-14', comment: 'The blueprint style is unique and the technical detail is impressive. A conversation starter.' },
    { name: 'Lakshmi N.', rating: 4, date: '2026-07-18', comment: 'Nice print, good quality. The Evangelion cutaway style is very cool.' },
  ]},
  7: { rating: 4.9, reviewCount: 38, reviews: [
    { name: 'Ananya G.', rating: 5, date: '2026-08-18', comment: 'This Miyazaki-inspired piece is magical. The watercolor aesthetic is so well done. Staff pick for a reason.' },
    { name: 'Ravi P.', rating: 5, date: '2026-08-01', comment: 'Our family loves Studio Ghibli. This print captures that spirit perfectly. Beautiful framing.' },
    { name: 'Neha S.', rating: 5, date: '2026-07-12', comment: 'Bought two — one for the nursery, one for my office. Both look amazing. High quality throughout.' },
  ]},
  8: { rating: 4.4, reviewCount: 15, reviews: [
    { name: 'Siddharth K.', rating: 5, date: '2026-08-11', comment: 'The samurai under the blood moon is incredible. Bold lines, perfect composition.' },
    { name: 'Pooja V.', rating: 4, date: '2026-07-25', comment: 'Love the ukiyo-e influence. Solid print quality. The 5% discount made it even better.' },
  ]},
  9: { rating: 4.3, reviewCount: 12, reviews: [
    { name: 'Marcus W.', rating: 4, date: '2026-08-09', comment: 'Clean risograph aesthetic. The two-color print looks great in my studio apartment.' },
    { name: 'Kavita R.', rating: 5, date: '2026-07-19', comment: 'Love the minimalist concert poster vibe. Unique and stylish.' },
  ]},
  10: { rating: 4.7, reviewCount: 24, reviews: [
    { name: 'Thomas L.', rating: 5, date: '2026-08-16', comment: 'Swiss typography perfection. Clean, precise, and endlessly wall-worthy. Exactly as described.' },
    { name: 'Divya M.', rating: 4, date: '2026-07-29', comment: 'Beautiful print. The 25% discount was a nice surprise. Looks sharp on my office wall.' },
  ]},
  11: { rating: 4.6, reviewCount: 18, reviews: [
    { name: 'Olivia C.', rating: 5, date: '2026-08-13', comment: 'Retro-futuristic travel poster that sparks imagination. The offset print aesthetic is charming.' },
    { name: 'Amit J.', rating: 4, date: '2026-07-16', comment: 'Great design, solid quality. A bit pricey at full price but worth it for the aesthetic.' },
  ]},
  12: { rating: 4.8, reviewCount: 22, reviews: [
    { name: 'James R.', rating: 5, date: '2026-08-17', comment: 'Bold, loud, unforgettable — just like the description says. The 70s exploitation cinema vibe is nailed.' },
    { name: 'Ritu D.', rating: 5, date: '2026-08-03', comment: 'This poster has serious personality. The noir aesthetic is perfectly executed.' },
  ]},
  13: { rating: 4.5, reviewCount: 26, reviews: [
    { name: 'Neil P.', rating: 5, date: '2026-08-19', comment: 'Vintage NASA-inspired and absolutely gorgeous. Retro science meets modern framing — love it.' },
    { name: 'Simran K.', rating: 4, date: '2026-07-24', comment: 'Beautiful astronomy print. The retro aesthetic is perfectly done. Good quality frame.' },
  ]},
  14: { rating: 4.4, reviewCount: 11, reviews: [
    { name: 'Rahul S.', rating: 5, date: '2026-08-07', comment: 'Clean R35 side profile. Minimal and bold. Perfect for my garage wall.' },
    { name: 'Priyanka M.', rating: 4, date: '2026-07-14', comment: 'Nice print quality for the price. Unframed so you\'ll need your own frame, but the paper is thick.' },
  ]},
  15: { rating: 4.3, reviewCount: 9, reviews: [
    { name: 'Vikash T.', rating: 4, date: '2026-08-06', comment: 'Dark tones, sharp lines — exactly what I wanted for a moody corner. Good value with the 10% off.' },
  ]},
  16: { rating: 4.7, reviewCount: 14, reviews: [
    { name: 'Aisha R.', rating: 5, date: '2026-08-10', comment: 'Vibrant cyberpunk runner. The neon colors are incredible. Great for the price.' },
    { name: 'Karthik P.', rating: 5, date: '2026-07-27', comment: 'High contrast, high impact. This print punches way above its price point.' },
  ]},
  17: { rating: 4.8, reviewCount: 16, reviews: [
    { name: 'Tanvi L.', rating: 5, date: '2026-08-14', comment: 'The spirit deer is adorable. Watercolor aesthetic is perfectly done. My daughter loves it.' },
    { name: 'Manish G.', rating: 5, date: '2026-08-01', comment: 'Bought for the nursery. Soft, gentle, and beautifully printed. Highly recommend.' },
  ]},
  18: { rating: 4.5, reviewCount: 8, reviews: [
    { name: 'Sanjay K.', rating: 5, date: '2026-08-08', comment: 'Café racer in a moody garage — warm tones, film grain. Exactly my aesthetic.' },
    { name: 'Deepa N.', rating: 4, date: '2026-07-20', comment: 'Great vintage motorcycle print. The film grain effect is really well done.' },
  ]},
  19: { rating: 4.6, reviewCount: 13, reviews: [
    { name: 'Emma S.', rating: 5, date: '2026-08-12', comment: 'Abstract floral in risograph style. Unique and beautiful. The 15% discount is a bonus.' },
    { name: 'Arjun V.', rating: 4, date: '2026-07-31', comment: 'Nice two-color print. Looks great in my living room. Good paper quality.' },
  ]},
};

export const getReviewsForProduct = (productId) => reviewData[productId] || null;
