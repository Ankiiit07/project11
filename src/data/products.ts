export interface Product {
  id: string;
  video: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: 'concentrate' | 'flavored' | 'tea' | 'cold-brew';
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
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4',
    category: 'concentrate',
    rating: 4.8,
    reviews: 234,
    badges: ['No Sugar', 'Gluten Free', 'Organic'],
    description:
      'Rich, bold latte concentrate perfect for your daily coffee ritual. Made from premium Arabica beans.',
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
      'Press into 4-6 oz of hot or cold water',
      'Stir and enjoy your perfect latte',
    ],
    isFeatured: true,
    inStock: true,
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
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4',
    category: 'concentrate',
    rating: 4.7,
    reviews: 189,
    badges: ['No Sugar', 'Gluten Free'],
    description:
      'Smooth and balanced Americano concentrate for the perfect cup every time.',
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
      'Press into 6-8 oz of hot or cold water',
      'Stir and enjoy your perfect Americano',
    ],
    isFeatured: true,
    inStock: true,
  },
  {
    id: 'cold-brew-concentrate',
    name: 'Cafe at Once Cold Brew',
    price: 199,
    originalPrice: 600,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4',
    category: 'cold-brew',
    rating: 4.9,
    reviews: 312,
    badges: ['No Sugar', 'Organic', 'Cold Brew'],
    description:
      'Smooth, refreshing cold brew concentrate with low acidity and natural sweetness.',
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
      'Press into 6-8 oz of cold water or milk',
      'Add ice and enjoy your cold brew',
    ],
    isFeatured: true,
    inStock: false,
  },
  {
    id: 'mocha-flavored',
    name: 'Cafe at Once Mocha',
    price: 199,
    originalPrice: 600,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1755111986/IMG_9079_z2msvm.mov',
    category: 'flavored',
    rating: 4.6,
    reviews: 156,
    badges: ['No Added Sugar', 'Real Cocoa'],
    description: 'Rich chocolate and coffee blend in a convenient tube format.',
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
  },
  {
    id: 'jasmine-tea',
    name: 'Cafe at Once Jasmine Tea',
    price: 199,
    originalPrice: 600,
    image:
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
    images: [
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
      'https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png',
    ],
    video: 'https://res.cloudinary.com/dtcsms7zn/video/upload/v1751395895/526c3573288b46a0a85fec27d8630925.HD-1080p-7.2Mbps-15882571_1_lxeljd.mp4',
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
    inStock: false,
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
