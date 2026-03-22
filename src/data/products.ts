export interface Product {
  id: string;
  video: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: 'concentrate' | 'flavored' | 'tea' | 'cold-brew' | 'preorder';
  rating: number;
  reviews: number;
  badges: string[];
  description: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    caffeine: number;
    sugar: number;
    energy: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    sodium: number;
    cholesterol: number;
  };
  instructions: string[];
  isFeatured?: boolean;
  inStock: boolean;
  weight: number; // Weight in grams for shipping calculation
  isPreOrder?: boolean;
  preOrderNote?: string;
}

export const products: Product[] = [
  {
    id: 'latte-concentrate',
    name: 'Cafe at Once Latte',
    price: 199,
    originalPrice: 600,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1755112233/A4635F65-8EDE-43FF-A8B0-ED8033DC5E13sl_inu7nu.jpg',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1755112233/A4635F65-8EDE-43FF-A8B0-ED8033DC5E13sl_inu7nu.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1755111983/View_recent_photos_dx7dn1.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1755112527/WhatsApp_Image_2025-08-14_at_00.10.52_mxqrpr.jpg',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1755112010/IMG_8842_hswy5r.mov',
    category: 'concentrate',
    rating: 4.8,
    reviews: 234,
    badges: ['No Sugar', 'Gluten Free', 'Organic'],
    description:
      '2-3 cups of Rich, bold latte concentrate perfect for your daily coffee ritual. Made from premium Arabica beans.',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 120,
      sugar: 0,
      energy: 323,
      protein: 25,
      fat: 0,
      carbohydrate: 13.7,
      sodium: 3.2,
      cholesterol: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 300-350 ml of hot or cold water',
      'Stir and enjoy your perfect latte',
    ],
    isFeatured: true,
    inStock: true,
    weight: 100, // 100 grams
  },
  {
    id: 'americano-concentrate',
    name: 'Cafe at Once Americano',
    price: 199,
    originalPrice: 600,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1755110751/WhatsApp_Image_2025-08-14_at_00.09.20_kfkafc.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1755110712/WhatsApp_Image_2025-08-14_at_00.08.56_ejflrd.jpg',      
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg',
      
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1755111981/IMG_8590_jzfp5t.mov',
    category: 'concentrate',
    rating: 4.7,
    reviews: 189,
    badges: ['No Sugar', 'Gluten Free'],
    description:
      '2-3 cups Smooth and balanced Americano concentrate for the perfect cup every time.',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 95,
      sugar: 0,
      energy: 323,
      protein: 25,
      fat: 0,
      carbohydrate: 13.7,
      sodium: 3.2,
      cholesterol: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 300-350 ml of hot or cold water',
      'Stir and enjoy your perfect Americano',
    ],
    isFeatured: true,
    inStock: true,
    weight: 100, // 100 grams
  },
  {
    id: 'cold-brew-concentrate',
    name: 'Cafe at Once Cold Brew',
    price: 199,
    originalPrice: 600,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1756191194/DarkRoast_bfbdgl.webp',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1756191194/DarkRoast_bfbdgl.webp',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4',
    category: 'cold-brew',
    rating: 4.9,
    reviews: 312,
    badges: ['No Sugar', 'Organic', 'Cold Brew'],
    description:
      '2-3 cups of Smooth, refreshing cold brew concentrate with low acidity and natural sweetness.',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 2,
      caffeine: 110,
      sugar: 0,
      energy: 323,
      protein: 25,
      fat: 0,
      carbohydrate: 13.7,
      sodium: 3.2,
      cholesterol: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 300-350 ml of cold water or milk',
      'Add ice and enjoy your cold brew',
    ],
    isFeatured: true,
    inStock: false,
    weight: 120, // 120 grams
  },
  {
    id: 'mocha-flavored',
    name: 'Cafe at Once Mocha',
    price: 249,
    originalPrice: 600,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1756191751/Screenshot_2025-08-26_at_12.30.12_PM_sly2il.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1756191751/Screenshot_2025-08-26_at_12.30.12_PM_sly2il.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1756191751/Screenshot_2025-08-26_at_12.31.29_PM_lx9rx7.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1756191755/Screenshot_2025-08-26_at_12.30.46_PM_jrlfrt.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1756191758/Screenshot_2025-08-26_at_12.31.55_PM_jkjavb.png',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1755111986/IMG_9079_z2msvm.mov',
    category: 'flavored',
    rating: 4.6,
    reviews: 156,
    badges: ['No Added Sugar', 'Real Cocoa'],
    description: '2-3 Cup Rich chocolate and coffee blend in a convenient tube format.',
    ingredients: ['Arabica Coffee', 'Natural Cocoa', 'Natural Flavors'],
    nutrition: {
      calories: 15,
      caffeine: 85,
      sugar: 2,
      energy: 323,
      protein: 25,
      fat: 0,
      carbohydrate: 13.7,
      sodium: 3.2,
      cholesterol: 0,
    },
    instructions: [
      'Peel the tube',
      'Press into 6 oz of hot milk or water',
      'Stir well for the perfect mocha',
    ],
    inStock: true,
    weight: 110, // 110 grams
  },
  {
    id: 'jasmine-tea',
    name: 'Cafe at Once Jasmine Tea',
    price: 249,
    originalPrice: 600,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1756191194/2221212_3_ozkoqh.webp',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1756191194/2221212_3_ozkoqh.webp',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1755111986/IMG_9079_z2msvm.mov',
    category: 'tea',
    rating: 4.6,
    reviews: 89,
    badges: ['Antioxidants', 'Natural', 'Low Caffeine'],
    description:
      'Premium jasmine tea blend with natural antioxidants and smooth flavor.',
    ingredients: ['Jasmine Tea Leaves', 'Natural Flavors'],
    nutrition: {
      calories: 2,
      caffeine: 25,
      sugar: 0,
      energy: 323,
      protein: 25,
      fat: 0,
      carbohydrate: 13.7,
      sodium: 3.2,
      cholesterol: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 360ml of hot water',
      'Steep for 2-3 minutes and enjoy',
    ],
    inStock: true,
    weight: 80, // 80 grams
  },
   {
    id: 'espresso-concentrate',
    name: 'Cafe at Once Espresso Shot',
    price: 69,
    originalPrice: 99,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681692/Screenshot_2025-12-02_at_2.16.44_PM_z1hcdt.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681692/Screenshot_2025-12-02_at_2.16.44_PM_z1hcdt.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681692/Screenshot_2025-12-02_at_2.17.34_PM_jpscuc.png',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1755112010/IMG_8842_hswy5r.mov',
    category: 'concentrate',
    rating: 4.9,
    reviews: 434,
    badges: ['No Sugar', 'Gluten Free', 'Organic'],
    description:
      '1 Cup Chocolate & Cocoa Flavors, Nutty after Taste.',
    ingredients: ['100% Classic Italian', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 120,
      sugar: 0,
      energy: 323,
      protein: 25,
      fat: 0,
      carbohydrate: 13.7,
      sodium: 3.2,
      cholesterol: 0,
    },
    instructions: [

      'Tweak into 100-150 ml of hot or cold water',
      'Stir and enjoy your perfect latte',
    ],
    isFeatured: true,
    inStock: true,
    weight: 50, // 50 grams - single shot
  },
   {
    id: 'Corn Silk Coffee Concentrate',
    name: 'Cafe at Once Corn Silk',
    price: 69,
    originalPrice: 99,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681693/Screenshot_2025-12-02_at_2.18.13_PM_agarvu.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681693/Screenshot_2025-12-02_at_2.18.13_PM_agarvu.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681693/Screenshot_2025-12-02_at_2.18.43_PM_z3zchl.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681694/Screenshot_2025-12-02_at_2.19.07_PM_bvfme2.png',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1755112010/IMG_8842_hswy5r.mov',
    category: 'concentrate',
    rating: 4.8,
    reviews: 214,
    badges: ['No Sugar', 'Gluten Free', 'Organic'],
    description:
      '1 Cup of Corn Coffee and Tea Flavoring Balance and Smooth after Taste.',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 60,
      sugar: 0,
      energy: 123,
      protein: 15,
      fat: 0,
      carbohydrate: 3.7,
      sodium: 1.2,
      cholesterol: 0,
    },
    instructions: [
 
      'Tweak into 100-150 ml of hot or cold water',
      'Stir and enjoy your perfect latte',
    ],
    isFeatured: true,
    inStock: true,
    weight: 50, // 50 grams
  },
   {
    id: 'latte-concentrate trial',
    name: 'Cafe at Once Trial Pack',
    price: 699,
    originalPrice: 999,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681938/Screenshot_2025-12-02_at_2.24.10_PM_of0omv.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681938/Screenshot_2025-12-02_at_2.24.10_PM_of0omv.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764681946/WhatsApp_Image_2025-12-02_at_14.25.11_iubug4.jpg',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1764682723/Screenshot_2025-12-02_at_2.38.10_PM_qzhxtg.png',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1755112010/IMG_8842_hswy5r.mov',
    category: 'concentrate',
    rating: 4.8,
    reviews: 234,
    badges: ['No Sugar', 'Gluten Free', 'Organic'],
    description:
      ' 2-3 Cups Rich, bold latte concentrate perfect for your daily coffee ritual. Made from premium Arabica beans.',
    ingredients: ['100% Arabica Coffee', 'Natural Flavors'],
    nutrition: {
      calories: 5,
      caffeine: 120,
      sugar: 0,
      energy: 323,
      protein: 25,
      fat: 0,
      carbohydrate: 13.7,
      sodium: 3.2,
      cholesterol: 0,
    },
    instructions: [
      'Peel the concentrate tube',
      'Press into 300-350 ml of hot or cold water',
      'Stir and enjoy your perfect latte',
    ],
    isFeatured: true,
    inStock: true,
    weight: 300, // 300 grams - trial pack with multiple items
  },
  // PRE-ORDER PRODUCTS - JOYINBAG Collection
  {
    id: 'preorder-arabica-joyinbag',
    name: 'JOYINBAG Arabica',
    price: 749,
    originalPrice: 999,
    image: 'https://res.cloudinary.com/dtcsms7zn/image/upload/v1774184105/B8_3_1_mk61uf.webp',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1774184104/B8_1_nz6tjh.webp',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1774184104/B8_1_nz6tjh.webp',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1774184050/B8_21_hm3xfs.webp',
    ],
    video: '',
    category: 'preorder',
    rating: 5.0,
    reviews: 0,
    badges: ['Pre-Order', 'Nitrogen Infused', 'Cold Brew', 'Free Gift'],
    description: 'Cold Brew Arabica Concentrated Coffee Beverage - Nitrogen-infused Americano coffee liquid. Premium portable coffee in an elegant aluminum bottle. First 5 orders get free gifts!',
    ingredients: ['100% Arabica Coffee', 'Nitrogen'],
    nutrition: {
      calories: 5,
      caffeine: 150,
      sugar: 0,
      energy: 320,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      sodium: 0,
      cholesterol: 0,
    },
    instructions: [
      'Shake well before use',
      'Open the bottle cap',
      'Pour into 200-300ml of hot or cold water',
      'Stir and enjoy your nitrogen-infused coffee',
    ],
    isFeatured: true,
    inStock: true,
    weight: 100,
    isPreOrder: true,
    preOrderNote: 'First 5 orders get free gifts!',
  },
  {
    id: 'preorder-espresso-joy',
    name: 'JOY Espresso',
    price: 749,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1563203005-7550a13cf8be?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    images: [
      'https://images.unsplash.com/photo-1563203005-7550a13cf8be?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    ],
    video: '',
    category: 'preorder',
    rating: 5.0,
    reviews: 0,
    badges: ['Pre-Order', 'Classic Italian', 'Concentrated', 'Free Gift'],
    description: 'Classic Italian-style Espresso Concentrated Coffee Beverage. Preserves the original state of coffee extract liquid for an authentic espresso experience. First 5 orders get free gifts!',
    ingredients: ['100% Arabica Coffee', 'Natural Espresso Extract'],
    nutrition: {
      calories: 5,
      caffeine: 180,
      sugar: 0,
      energy: 350,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      sodium: 0,
      cholesterol: 0,
    },
    instructions: [
      'Shake well before use',
      'Open the bottle cap',
      'Pour into 150-200ml of hot water for classic espresso',
      'Add milk for a latte experience',
    ],
    isFeatured: true,
    inStock: true,
    weight: 100,
    isPreOrder: true,
    preOrderNote: 'First 5 orders get free gifts!',
  },
  {
    id: 'preorder-osmanthus-joy',
    name: 'JOY Osmanthus',
    price: 749,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1611550352943-449184a69751?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    images: [
      'https://images.unsplash.com/photo-1611550352943-449184a69751?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    ],
    video: '',
    category: 'preorder',
    rating: 5.0,
    reviews: 0,
    badges: ['Pre-Order', 'Osmanthus Flavor', 'Unique Blend', 'Free Gift'],
    description: 'Osmanthus Flower Flavored Concentrated Coffee Beverage. A unique blend of premium coffee with delicate osmanthus flower notes. Perfect over ice! First 5 orders get free gifts!',
    ingredients: ['100% Arabica Coffee', 'Natural Osmanthus Extract'],
    nutrition: {
      calories: 8,
      caffeine: 120,
      sugar: 2,
      energy: 300,
      protein: 0,
      fat: 0,
      carbohydrate: 2,
      sodium: 0,
      cholesterol: 0,
    },
    instructions: [
      'Shake well before use',
      'Open the bottle cap',
      'Pour over ice with 200-300ml water',
      'Garnish with osmanthus flowers for presentation',
    ],
    isFeatured: true,
    inStock: true,
    weight: 100,
    isPreOrder: true,
    preOrderNote: 'First 5 orders get free gifts!',
  },
  {
    id: 'preorder-deep-roasting-joy',
    name: 'JOY Deep Roasting',
    price: 749,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1591260201813-52e862e9ab42?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    images: [
      'https://images.unsplash.com/photo-1591260201813-52e862e9ab42?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    ],
    video: '',
    category: 'preorder',
    rating: 5.0,
    reviews: 0,
    badges: ['Pre-Order', 'Deep Roast', 'Bold Flavor', 'Free Gift'],
    description: 'Italian Deep Roasting Concentrated Coffee Beverage. Bold, intense flavor from deeply roasted premium beans. For those who love a strong coffee experience. First 5 orders get free gifts!',
    ingredients: ['100% Deep Roasted Arabica Coffee'],
    nutrition: {
      calories: 5,
      caffeine: 200,
      sugar: 0,
      energy: 380,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      sodium: 0,
      cholesterol: 0,
    },
    instructions: [
      'Shake well before use',
      'Open the bottle cap',
      'Pour into 150-250ml of hot water',
      'Enjoy the bold, deep roasted flavor',
    ],
    isFeatured: true,
    inStock: true,
    weight: 100,
    isPreOrder: true,
    preOrderNote: 'First 5 orders get free gifts!',
  },
  {
    id: 'preorder-tea-coffee-joyinbag',
    name: 'JOYINBAG Tea Coffee',
    price: 749,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1667064371242-19c2e7b9cb63?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    images: [
      'https://images.unsplash.com/photo-1667064371242-19c2e7b9cb63?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    ],
    video: '',
    category: 'preorder',
    rating: 5.0,
    reviews: 0,
    badges: ['Pre-Order', 'Jasmine Tea', 'Unique Fusion', 'Free Gift'],
    description: 'Jasmine Green Tea Flavored Concentrated Coffee Beverage. A harmonious fusion of premium coffee with delicate jasmine snow bud tea. First 5 orders get free gifts!',
    ingredients: ['100% Arabica Coffee', 'Jasmine Green Tea Extract'],
    nutrition: {
      calories: 5,
      caffeine: 100,
      sugar: 0,
      energy: 280,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      sodium: 0,
      cholesterol: 0,
    },
    instructions: [
      'Shake well before use',
      'Open the bottle cap',
      'Pour into 200-300ml of hot or cold water',
      'Experience the unique tea-coffee fusion',
    ],
    isFeatured: true,
    inStock: true,
    weight: 100,
    isPreOrder: true,
    preOrderNote: 'First 5 orders get free gifts!',
  },
  {
    id: 'preorder-super-berry-joy',
    name: 'JOY Super Berry',
    price: 749,
    originalPrice: 999,
    image: 'https://images.pexels.com/photos/2873623/pexels-photo-2873623.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/2873623/pexels-photo-2873623.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    video: '',
    category: 'preorder',
    rating: 5.0,
    reviews: 0,
    badges: ['Pre-Order', 'Berry Flavor', 'Fruity', 'Free Gift'],
    description: 'Super Berry Flavored Concentrated Coffee Beverage. A delightful blend of premium coffee with natural berry flavors. Perfect for a refreshing coffee experience. First 5 orders get free gifts!',
    ingredients: ['100% Arabica Coffee', 'Natural Berry Extracts'],
    nutrition: {
      calories: 10,
      caffeine: 100,
      sugar: 3,
      energy: 290,
      protein: 0,
      fat: 0,
      carbohydrate: 3,
      sodium: 0,
      cholesterol: 0,
    },
    instructions: [
      'Shake well before use',
      'Open the bottle cap',
      'Pour over ice with 200-300ml water',
      'Enjoy the fruity coffee experience',
    ],
    isFeatured: true,
    inStock: true,
    weight: 100,
    isPreOrder: true,
    preOrderNote: 'First 5 orders get free gifts!',
  },
  // F5 Score - 10 pieces pack
  {
    id: 'preorder-f5-score-pack',
    name: 'F5 Score Pack (10 pieces)',
    price: 500,
    originalPrice: 749,
    image: 'https://images.pexels.com/photos/4621677/pexels-photo-4621677.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/4621677/pexels-photo-4621677.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    video: '',
    category: 'preorder',
    rating: 5.0,
    reviews: 0,
    badges: ['Pre-Order', 'Value Pack', '10 Pieces', 'Free Gift'],
    description: 'F5 Score Value Pack - 10 pieces of premium portable coffee. Best value for coffee lovers! First 5 orders get free gifts!',
    ingredients: ['100% Arabica Coffee', 'Nitrogen'],
    nutrition: {
      calories: 5,
      caffeine: 150,
      sugar: 0,
      energy: 320,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      sodium: 0,
      cholesterol: 0,
    },
    instructions: [
      'Each piece makes one perfect cup',
      'Shake well before use',
      'Pour into 200-300ml of hot or cold water',
      'Stir and enjoy',
    ],
    isFeatured: true,
    inStock: true,
    weight: 200,
    isPreOrder: true,
    preOrderNote: 'First 5 orders get free gifts!',
  },
  // T Away - Single piece
  {
    id: 'preorder-t-away-single',
    name: 'T Away Single',
    price: 40,
    originalPrice: 75,
    image: 'https://images.unsplash.com/photo-1626120604426-530a5e7308fb?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    images: [
      'https://images.unsplash.com/photo-1626120604426-530a5e7308fb?crop=entropy&cs=srgb&fm=jpg&q=85&w=600',
    ],
    video: '',
    category: 'preorder',
    rating: 5.0,
    reviews: 0,
    badges: ['Pre-Order', 'Single Serve', 'Try Me', 'Free Gift'],
    description: 'T Away Single Serve - Try our premium portable coffee at just ₹40 per piece. Perfect for first-time buyers! First 5 orders get free gifts!',
    ingredients: ['100% Arabica Coffee'],
    nutrition: {
      calories: 5,
      caffeine: 120,
      sugar: 0,
      energy: 300,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      sodium: 0,
      cholesterol: 0,
    },
    instructions: [
      'Shake well before use',
      'Open and pour into your cup',
      'Add 200-300ml of hot or cold water',
      'Stir and enjoy',
    ],
    isFeatured: false,
    inStock: true,
    weight: 20,
    isPreOrder: true,
    preOrderNote: 'First 5 orders get free gifts!',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (
  category: Product['category']
): Product[] => {
  return products.filter((product) => product.category === category);
};
