/**
 * Mock order dataset for Gen X Gallery admin panel.
 *
 * ~50 orders spread across the last 8 months with realistic:
 * - Status distribution: ~68% Delivered, ~16% Processing/Shipped, ~10% Cancelled, ~6% Returned
 * - Prices derived from actual product catalogue + size/material/texture pricing
 * - Dates that give the analytics charts real variation
 *
 * Cost assumption for profit calculation: ~42% of revenue (COGS).
 * Adjust COST_RATIO in Admin.jsx analytics if needed.
 */

const firstNames = [
  'Arjun', 'Priya', 'Rohit', 'Ananya', 'Vikram', 'Meera', 'Kabir', 'Nisha',
  'Aditya', 'Tanya', 'Rahul', 'Deepa', 'Sanjay', 'Kavita', 'Nikhil', 'Pooja',
  'Amit', 'Shruti', 'Varun', 'Isha', 'Manish', 'Ritu', 'Siddharth', 'Neha',
  'Rajan', 'Simran', 'Karthik', 'Divya', 'Aakash', 'Tanvi', 'Gaurav', 'Megha',
  'Tarun', 'Aarti', 'Naveen', 'Shikha', 'Prateek', 'Komal', 'Abhishek', 'Rina',
  'Saurabh', 'Pallavi', 'Jatin', 'Mona', 'Rishi', 'Geeta', 'Arun', 'Sunita',
  'Vivek', 'Lata',
];

const lastNames = [
  'Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Nair', 'Gupta', 'Joshi',
  'Mehta', 'Iyer', 'Rao', 'Mishra', 'Chauhan', 'Bhatt', 'Kapoor', 'Sinha',
  'Desai', 'Tiwari', 'Verma', 'Kulkarni', 'Menon', 'Pandey', 'Malhotra', 'Saxena',
  'Chandra', 'Kamble', 'Thakur', 'Ghosh', 'Banerjee', 'Dutta',
];

const streets = [
  'MG Road', 'Park Street', 'Station Road', 'Temple Street', 'Lake View Road',
  'Garden Lane', 'Hill Side Avenue', 'River Front Road', 'Sunset Boulevard',
  'Marine Drive', 'Ring Road', 'Cross Road', 'Main Street', 'Market Road',
  'College Road', 'Nehru Nagar', 'Gandhi Road', 'Rajiv Chowk', 'IT Park Road',
  'HSR Layout', 'Koramangala', 'Indiranagar', 'Whitefield', 'Juhu Lane',
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Goa', 'Bhopal',
];

const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

// Product IDs and their base prices (from products.js)
const productPool = [
  { id: 1, name: 'Skyline at Dusk', category: 'framed-posters', subCategory: 'cars', price: 2299, discountPercent: 15 },
  { id: 2, name: 'Porsche 911 Study', category: 'framed-posters', subCategory: 'cars', price: 2699, discountPercent: 0 },
  { id: 3, name: 'Midnight Runner', category: 'framed-posters', subCategory: 'cars', price: 2099, discountPercent: 10 },
  { id: 4, name: 'Lambo & Gold', category: 'framed-posters', subCategory: 'cars', price: 3199, discountPercent: 0 },
  { id: 5, name: 'Neon District', category: 'framed-posters', subCategory: 'anime', price: 2499, discountPercent: 20 },
  { id: 6, name: 'Mecha Blueprint', category: 'framed-posters', subCategory: 'anime', price: 2299, discountPercent: 0 },
  { id: 7, name: 'Spirit Forest', category: 'framed-posters', subCategory: 'anime', price: 2899, discountPercent: 0 },
  { id: 8, name: 'Samurai Moon', category: 'framed-posters', subCategory: 'anime', price: 2399, discountPercent: 5 },
  { id: 9, name: 'Brutalist Summer', category: 'framed-posters', subCategory: 'others', price: 1699, discountPercent: 0 },
  { id: 10, name: 'Coffee & Typography', category: 'framed-posters', subCategory: 'others', price: 1599, discountPercent: 25 },
  { id: 11, name: 'Vintage Travel', category: 'framed-posters', subCategory: 'others', price: 1899, discountPercent: 0 },
  { id: 12, name: 'Cinema Noir', category: 'framed-posters', subCategory: 'others', price: 1999, discountPercent: 0 },
  { id: 13, name: 'Space Oddity', category: 'framed-posters', subCategory: 'others', price: 2099, discountPercent: 10 },
];

const sizeOptions = [
  { id: 'a5', label: 'A5 (6×8")', price: 1499 },
  { id: 'a4', label: 'A4 (8×12")', price: 2299 },
];

const materialOptions = [
  { id: 'black', name: 'Black' },
  { id: 'white', name: 'White' },
  { id: 'silver', name: 'Silver' },
];

const textureOptions = [
  { id: 'matte', name: 'Matte', upcharge: 0 },
  { id: 'glossy', name: 'Glossy', upcharge: 200 },
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateOrders() {
  const rand = seededRandom(42);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

  const orders = [];
  const startDate = new Date('2025-12-01');
  const endDate = new Date('2026-08-25');
  const daySpan = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

  for (let i = 0; i < 50; i++) {
    const dayOffset = Math.floor(rand() * daySpan);
    const orderDate = new Date(startDate);
    orderDate.setDate(orderDate.getDate() + dayOffset);

    // Status distribution: ~68% Delivered, ~10% Processing, ~6% Shipped, ~10% Cancelled, ~6% Returned
    const statusRoll = rand();
    let status;
    if (statusRoll < 0.68) status = 'Delivered';
    else if (statusRoll < 0.78) status = 'Processing';
    else if (statusRoll < 0.84) status = 'Shipped';
    else if (statusRoll < 0.94) status = 'Cancelled';
    else status = 'Returned';

    // 1-3 items per order
    const itemCount = rand() < 0.6 ? 1 : rand() < 0.85 ? 2 : 3;
    const usedProducts = new Set();
    const items = [];

    for (let j = 0; j < itemCount; j++) {
      let product;
      do {
        product = pick(productPool);
      } while (usedProducts.has(product.id));
      usedProducts.add(product.id);

      const size = pick(sizeOptions);
      const material = pick(materialOptions);
      const texture = pick(textureOptions);
      const quantity = rand() < 0.85 ? 1 : 2;

      // Calculate item price: use size price (not product base price), apply discount, add texture
      const basePrice = size.price;
      const discounted = product.discountPercent > 0
        ? Math.round(basePrice * (1 - product.discountPercent / 100))
        : basePrice;
      const itemPrice = discounted + texture.upcharge;

      items.push({
        productId: product.id,
        productName: product.name,
        category: product.category,
        size: size.id,
        sizeLabel: size.label,
        material: material.id,
        materialName: material.name,
        texture: texture.id,
        textureName: texture.name,
        quantity,
        unitPrice: itemPrice,
      });
    }

    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const customerName = `${pick(firstNames)} ${pick(lastNames)}`;
    const street = `${randInt(1, 200)} ${pick(streets)}`;
    const city = pick(cities);
    const pincode = randInt(110001, 999999);

    // Delivery date: 3-7 days after order for delivered/shipped, null for others
    let deliveredDate = null;
    if (status === 'Delivered') {
      const delDays = randInt(3, 7);
      deliveredDate = new Date(orderDate);
      deliveredDate.setDate(deliveredDate.getDate() + delDays);
    }

    orders.push({
      id: `GXG-${String(1000 + i).padStart(4, '0')}`,
      customerName,
      email: `${customerName.split(' ')[0].toLowerCase()}${randInt(1, 99)}@email.com`,
      phone: `+91 ${randInt(70000, 99999)} ${randInt(10000, 99999)}`,
      address: {
        street,
        city,
        state: 'India',
        pincode: String(pincode),
      },
      date: orderDate.toISOString().split('T')[0],
      deliveredDate: deliveredDate ? deliveredDate.toISOString().split('T')[0] : null,
      items,
      total,
      status,
      notes: status === 'Cancelled'
        ? pick(['Customer changed mind', 'Out of stock', 'Duplicate order', 'Address issue'])
        : status === 'Returned'
        ? pick(['Damaged in transit', 'Wrong size', 'Not as expected', 'Quality issue'])
        : '',
    });
  }

  // Sort by date descending
  orders.sort((a, b) => b.date.localeCompare(a.date));
  return orders;
}

export const initialOrders = generateOrders();

export const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

/**
 * Compute analytics from orders array.
 * @param {Array} orders
 * @param {number} costRatio — COGS as fraction of revenue (default 0.42 = 42%)
 */
export function computeAnalytics(orders, costRatio = 0.42) {
  const activeOrders = orders.filter((o) => o.status !== 'Cancelled' && o.status !== 'Returned');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const returnedOrders = orders.filter((o) => o.status === 'Returned');
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');

  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalCost = Math.round(totalRevenue * costRatio);
  const profit = totalRevenue - totalCost;
  const lossFromReturns = returnedOrders.reduce((sum, o) => sum + o.total, 0);
  const lossFromCancellations = cancelledOrders.reduce((sum, o) => sum + o.total, 0);
  const totalLoss = lossFromReturns + lossFromCancellations;

  // Monthly breakdown
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyMap = {};

  orders.forEach((o) => {
    const d = new Date(o.date);
    const key = monthNames[d.getMonth()];
    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: key, revenue: 0, orders: 0, returns: 0, cancellations: 0, profit: 0 };
    }
    monthlyMap[key].orders += 1;
    if (o.status === 'Returned') {
      monthlyMap[key].returns += 1;
    } else if (o.status === 'Cancelled') {
      monthlyMap[key].cancellations += 1;
    } else {
      monthlyMap[key].revenue += o.total;
      monthlyMap[key].profit += Math.round(o.total * (1 - costRatio));
    }
  });

  // Order month chronologically based on which months actually have orders
  const monthsWithOrders = Object.keys(monthlyMap);
  const monthOrder = monthNames.filter((m) => monthsWithOrders.includes(m));
  const monthlySalesData = monthOrder.map((m) => monthlyMap[m]);

  // Category breakdown
  const categoryMap = {};
  activeOrders.forEach((o) => {
    o.items.forEach((item) => {
      const cat = item.category;
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat] += item.unitPrice * item.quantity;
    });
  });

  const categoryColors = { 'framed-posters': '#C23B22', posters: '#2D6A4F' };
  const categorySalesData = Object.entries(categoryMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Math.round(value),
    fill: categoryColors[name] || '#999',
  }));

  // Top products
  const productUnits = {};
  activeOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productUnits[item.productName]) {
        productUnits[item.productName] = { name: item.productName, units: 0, revenue: 0 };
      }
      productUnits[item.productName].units += item.quantity;
      productUnits[item.productName].revenue += item.unitPrice * item.quantity;
    });
  });

  const topProducts = Object.values(productUnits)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((p) => ({ ...p, revenue: Math.round(p.revenue) }));

  return {
    totalRevenue,
    totalCost,
    profit,
    totalOrders: orders.length,
    activeOrders: activeOrders.length,
    deliveredCount: deliveredOrders.length,
    returnedCount: returnedOrders.length,
    cancelledCount: cancelledOrders.length,
    returnRate: orders.length > 0 ? ((returnedOrders.length / orders.length) * 100).toFixed(1) : '0',
    cancelRate: orders.length > 0 ? ((cancelledOrders.length / orders.length) * 100).toFixed(1) : '0',
    lossFromReturns,
    lossFromCancellations,
    totalLoss,
    monthlySalesData,
    categorySalesData,
    topProducts,
  };
}
