import React, { createContext, useContext, ReactNode } from "react";

// Define interfaces
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeId: string;
  category: string;
  details?: {
    brand: string;
    material: string;
    features: string[];
  };
}

export interface Store {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categories: string[];
}

// Create a mock database of products and stores
const stores: Store[] = [
  {
    id: "1",
    name: "Adidas",
    description:
      "Discover the latest fashion trends and styles for all occasions.",
    imageUrl: "/Adidas-Logo.png",
    categories: ["clothing", "accessories", "shoes"],
  },
  {
    id: "2",
    name: "Razer",
    description: "Cutting-edge electronics and gadgets for gamers.",
    imageUrl: "/razer-logo.png",
    categories: ["electronics", "accessories"],
  },
];

const products: Product[] = [
  {
    id: "1",
    name: "Grey Adidas T-Shirt",
    description: "Comfortable cotton t-shirt",
    price: 29.99,
    imageUrl: "/adidas-shirt.jpeg",
    category: "clothing",
    storeId: "1",
    details: {
      brand: "Adidas",
      material: "100% Cotton",
      features: [
        "Breathable fabric",
        "Machine washable",
        "Available in multiple colors",
        "Classic fit",
      ],
    },
  },
  {
    id: "2",
    name: "Adidas Cap",
    description: "Stylish cap for everyday wear",
    price: 49.99,
    imageUrl: "/adidas-cap.jpg",
    category: "accessories",
    storeId: "1",
    details: {
      brand: "Adidas",
      material: "Cotton Blend",
      features: ["Adjustable strap", "Embroidered logo", "UV protection"],
    },
  },
  {
    id: "3",
    name: "Adidas Shoes",
    description: "Comfortable sports shoes",
    price: 129.99,
    imageUrl: "/adidas-shoes.jpeg",
    category: "shoes",
    storeId: "1",
    details: {
      brand: "Adidas",
      material: "Synthetic and mesh",
      features: [
        "Cushioned sole",
        "Breathable mesh upper",
        "Durable rubber outsole",
        "Lightweight design",
      ],
    },
  },
  {
    id: "4",
    name: "Razer Keyboard",
    description: "Mechanical gaming keyboard",
    price: 299.99,
    imageUrl: "/razer-keyboard.jpg",
    category: "electronics",
    storeId: "2",
    details: {
      brand: "Razer",
      material: "Aluminum and ABS plastic",
      features: [
        "Mechanical switches",
        "RGB backlight",
        "Programmable keys",
        "Wrist rest included",
      ],
    },
  },
  {
    id: "5",
    name: "Razer Headset",
    description: "Gaming headset with surround sound",
    price: 199.99,
    imageUrl: "/razer-headset.jpg",
    category: "accessories",
    storeId: "2",
    details: {
      brand: "Razer",
      material: "Memory foam ear cushions",
      features: [
        "7.1 surround sound",
        "Noise-canceling microphone",
        "Lightweight design",
        "RGB lighting",
      ],
    },
  },
];

// Create functions to fetch data
export const getProduct = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getStore = (id: string): Store | undefined => {
  return stores.find((store) => store.id === id);
};

export const getStoreProducts = (storeId: string): Product[] => {
  return products.filter((product) => product.storeId === storeId);
};

export const getAllStores = (): Store[] => {
  return stores;
};

// Create context
interface ProductDataContextType {
  getProduct: (id: string) => Product | undefined;
  getStore: (id: string) => Store | undefined;
  getStoreProducts: (storeId: string) => Product[];
  getAllStores: () => Store[];
}

const ProductDataContext = createContext<ProductDataContextType | null>(null);

// Create provider component
export const ProductDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ProductDataContext.Provider
      value={{ getProduct, getStore, getStoreProducts, getAllStores }}
    >
      {children}
    </ProductDataContext.Provider>
  );
};

// Create hook to use the context
export const useProductData = () => {
  const context = useContext(ProductDataContext);
  if (!context) {
    throw new Error("useProductData must be used within a ProductDataProvider");
  }
  return context;
};
