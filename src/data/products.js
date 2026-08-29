export const categories = [
  {
    id: 'cars',
    name: 'Cars',
    tagline: 'Machines that move the soul.',
    description: 'From vintage JDM legends to modern supercars — framed prints that celebrate automotive culture in all its forms.',
    accent: '#C23B22',
  },
  {
    id: 'anime',
    name: 'Anime',
    tagline: 'Every frame tells a story.',
    description: 'Iconic scenes, character studies, and poster art from the series that defined a generation. Premium prints, gallery-ready.',
    accent: '#6B4C9A',
  },
  {
    id: 'posters',
    name: 'Posters',
    tagline: 'Culture, condensed.',
    description: 'Movie posters, music art, retro ads, and typographic prints. The wall decor that says something about you.',
    accent: '#2D6A4F',
  },
];

export const frameMaterials = [
  { id: 'black', name: 'Black', hex: '#1A1A1A' },
  { id: 'white', name: 'White', hex: '#F5F5F5' },
  { id: 'silver', name: 'Silver', hex: '#C0C0C0' },
];

export const frameSizes = [
  { id: 'a5', label: 'A5 (6×8")', width: 6, height: 8, price: 1499 },
  { id: 'a4', label: 'A4 (8×12")', width: 8, height: 12, price: 2299 },
];

export const textures = [
  { id: 'matte', name: 'Matte', upcharge: 0 },
  { id: 'glossy', name: 'Glossy', upcharge: 200 },
];

export const productStatuses = ['Active', 'Draft', 'Out of Stock', 'Sold Out'];

export const products = [
  // === CARS ===
  {
    id: 1,
    name: 'Skyline at Dusk',
    category: 'cars',
    description: 'R34 GT-R silhouetted against a Tokyo sunset. The car that launched a thousand dreams.',
    price: 2299,
    discountPercent: 15,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=800&fit=crop',
    badge: 'Best Seller',
    naturalRatio: 0.75,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Porsche 911 Study',
    category: 'cars',
    description: 'A clean-side profile of the 993 generation. Timeless lines, timeless car.',
    price: 2699,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=800&fit=crop',
    badge: 'New',
    naturalRatio: 0.75,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Midnight Runner',
    category: 'cars',
    description: 'AE86 in the mountain pass. Touge legends never die.',
    price: 2099,
    discountPercent: 10,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Lambo & Gold',
    category: 'cars',
    description: 'Murciélago in a gallery setting. Excess as art form.',
    price: 3199,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=800&fit=crop',
    badge: 'Limited',
    naturalRatio: 0.75,
    status: 'Active',
  },

  // === ANIME ===
  {
    id: 5,
    name: 'Neon District',
    category: 'anime',
    description: 'Cyberpunk cityscape in the style of Ghost in the Shell. Rain-soaked streets and electric dreams.',
    price: 2499,
    discountPercent: 20,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=800&fit=crop',
    badge: 'Popular',
    naturalRatio: 0.75,
    status: 'Active',
  },
  {
    id: 6,
    name: 'Mecha Blueprint',
    category: 'anime',
    description: 'Technical illustration of a giant robot in the style of Evangelion cutaway diagrams.',
    price: 2299,
    discountPercent: 0,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
  },
  {
    id: 7,
    name: 'Spirit Forest',
    category: 'anime',
    description: 'Miyazaki-inspired forest spirit scene. Hand-painted aesthetic, giclée printed.',
    price: 2899,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&h=800&fit=crop',
    badge: 'Staff Pick',
    naturalRatio: 0.75,
    status: 'Active',
  },
  {
    id: 8,
    name: 'Samurai Moon',
    category: 'anime',
    description: 'Ronin under a blood moon. Bold linework meets ukiyo-e composition.',
    price: 2399,
    discountPercent: 5,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
  },

  // === POSTERS ===
  {
    id: 9,
    name: 'Brutalist Summer',
    category: 'posters',
    description: 'Minimalist concert poster for a fictional festival. Risograph-style two-color print.',
    price: 1699,
    discountPercent: 0,
    sizes: ['a5', 'a4'],
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
  },
  {
    id: 10,
    name: 'Coffee & Typography',
    category: 'posters',
    description: 'Swiss-style typographic print. Clean, precise, and endlessly wall-worthy.',
    price: 1599,
    discountPercent: 25,
    sizes: ['a5'],
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
  },
  {
    id: 11,
    name: 'Vintage Travel',
    category: 'posters',
    description: 'Retro-futuristic travel poster for a city that never was. Offset print aesthetic.',
    price: 1899,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
  },
  {
    id: 12,
    name: 'Cinema Noir',
    category: 'posters',
    description: 'Fictional film poster in the tradition of 70s exploitation cinema. Bold, loud, unforgettable.',
    price: 1999,
    discountPercent: 0,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=800&fit=crop',
    badge: 'New',
    naturalRatio: 0.67,
    status: 'Active',
  },
  {
    id: 13,
    name: 'Space Oddity',
    category: 'posters',
    description: 'Vintage NASA-inspired astronomy print. Retro science meets modern framing.',
    price: 2099,
    discountPercent: 10,
    sizes: ['a4'],
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=800&fit=crop',
    naturalRatio: 0.75,
    status: 'Active',
  },
];

export const getProductById = (id) => products.find((p) => p.id === Number(id));

export const getActiveProducts = () => products.filter((p) => p.status === 'Active');

export const getProductsByCategory = (category) =>
  products.filter((p) => p.category === category && p.status === 'Active');

export const getCategoryById = (id) => categories.find((c) => c.id === id);

export const getSizePrice = (sizeId) => {
  const size = frameSizes.find((s) => s.id === sizeId);
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
