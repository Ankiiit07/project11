export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: "concentrate" | "flavored" | "tea" | "cold-brew";
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
    id: "latte-concentrate",
    name: "Cafe at Once Latte",
    price: 199,
    originalPrice: 600,
    image:
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg",
    images: [
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554159/WhatsApp_Image_2025-07-03_at_20.18.31_mfvrpe.jpg",
    ],
    category: "concentrate",
    rating: 4.8,
    reviews: 234,
    badges: ["No Sugar", "Gluten Free", "Organic"],
    description:
      "Rich, bold latte concentrate perfect for your daily coffee ritual. Made from premium Arabica beans.",
    ingredients: ["100% Arabica Coffee", "Natural Flavors"],
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
      "Peel the concentrate tube",
      "Press into 4-6 oz of hot or cold water",
      "Stir and enjoy your perfect latte",
    ],
    isFeatured: true,
    inStock: true,
  },
  {
    id: "americano-concentrate",
    name: "Cafe at Once Americano",
    price: 199,
    originalPrice: 600,
    image:
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg",
    images: [
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751554787/WhatsApp_Image_2025-07-03_at_20.19.40_ykl6vs.jpg",
    ],
    category: "concentrate",
    rating: 4.7,
    reviews: 189,
    badges: ["No Sugar", "Gluten Free"],
    description:
      "Smooth and balanced Americano concentrate for the perfect cup every time.",
    ingredients: ["100% Arabica Coffee", "Natural Flavors"],
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
      "Peel the concentrate tube",
      "Press into 6-8 oz of hot or cold water",
      "Stir and enjoy your perfect Americano",
    ],
    isFeatured: true,
    inStock: true,
  },
  {
    id: "cold-brew-concentrate",
    name: "Cafe at Once Cold Brew",
    price: 199,
    originalPrice: 600,
    image:
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png",
    images: [
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556812/Frame_32_uwtjqy.png",
    ],
    category: "cold-brew",
    rating: 4.9,
    reviews: 312,
    badges: ["No Sugar", "Organic", "Cold Brew"],
    description:
      "Smooth, refreshing cold brew concentrate with low acidity and natural sweetness.",
    ingredients: ["100% Arabica Coffee", "Natural Flavors"],
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
      "Peel the concentrate tube",
      "Press into 6-8 oz of cold water or milk",
      "Add ice and enjoy your cold brew",
    ],
    isFeatured: true,
    inStock: false,
  },
  {
    id: "mocha-flavored",
    name: "Cafe at Once Mocha",
    price: 199,
    originalPrice: 600,
    image:
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png",
    images: [
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556810/Frame_31_rflj4i.png",
    ],
    category: "flavored",
    rating: 4.6,
    reviews: 156,
    badges: ["No Added Sugar", "Real Cocoa"],
    description: "Rich chocolate and coffee blend in a convenient tube format.",
    ingredients: ["Arabica Coffee", "Natural Cocoa", "Natural Flavors"],
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
      "Peel the tube",
      "Press into 6 oz of hot milk or water",
      "Stir well for the perfect mocha",
    ],
    inStock: true,
  },
  {
    id: "jasmine-tea",
    name: "Cafe at Once Jasmine Tea",
    price: 149,
    originalPrice: 600,
    image:
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png",
    images: [
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png",
      "https://res.cloudinary.com/dtcsms7zn/image/upload/v1751556808/Frame_30_dmzmur.png",
    ],
    category: "tea",
    rating: 4.6,
    reviews: 89,
    badges: ["Antioxidants", "Natural", "Low Caffeine"],
    description:
      "Premium jasmine tea blend with natural antioxidants and smooth flavor.",
    ingredients: ["Jasmine Tea Leaves", "Natural Flavors"],
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
      "Peel the concentrate tube",
      "Press into 8 oz of hot water",
      "Steep for 2-3 minutes and enjoy",
    ],
    inStock: false,
  },
  {
    id: 'demo-product',
    name: 'Demo Product',
    price: 1,                        // 👈 value of 1
    originalPrice: 100,
    image: 'https://via.placeholder.com/300x300.png?text=Demo+Product',
    images: [
      'https://via.placeholder.com/300x300.png?text=Demo+Product',
    ],
    category: 'concentrate',          // pick any valid category
    rating: 5,
    reviews: 0,
    badges: ['Demo'],
    description: 'This is a demo product added for testing purposes.',
    ingredients: ['Demo Ingredient'],
    nutrition: {
      calories: 0,
      caffeine: 0,
      sugar: 0,
      energy: 0,
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      sodium: 0,
      cholesterol: 0,
    },
    instructions: ['This is just a demo.'],
    isFeatured: false,
    inStock: true,
  },
  
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (
  category: Product["category"]
): Product[] => {
  return products.filter((product) => product.category === category);
};
