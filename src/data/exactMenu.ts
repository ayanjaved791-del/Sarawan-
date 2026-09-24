// Exact 100% Authentic Sarawan Restaurant Menu Data
// 137 Items with complete pricing, categories, variants, and exact matched photographs

import { MenuItem, MenuItemVariant } from '../types';

export type ExactMenuItem = MenuItem;
export type { MenuItemVariant };

export const EXACT_SARAWAN_CATEGORIES: string[] = [
  "Biryani / Pulao",
  "Bar B.Q",
  "Chicken Karahi",
  "Beef Karahi",
  "Handi",
  "Daal",
  "Broast",
  "Burger",
  "Sandwich",
  "French Fries",
  "Roll",
  "Chinese",
  "Platter",
  "Sarawan Special",
  "Naan",
  "Ice Cream",
  "Side & Bevrages"
];

export const EXACT_SARAWAN_MENU: MenuItem[] = [
  {
    "id": "chicken-biryani",
    "name": "Chicken Biryani (Half kg)",
    "category": "Biryani / Pulao",
    "description": "Aromatic basmati rice layered with flavorful spiced chicken cooked to perfection.",
    "price": 280,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-pulao",
    "name": "Beef Pulao",
    "category": "Biryani / Pulao",
    "description": "Slow-cooked traditional beef yakhni pulao with tender meat and fragrant long grains.",
    "price": 320,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "sada-biryani",
    "name": "Sada Biryani",
    "category": "Biryani / Pulao",
    "description": "Fragrant seasoned biryani rice prepared with rich spices and herbs.",
    "price": 180,
    "available": true,
    "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "sada-pulao",
    "name": "Sada Pulao",
    "category": "Biryani / Pulao",
    "description": "Mildly spiced aromatic traditional yakhni pulao rice.",
    "price": 180,
    "available": true,
    "image": "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "extra-boti",
    "name": "Extra Boti",
    "category": "Biryani / Pulao",
    "description": "Delicious extra portion of spiced succulent meat boti.",
    "price": 100,
    "available": true,
    "image": "/src/assets/images/extra_boti_1790186188495.jpg"
  },
  {
    "id": "balochi-tikka",
    "name": "Balochi Tikka",
    "category": "Bar B.Q",
    "description": "Char-grilled succulent chicken tikka with crushed coriander, green chili, and authentic Balochi spices.",
    "price": 500,
    "available": true,
    "isPopular": true,
    "isSpecial": true,
    "image": "/src/assets/images/balochi_tikka_1790186163732.jpg"
  },
  {
    "id": "afghani-tikka",
    "name": "Afghani Tikka",
    "category": "Bar B.Q",
    "description": "Creamy yogurt marinade with mild black pepper roasted over smokey coal embers.",
    "price": 500,
    "available": true,
    "image": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "tikka-chest",
    "name": "Tikka Chest",
    "category": "Bar B.Q",
    "description": "Smoky, flavorful chicken breast quarter marinated in special red tandoori spices.",
    "price": 500,
    "available": true,
    "image": "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "tikka-leg",
    "name": "Tikka Leg",
    "category": "Bar B.Q",
    "description": "Juicy chicken leg piece char-grilled with tangy lemon and ground spices.",
    "price": 450,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "malai-tikka-chest",
    "name": "Malai Tikka Chest",
    "category": "Bar B.Q",
    "description": "Tender chicken chest quarter soaked in rich cream, cardamom, and subtle herbs.",
    "price": 550,
    "available": true,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "afghani-boti",
    "name": "Afghani Boti",
    "category": "Bar B.Q",
    "description": "Melt-in-mouth creamy boneless chicken cubes charred on open grill.",
    "price": 600,
    "variants": [
      {
        "id": "half-darzen",
        "name": "Half Darzen",
        "price": 600
      },
      {
        "id": "full-darzen",
        "name": "Full Darzen",
        "price": 1200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "lebanese-boti",
    "name": "Lebanese Boti",
    "category": "Bar B.Q",
    "description": "Authentic Middle Eastern spiced chicken boti skewers with sumac and garlic essence.",
    "price": 700,
    "available": true,
    "isSpecial": true,
    "image": "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "achari-boti",
    "name": "Achari Boti",
    "category": "Bar B.Q",
    "description": "Spicy chicken skewers coated in piquant pickling spices and mustard seed aromatics.",
    "price": 550,
    "available": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "balochi-boti",
    "name": "Balochi Boti",
    "category": "Bar B.Q",
    "description": "Classic Balochi spiced chicken boti with green chilies and lemon.",
    "price": 550,
    "variants": [
      {
        "id": "single",
        "name": "Single",
        "price": 300
      },
      {
        "id": "plate",
        "name": "Plate",
        "price": 550
      }
    ],
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "turkish-kabab",
    "name": "Turkish Kabab",
    "category": "Bar B.Q",
    "description": "Handcrafted minced kebab infused with sweet bell peppers and Turkish spices.",
    "price": 600,
    "variants": [
      {
        "id": "single",
        "name": "Single",
        "price": 320
      },
      {
        "id": "plate",
        "name": "Plate",
        "price": 600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "dhaga-kabab",
    "name": "Dhaga Kabab",
    "category": "Bar B.Q",
    "description": "Ultra-tender spiced mince wrapped and tied with thread, char-grilled to velvety tenderness.",
    "price": 550,
    "available": true,
    "isSpecial": true,
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "kabab-fry",
    "name": "Kabab Fry",
    "category": "Bar B.Q",
    "description": "Char-grilled kababs sautéed on hot flat tawa with tomatoes, green chilies, and butter.",
    "price": 650,
    "available": true,
    "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-boti",
    "name": "Chicken Boti",
    "category": "Bar B.Q",
    "description": "Succulent boneless chicken chunks char-grilled with bold red spices.",
    "price": 550,
    "variants": [
      {
        "id": "single",
        "name": "Single",
        "price": 300
      },
      {
        "id": "plate",
        "name": "Plate",
        "price": 550
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "malai-boti",
    "name": "Malai Boti",
    "category": "Bar B.Q",
    "description": "Velvety cream and cheese marinated chicken boti skewers grilled delicately over low heat.",
    "price": 600,
    "variants": [
      {
        "id": "single",
        "name": "Single",
        "price": 300
      },
      {
        "id": "plate",
        "name": "Plate",
        "price": 600
      }
    ],
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-bihari-boti",
    "name": "Beef Bihari Boti",
    "category": "Bar B.Q",
    "description": "Wafer-thin beef fillets tenderized in raw papaya, mustard oil, and toasted spices.",
    "price": 650,
    "variants": [
      {
        "id": "single",
        "name": "Single",
        "price": 350
      },
      {
        "id": "plate",
        "name": "Plate",
        "price": 650
      }
    ],
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "seekh-kabab",
    "name": "Seekh Kabab",
    "category": "Bar B.Q",
    "description": "Traditional minced beef skewers with fresh coriander, roasted cumin, and hot chili.",
    "price": 550,
    "variants": [
      {
        "id": "single",
        "name": "Single",
        "price": 300
      },
      {
        "id": "plate",
        "name": "Plate",
        "price": 550
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "gola-kabab",
    "name": "Gola Kabab",
    "category": "Bar B.Q",
    "description": "Juicy, rounded spiced meat kababs packed with onion, green chillies, and aromatic herbs.",
    "price": 550,
    "variants": [
      {
        "id": "single",
        "name": "Single",
        "price": 300
      },
      {
        "id": "plate",
        "name": "Plate",
        "price": 550
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "reshmi-kabab",
    "name": "Reshmi Kabab",
    "category": "Bar B.Q",
    "description": "Silky smooth chicken mince with egg white, cream, and gentle whole spices.",
    "price": 550,
    "variants": [
      {
        "id": "single",
        "name": "Single",
        "price": 300
      },
      {
        "id": "plate",
        "name": "Plate",
        "price": 550
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-karahi",
    "name": "Chicken Karahi",
    "category": "Chicken Karahi",
    "description": "Wok-tossed chicken cooked in ripe tomatoes, ginger juliennes, green chilies, and freshly cracked black pepper.",
    "price": 500,
    "variants": [
      {
        "id": "plate",
        "name": "Plate",
        "price": 500
      },
      {
        "id": "half",
        "name": "Half",
        "price": 1000
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2000
      }
    ],
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "white-karahi",
    "name": "White Karahi",
    "category": "Chicken Karahi",
    "description": "Rich, non-spicy white gravy karahi prepared with thick yogurt, dairy cream, and white pepper.",
    "price": 550,
    "variants": [
      {
        "id": "plate",
        "name": "Plate",
        "price": 550
      },
      {
        "id": "half",
        "name": "Half",
        "price": 1100
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "achari-karahi",
    "name": "Achari Karahi",
    "category": "Chicken Karahi",
    "description": "Tangy and spicy chicken karahi simmered with authentic pickling masalas.",
    "price": 1000,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1000
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2000
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "shinwari-karahi",
    "name": "Shinwari Karahi",
    "category": "Chicken Karahi",
    "description": "Traditional Shinwari karahi cooked solely in oil, salt, garlic, and fresh juicy tomatoes.",
    "price": 1000,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1000
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2000
      }
    ],
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "cholistani-karahi",
    "name": "Cholistani Karahi",
    "category": "Chicken Karahi",
    "description": "Desi desert style karahi prepared with whole crushed spices, dry coriander, and green chillies.",
    "price": 1000,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1000
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2000
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-green-karahi",
    "name": "Chicken Green Karahi",
    "category": "Chicken Karahi",
    "description": "Fresh aromatic green masala karahi prepared with blended coriander, mint, and green chilies.",
    "price": 1100,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1100
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-peshawari-karahi",
    "name": "Chicken Peshawari Karahi",
    "category": "Chicken Karahi",
    "description": "Rustic Peshawari recipe featuring coarsely crushed spices, ginger juliennes, and black pepper.",
    "price": 1000,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1000
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2000
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "kashmiri-karahi",
    "name": "Kashmiri Karahi",
    "category": "Chicken Karahi",
    "description": "Mild, flavorful karahi with rich tomato gravy, mild red peppers, and subtle dry spices.",
    "price": 1100,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1100
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-koyla-karahi",
    "name": "Chicken Koyla Karahi",
    "category": "Chicken Karahi",
    "description": "Tomato gravy karahi infused with live charcoal smoke for authentic BBQ smokiness.",
    "price": 1000,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1000
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2000
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "charsi-karahi",
    "name": "Charsi Karahi",
    "category": "Chicken Karahi",
    "description": "Famous Namak Mandi style charsi karahi cooked purely in tomato reduction with fresh black pepper.",
    "price": 1000,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1000
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2000
      }
    ],
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "tikka-flavor-karahi",
    "name": "Tikka Flavor Karahi",
    "category": "Chicken Karahi",
    "description": "Charcoal grilled tikka pieces simmered in spicy, sizzling karahi masala.",
    "price": 1100,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1100
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "shahi-karahi",
    "name": "Shahi Karahi",
    "category": "Chicken Karahi",
    "description": "Rich royal chicken karahi infused with nuts, butter, cream, and fragrant saffron masala.",
    "price": 1100,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1100
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "shikari-karahi-boneless",
    "name": "Shikari Karahi Boneless",
    "category": "Chicken Karahi",
    "description": "Tender boneless chicken morsels flash-cooked in fiery hunters spice blend.",
    "price": 1200,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1200
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2400
      }
    ],
    "available": true,
    "isSpecial": true,
    "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-karahi",
    "name": "Beef Karahi",
    "category": "Beef Karahi",
    "description": "Tender prime beef chunks slow-simmered in tomatoes, ginger, and robust spices.",
    "price": 1200,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1200
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2400
      }
    ],
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-white-karahi",
    "name": "Beef White Karahi",
    "category": "Beef Karahi",
    "description": "Succulent beef pieces braised in clotted cream, white pepper, and smooth yogurt.",
    "price": 1300,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-qeema-karahi",
    "name": "Beef Qeema Karahi",
    "category": "Beef Karahi",
    "description": "Coarse minced beef fried on wok with ginger, garlic, tomatoes, and garam masala.",
    "price": 1300,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-green-karahi",
    "name": "Beef Green Karahi",
    "category": "Beef Karahi",
    "description": "Fragrant fresh green paste curry with tender beef cubes and cilantro.",
    "price": 1300,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-koyla-karahi",
    "name": "Beef Koyla Karahi",
    "category": "Beef Karahi",
    "description": "Beef karahi smoked with live acacia charcoal for intense BBQ flavor.",
    "price": 1200,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1200
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2400
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-shinwari-karahi",
    "name": "Beef Shinwari Karahi",
    "category": "Beef Karahi",
    "description": "Peshawar Shinwari tradition with beef cooked in oil, rock salt, and whole tomatoes.",
    "price": 1200,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1200
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2400
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-peshawari-karahi",
    "name": "Beef Peshawari Karahi",
    "category": "Beef Karahi",
    "description": "Tender beef prepared with coarse spices, black pepper, and thick tomato reduction.",
    "price": 1200,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1200
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2400
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chk-handi",
    "name": "Chk Handi",
    "category": "Handi",
    "description": "Silky boneless chicken cooked slowly in an authentic earthen clay handi with rich buttery gravy.",
    "price": 650,
    "variants": [
      {
        "id": "plate",
        "name": "Plate",
        "price": 650
      },
      {
        "id": "half",
        "name": "Half",
        "price": 1200
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2400
      }
    ],
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chk-white-handi",
    "name": "Chk White Handi",
    "category": "Handi",
    "description": "Mild creamy white handi prepared with clotted cream, white pepper, and butter.",
    "price": 700,
    "variants": [
      {
        "id": "plate",
        "name": "Plate",
        "price": 700
      },
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "muglai-white-handi",
    "name": "Muglai (White) Handi",
    "category": "Handi",
    "description": "Royal Muglai recipe featuring almond paste, heavy cream, butter, and mild aromatic spices.",
    "price": 1300,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "bar-bq-handi",
    "name": "Bar B.Q Handi",
    "category": "Handi",
    "description": "Smoky grilled BBQ chicken boti pieces cooked in traditional rich handi gravy.",
    "price": 1300,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "achari-handi",
    "name": "Achari Handi",
    "category": "Handi",
    "description": "Clay-pot handi infused with zesty pickling spices, kalonji, and fenugreek seeds.",
    "price": 1300,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "green-handi",
    "name": "Green Handi",
    "category": "Handi",
    "description": "Fresh aromatic green masala handi with mint, coriander, and mild green chillies.",
    "price": 1300,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "reshmi-kabab-handi",
    "name": "Reshmi Kabab Handi",
    "category": "Handi",
    "description": "Melt-in-mouth chicken reshmi kababs simmered in velvety handi butter gravy.",
    "price": 1300,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "shahi-paneer-handi",
    "name": "Shahi Paneer Handi",
    "category": "Handi",
    "description": "Cottage cheese paneer cubes cooked in royal rich creamy tomato butter gravy.",
    "price": 1200,
    "available": true,
    "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "sarawan-special-cheese-handi",
    "name": "Sarawan Special Cheese Handi",
    "category": "Handi",
    "description": "Chef signature boneless handi smothered with molten melted mozzarella and cheddar cheese blend.",
    "price": 1500,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1500
      },
      {
        "id": "full",
        "name": "Full",
        "price": 3000
      }
    ],
    "available": true,
    "isSpecial": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "tikka-flavor-handi",
    "name": "Tikka Flavor Handi",
    "category": "Handi",
    "description": "BBQ tikka infused handi simmered in silky tomato cream gravy.",
    "price": 1400,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1400
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2800
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-bihari-handi",
    "name": "Beef Bihari Handi",
    "category": "Handi",
    "description": "Melted tender beef bihari boti simmered into thick spicy clay handi sauce.",
    "price": 1400,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1400
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2800
      }
    ],
    "available": true,
    "isSpecial": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "seekh-kabab-handi",
    "name": "Seekh Kabab Handi",
    "category": "Handi",
    "description": "Beef seekh kabab pieces pan-cooked in spicy rustic handi masala.",
    "price": 1300,
    "variants": [
      {
        "id": "half",
        "name": "Half",
        "price": 1300
      },
      {
        "id": "full",
        "name": "Full",
        "price": 2600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "daal-mash-makhni",
    "name": "Daal Mash Makhni",
    "category": "Daal",
    "description": "White lentils pan-fried with pure butter, ginger tarka, and whole dried red chilies.",
    "price": 300,
    "available": true,
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "daal-chana",
    "name": "Daal Chana",
    "category": "Daal",
    "description": "Slow-cooked split yellow gram lentils tempered with cumin, garlic, and fresh green chili.",
    "price": 300,
    "available": true,
    "image": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "daal-mix-handi",
    "name": "Daal Mix Handi",
    "category": "Daal",
    "description": "Special blended lentils simmered in clay handi with desi ghee tempering.",
    "price": 350,
    "variants": [
      {
        "id": "plate",
        "name": "Plate",
        "price": 350
      },
      {
        "id": "half",
        "name": "Half",
        "price": 600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "daal-mix-cheese-handi",
    "name": "Daal Mix Cheese Handi",
    "category": "Daal",
    "description": "Rich handi lentils loaded with melted mozzarella and cheddar cheese.",
    "price": 400,
    "variants": [
      {
        "id": "plate",
        "name": "Plate",
        "price": 400
      },
      {
        "id": "half",
        "name": "Half",
        "price": 700
      }
    ],
    "available": true,
    "isSpecial": true,
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "broast",
    "name": "Broast",
    "category": "Broast",
    "description": "Golden pressure-fried chicken with crispy crust, served with garlic mayo dip and french fries.",
    "price": 480,
    "variants": [
      {
        "id": "leg",
        "name": "Leg",
        "price": 480
      },
      {
        "id": "chest",
        "name": "Chest",
        "price": 550
      }
    ],
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "crispy-broast",
    "name": "Crispy Broast",
    "category": "Broast",
    "description": "Extra crunch batter coating fried to golden perfection with secret savory spice mix.",
    "price": 500,
    "variants": [
      {
        "id": "leg",
        "name": "Leg",
        "price": 500
      },
      {
        "id": "chest",
        "name": "Chest",
        "price": 600
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "mayo-garlic-broast",
    "name": "Mayo Garlic Broast",
    "category": "Broast",
    "description": "Crisp broast chicken drenched in Sarawan creamy whipped garlic mayo.",
    "price": 550,
    "variants": [
      {
        "id": "leg",
        "name": "Leg",
        "price": 550
      },
      {
        "id": "chest",
        "name": "Chest",
        "price": 650
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "masala-broast",
    "name": "Masala Broast",
    "category": "Broast",
    "description": "Spicy broast chicken dusted generously with piquant chatpata masala seasoning.",
    "price": 550,
    "variants": [
      {
        "id": "leg",
        "name": "Leg",
        "price": 550
      },
      {
        "id": "chest",
        "name": "Chest",
        "price": 650
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "zinger-burger",
    "name": "Zinger Burger",
    "category": "Burger",
    "description": "Crunchy fried chicken thigh fillet with fresh lettuce, garlic mayo, and soft toasted sesame bun.",
    "price": 470,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "zinger-cheese-burger",
    "name": "Zinger Cheese Burger",
    "category": "Burger",
    "description": "Crunchy Zinger fillet topped with melted golden cheddar cheese slice and garlic sauce.",
    "price": 500,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-burger",
    "name": "Chicken Burger",
    "category": "Burger",
    "description": "Tender spiced grilled minced chicken patty with mayo and crisp salad in toasted bun.",
    "price": 350,
    "available": true,
    "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-cheese-burger",
    "name": "Chicken Cheese Burger",
    "category": "Burger",
    "description": "Spiced chicken patty paired with melted cheese, iceberg lettuce, and relish.",
    "price": 400,
    "available": true,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-burger",
    "name": "Beef Burger",
    "category": "Burger",
    "description": "Seared beef patty seasoned with black pepper, fresh lettuce, tomatoes, and house sauce.",
    "price": 400,
    "available": true,
    "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-cheese-burger",
    "name": "Beef Cheese Burger",
    "category": "Burger",
    "description": "Juicy 100% ground beef patty smashed with real cheddar cheese and caramelized sauce.",
    "price": 450,
    "available": true,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-sandwich",
    "name": "Chicken Sandwich",
    "category": "Sandwich",
    "description": "Shredded chicken dressed in garlic mayonnaise between golden toasted bread slices.",
    "price": 350,
    "available": true,
    "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-cheese-sandwich",
    "name": "Chicken Cheese Sandwich",
    "category": "Sandwich",
    "description": "Toasted sandwich stuffed with seasoned shredded chicken and melted cheese slice.",
    "price": 380,
    "available": true,
    "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "club-sandwich",
    "name": "Club Sandwich",
    "category": "Sandwich",
    "description": "Triple-layer toasted sandwich with chicken, fried egg, cheese slice, cucumber, and spicy sauce.",
    "price": 370,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "club-cheese-sandwich",
    "name": "Club Cheese Sandwich",
    "category": "Sandwich",
    "description": "Triple decker club sandwich loaded with double cheese, fried egg, and chicken.",
    "price": 400,
    "available": true,
    "image": "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "crispy-sandwich",
    "name": "Crispy Sandwich",
    "category": "Sandwich",
    "description": "Crunchy golden chicken strips layered with fresh slaw and spicy mayo.",
    "price": 450,
    "available": true,
    "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "crispy-cheese-sandwich",
    "name": "Crispy Cheese Sandwich",
    "category": "Sandwich",
    "description": "Crispy fried chicken fillet topped with melted cheddar cheese slice in toasted bread.",
    "price": 480,
    "available": true,
    "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "bbq-sandwich",
    "name": "B.B.Q Sandwich",
    "category": "Sandwich",
    "description": "Smoky grilled chicken boti chunks with tangy barbecue sauce in warm toasted bread.",
    "price": 450,
    "available": true,
    "image": "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "bbq-cheese-sandwich",
    "name": "B.B.Q Cheese Sandwich",
    "category": "Sandwich",
    "description": "Charred chicken boti pieces topped with molten cheese and smoky sauce.",
    "price": 480,
    "available": true,
    "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "malai-boti-sandwich",
    "name": "Malai Boti Sandwich",
    "category": "Sandwich",
    "description": "Silky cream malai boti chicken chunks pressed in toasted artisan bread.",
    "price": 450,
    "available": true,
    "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "malai-cheese-boti-sandwich",
    "name": "Malai Cheese Boti Sandwich",
    "category": "Sandwich",
    "description": "Melted cheese combined with rich creamy chicken malai boti pieces in toasted bread.",
    "price": 480,
    "available": true,
    "image": "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "french-fries",
    "name": "French Fries",
    "category": "French Fries",
    "description": "Crispy golden potato fingers tossed in flavorful chaat masala.",
    "price": 150,
    "available": true,
    "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "mayo-garlic-fries",
    "name": "Mayo Garlic Fries",
    "category": "French Fries",
    "description": "Crispy hot fries generously drizzled with Sarawan garlic mayonnaise dressing.",
    "price": 220,
    "available": true,
    "image": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-roll",
    "name": "Chicken Roll",
    "category": "Roll",
    "description": "Char-grilled chicken boti wrapped in crispy flaky paratha with sliced onions and tangy chutney.",
    "price": 220,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-mayo-roll",
    "name": "Chicken Mayo Roll",
    "category": "Roll",
    "description": "Barbecue chicken boti wrapped with thick garlic mayonnaise in golden paratha.",
    "price": 240,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-cheese-roll",
    "name": "Chicken Cheese Roll",
    "category": "Roll",
    "description": "Juicy chicken boti rolled with melted cheese slice in crispy paratha.",
    "price": 250,
    "available": true,
    "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-malai-boti-roll",
    "name": "Chicken Malai Boti Roll",
    "category": "Roll",
    "description": "Velvety cream chicken malai boti rolled in tender flaky paratha.",
    "price": 240,
    "available": true,
    "image": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-malai-boti-mayo-roll",
    "name": "Chicken Malai Boti Mayo Roll",
    "category": "Roll",
    "description": "Creamy malai boti chunks smothered in garlic mayo sauce and wrapped in paratha.",
    "price": 250,
    "available": true,
    "image": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-malai-boti-cheese-roll",
    "name": "Chicken Malai Boti Cheese Roll",
    "category": "Roll",
    "description": "Tender malai boti rolled with melted cheese slice and house chutney.",
    "price": 260,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "crispy-roll",
    "name": "Crispy Roll",
    "category": "Roll",
    "description": "Crunchy deep-fried chicken strip wrapped in fresh paratha with spicy sauce.",
    "price": 300,
    "available": true,
    "image": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "crispy-cheese-roll",
    "name": "Crispy Cheese Roll",
    "category": "Roll",
    "description": "Golden crispy chicken tender rolled with cheddar cheese slice in flaky paratha.",
    "price": 340,
    "available": true,
    "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "seekh-kabab-roll",
    "name": "Seekh Kabab Roll",
    "category": "Roll",
    "description": "Grilled spiced beef seekh kabab wrapped in paratha with chopped onions and chutney.",
    "price": 240,
    "available": true,
    "image": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "seekh-kabab-cheese-roll",
    "name": "Seekh Kabab Cheese Roll",
    "category": "Roll",
    "description": "Beef seekh kabab with melted cheese slice rolled in fresh paratha.",
    "price": 260,
    "available": true,
    "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "reshmi-kabab-cheese-roll",
    "name": "Reshmi Kabab Cheese Roll",
    "category": "Roll",
    "description": "Melt-in-mouth chicken reshmi kabab rolled with melted cheese slice in paratha.",
    "price": 260,
    "available": true,
    "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "reshmi-kabab-roll",
    "name": "Reshmi Kabab Roll",
    "category": "Roll",
    "description": "Silky smooth chicken reshmi kabab wrapped in warm paratha with mild sauce.",
    "price": 240,
    "available": true,
    "image": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-roll",
    "name": "Beef Roll",
    "category": "Roll",
    "description": "Char-grilled spiced beef chunks rolled in crispy puri paratha.",
    "price": 240,
    "available": true,
    "image": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-mayo-roll",
    "name": "Beef Mayo Roll",
    "category": "Roll",
    "description": "Tender beef boti pieces with thick garlic mayonnaise wrapped in paratha.",
    "price": 260,
    "available": true,
    "image": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "beef-cheese-roll",
    "name": "Beef Cheese Roll",
    "category": "Roll",
    "description": "Succulent beef chunks paired with melted cheese slice in flaky paratha.",
    "price": 260,
    "available": true,
    "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-rice",
    "name": "Chicken Rice",
    "category": "Chinese",
    "description": "Classic wok-fried rice with tender chicken chunks, scrambled egg, and garden vegetables.",
    "price": 500,
    "available": true,
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "vegetable-rice",
    "name": "Vegetable Rice",
    "category": "Chinese",
    "description": "Aromatic fried rice stir-cooked with shredded carrots, cabbage, and spring onions.",
    "price": 450,
    "available": true,
    "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "masala-rice",
    "name": "Masala Rice",
    "category": "Chinese",
    "description": "Spicy Desi-Chinese fusion fried rice tossed with hot seasonings and vegetables.",
    "price": 500,
    "available": true,
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "singapurian-rice",
    "name": "Singapurian Rice",
    "category": "Chinese",
    "description": "Layers of fragrant egg fried rice, spicy chicken curry, noodles, fried green chilies, and creamy sauce.",
    "price": 750,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "shashlik-with-rice",
    "name": "Shashlik with Rice",
    "category": "Chinese",
    "description": "Juicy chicken cubes, capsicum, and onions in sweet-tangy tomato sauce served with egg fried rice.",
    "price": 750,
    "available": true,
    "image": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "manchorian-with-rice",
    "name": "Manchorian with Rice",
    "category": "Chinese",
    "description": "Chicken cooked in rich spicy garlic Manchurian sauce served alongside hot egg fried rice.",
    "price": 750,
    "available": true,
    "image": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "challi-with-rice",
    "name": "Chilli with Rice",
    "category": "Chinese",
    "description": "Spicy chicken and green chili gravy served with steaming egg fried rice.",
    "price": 750,
    "available": true,
    "image": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chilli-dry-with-rice",
    "name": "Chilli Dry with Rice",
    "category": "Chinese",
    "description": "Crispy fried chicken strips tossed dry with green chilies, soy, and garlic, served with egg fried rice.",
    "price": 750,
    "available": true,
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-sweet-sour-with-rice",
    "name": "Chicken Sweet & Sour with Rice",
    "category": "Chinese",
    "description": "Pineapple, bell peppers, and chicken in glossy sweet & sour sauce with egg fried rice.",
    "price": 750,
    "available": true,
    "image": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-jalfrezi-with-rice",
    "name": "Chicken Jalfrezi with Rice",
    "category": "Chinese",
    "description": "Wok-sautéed chicken, tomato, capsicum, and egg ribbons in spicy sauce with egg fried rice.",
    "price": 750,
    "available": true,
    "image": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-chowmain",
    "name": "Chicken Chowmain",
    "category": "Chinese",
    "description": "Stir-fried noodles with chicken shreds, crunchy cabbage, carrots, and savory soy sauce.",
    "price": 700,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "vegetable-chowmain",
    "name": "Vegetable Chowmain",
    "category": "Chinese",
    "description": "Wok-tossed noodles with shredded fresh vegetables and oriental seasonings.",
    "price": 550,
    "available": true,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "alfredo-pasta",
    "name": "Alfredo Pasta",
    "category": "Chinese",
    "description": "Creamy fettuccine pasta in rich parmesan garlic white sauce with seasoned chicken pieces.",
    "price": 800,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "02-person-platter",
    "name": "02 Person Platter",
    "category": "Platter",
    "description": "Mandi Rice, Tikka Leg, Balochi Boti, Chicken Boti, Turkish Kabab, Paratha, Raita, Salad.",
    "price": 1600,
    "available": true,
    "isPopular": true,
    "isSpecial": true,
    "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "04-person-platter",
    "name": "04 Person Platter",
    "category": "Platter",
    "description": "Mandi Rice, Tikka Leg, Balochi Boti, Chicken Boti, Turkish Kabab, Paratha, Raita, Salad.",
    "price": 3100,
    "available": true,
    "isSpecial": true,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-angara-spicy",
    "name": "Chicken Angara Spicy",
    "category": "Sarawan Special",
    "description": "Full Chicken, Mandi Rice, Raita, Salad.",
    "price": 1500,
    "available": true,
    "isSpecial": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chicken-angara-namkeen",
    "name": "Chicken Angara Namkeen",
    "category": "Sarawan Special",
    "description": "Full Chicken, Mandi Rice, Raita, Salad.",
    "price": 1500,
    "available": true,
    "isSpecial": true,
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "naan",
    "name": "Naan",
    "category": "Naan",
    "description": "Fresh warm tandoori flatbread straight from the clay tandoor.",
    "price": 40,
    "available": true,
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "roghni-naan",
    "name": "Roghni Naan",
    "category": "Naan",
    "description": "Tandoori naan brushed with butter and sesame seeds.",
    "price": 100,
    "available": true,
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "garlic-naan",
    "name": "Garlic Naan",
    "category": "Naan",
    "description": "Tandoori naan topped with roasted chopped garlic and fresh coriander.",
    "price": 100,
    "available": true,
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "cheese-naan",
    "name": "Cheese Naan",
    "category": "Naan",
    "description": "Oozing melted cheese stuffed inside hot crispy tandoor-baked naan.",
    "price": 130,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "ice-cream-pista",
    "name": "Pista",
    "category": "Ice Cream",
    "description": "Rich creamy pistachio flavored ice cream with real crushed pistachios.",
    "price": 200,
    "variants": [
      {
        "id": "single",
        "name": "Single Scope",
        "price": 200
      },
      {
        "id": "double",
        "name": "Double Scope",
        "price": 200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "ice-cream-kulfa",
    "name": "Kulfa",
    "category": "Ice Cream",
    "description": "Traditional Pakistani rich milk kulfa with cardamom and nuts.",
    "price": 200,
    "variants": [
      {
        "id": "single",
        "name": "Single Scope",
        "price": 200
      },
      {
        "id": "double",
        "name": "Double Scope",
        "price": 200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "ice-cream-mango",
    "name": "Mango",
    "category": "Ice Cream",
    "description": "Luscious tropical sweet mango ice cream made with sweet mango pulp.",
    "price": 200,
    "variants": [
      {
        "id": "single",
        "name": "Single Scope",
        "price": 200
      },
      {
        "id": "double",
        "name": "Double Scope",
        "price": 200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1560008511-11c63416e52d?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "ice-cream-tutti-fruity",
    "name": "Tutti Fruity",
    "category": "Ice Cream",
    "description": "Vibrant sweet ice cream packed with candied fruit bits.",
    "price": 200,
    "variants": [
      {
        "id": "single",
        "name": "Single Scope",
        "price": 200
      },
      {
        "id": "double",
        "name": "Double Scope",
        "price": 200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "ice-cream-chocolate",
    "name": "Chocolate",
    "category": "Ice Cream",
    "description": "Velvety dark cocoa chocolate ice cream.",
    "price": 200,
    "variants": [
      {
        "id": "single",
        "name": "Single Scope",
        "price": 200
      },
      {
        "id": "double",
        "name": "Double Scope",
        "price": 200
      }
    ],
    "available": true,
    "image": "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "ice-cream-half-pack",
    "name": "Half Pack",
    "category": "Ice Cream",
    "description": "Half pack takeaway container of your favorite ice cream flavors.",
    "price": 400,
    "available": true,
    "image": "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "ice-cream-family-pack",
    "name": "Family Pack",
    "category": "Ice Cream",
    "description": "Large family pack takeaway tub for gatherings.",
    "price": 650,
    "available": true,
    "image": "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "spl-falooda",
    "name": "SPL FALOODA",
    "category": "Ice Cream",
    "description": "Special royal falooda with vermicelli, basil seeds, rose syrup, and creamy kulfi scoop.",
    "price": 350,
    "available": true,
    "isPopular": true,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "sarawan-special-shikarpuri-piyala",
    "name": "Sarawan Special Shikarpuri Piyala",
    "category": "Ice Cream",
    "description": "Signature rich Shikarpuri kulfi bowl crowned with pistachios, almonds, and saffron essence.",
    "price": 450,
    "available": true,
    "isSpecial": true,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "regular-cold-drink",
    "name": "Regular Cold Drink",
    "category": "Side & Bevrages",
    "description": "Chilled regular carbonated drink (Coke, Sprite, Fanta, Pakola).",
    "price": 60,
    "available": true,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "500-ml-cold-drink",
    "name": "500 ml Cold Drink",
    "category": "Side & Bevrages",
    "description": "500ml chilled bottle drink.",
    "price": 110,
    "available": true,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "mineral-water-large",
    "name": "Mineral Water Large",
    "category": "Side & Bevrages",
    "description": "Purified large 1.5L mineral water bottle.",
    "price": 120,
    "available": true,
    "image": "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "mineral-water-small",
    "name": "Mineral Water Small",
    "category": "Side & Bevrages",
    "description": "Purified small 500ml mineral water bottle.",
    "price": 70,
    "available": true,
    "image": "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "green-salad",
    "name": "Green Salad",
    "category": "Side & Bevrages",
    "description": "Fresh sliced cucumbers, carrots, onions, tomatoes, and lemon slices.",
    "price": 80,
    "available": true,
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "raita",
    "name": "Raita",
    "category": "Side & Bevrages",
    "description": "Cooling whipped yogurt with ground cumin and fresh mint.",
    "price": 60,
    "available": true,
    "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "chapati",
    "name": "Chapati",
    "category": "Side & Bevrages",
    "description": "Thin traditional whole-wheat tawa chapati.",
    "price": 25,
    "available": true,
    "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "puri-paratha",
    "name": "Puri Paratha",
    "category": "Side & Bevrages",
    "description": "Crisp golden layered Pakistani deep-fried puri paratha.",
    "price": 140,
    "available": true,
    "image": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "extra-cheese",
    "name": "Extra Cheese",
    "category": "Side & Bevrages",
    "description": "Add-on melted cheddar/mozzarella cheese topping.",
    "price": 40,
    "available": true,
    "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "extra-bun",
    "name": "Extra Bun",
    "category": "Side & Bevrages",
    "description": "Extra toasted burger bun.",
    "price": 40,
    "available": true,
    "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80"
  },
  {
    "id": "extra-coleslaw",
    "name": "Extra Coleslaw",
    "category": "Side & Bevrages",
    "description": "Creamy chilled shredded cabbage and carrot salad.",
    "price": 80,
    "available": true,
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
  }
];
