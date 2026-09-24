import fs from 'fs';
import https from 'https';

function checkUrl(url) {
  return new Promise(resolve => {
    try {
      const u = new URL(url);
      https.get({
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http') ? res.headers.location : `https://${u.hostname}${res.headers.location}`;
          checkUrl(loc).then(resolve);
        } else {
          resolve(res.statusCode === 200);
        }
      }).on('error', () => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

const menu = JSON.parse(fs.readFileSync('./data/menu.json', 'utf-8'));
const pool = JSON.parse(fs.readFileSync('./verified_candidates.json', 'utf-8'));

console.log(`Original menu count: ${menu.length}`);
console.log(`Pool size: ${pool.length}`);

// Find duplicate items
const seenBases = new Map(); // base -> first item
const duplicates = [];

menu.forEach((item, index) => {
  const base = item.image.split('?')[0];
  if (!seenBases.has(base)) {
    seenBases.set(base, item);
  } else {
    duplicates.push({ index, item, originalBase: base });
  }
});

console.log(`Unique bases before fix: ${seenBases.size}`);
console.log(`Items needing new image: ${duplicates.length}`);

// We need to pick an unused image from pool for each duplicate
const usedBases = new Set([...seenBases.keys()]);
const availablePool = pool.filter(url => !usedBases.has(url.split('?')[0]));

console.log(`Available pool images: ${availablePool.length}`);

// Score matching helper
function scoreMatch(dishName, category, url) {
  const text = (dishName + ' ' + category).toLowerCase();
  const u = url.toLowerCase();
  let score = 0;

  if (text.includes('karahi') && (u.includes('karahi') || u.includes('kadai'))) score += 50;
  if (text.includes('handi') && (u.includes('handi') || u.includes('curry'))) score += 50;
  if (text.includes('paneer') && u.includes('paneer')) score += 60;
  if (text.includes('daal') || text.includes('dal')) {
    if (u.includes('dal') || u.includes('chana') || u.includes('makhani')) score += 60;
  }
  if (text.includes('kabab') || text.includes('kebab')) {
    if (u.includes('kabab') || u.includes('kebab')) score += 50;
  }
  if (text.includes('tikka') && u.includes('tikka')) score += 50;
  if (text.includes('boti') && (u.includes('tikka') || u.includes('boti') || u.includes('skewer'))) score += 40;
  if (text.includes('roll') && (u.includes('roll') || u.includes('kathi') || u.includes('wrap'))) score += 60;
  if (text.includes('broast') && (u.includes('fried') || u.includes('chicken') || u.includes('drumstick'))) score += 50;
  if (text.includes('burger') && (u.includes('burger') || u.includes('cheeseburger'))) score += 60;
  if (text.includes('sandwich') && (u.includes('sandwich') || u.includes('sub'))) score += 60;
  if (text.includes('naan') && (u.includes('naan') || u.includes('roti') || u.includes('bread'))) score += 60;
  if (text.includes('ice cream') || text.includes('falooda') || text.includes('kulfa') || text.includes('pista')) {
    if (u.includes('kulfi') || u.includes('ice') || u.includes('cream') || u.includes('falooda') || u.includes('dessert')) score += 60;
  }
  if (text.includes('raita') && u.includes('raita')) score += 70;
  if (text.includes('salad') && (u.includes('salad') || u.includes('green'))) score += 60;
  if (text.includes('cheese') && u.includes('cheese')) score += 30;

  return score;
}

// Assign to duplicates
const remainingPool = [...availablePool];

duplicates.forEach(({ index, item }) => {
  // Sort pool by score for this item
  remainingPool.sort((a, b) => {
    return scoreMatch(item.name, item.category, b) - scoreMatch(item.name, item.category, a);
  });

  const bestUrl = remainingPool.shift();
  if (!bestUrl) {
    throw new Error('Not enough unique images in pool!');
  }

  const base = bestUrl.split('?')[0];
  usedBases.add(base);
  menu[index].image = bestUrl;
});

// Final verification of menu
const finalBases = new Set(menu.map(i => i.image.split('?')[0]));
console.log(`Final total menu items: ${menu.length}`);
console.log(`Final unique base images: ${finalBases.size}`);

if (finalBases.size !== menu.length) {
  console.error('ERROR: Still have duplicate bases!');
  process.exit(1);
}

fs.writeFileSync('new_menu_137_unique.json', JSON.stringify(menu, null, 2));
console.log('SUCCESS: Generated new_menu_137_unique.json with 137 100% UNIQUE images!');
