# Shopping Mall Web App: Simplified Project Brief

## Project Overview
A responsive proof-of-concept shopping mall web application where users can browse stores, view products, add items to a cart, and checkout via PayPal. Store and product data will be hard-coded, with Firebase used only for cart persistence.

## Core Features
1. Mall directory (homepage)
2. Store pages with products
3. Product detail views
4. Shopping cart with Firebase persistence
5. PayPal checkout
6. Mobile-responsive design

## Tech Stack
- **Frontend**: React with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API
- **Cart Storage**: Firebase Firestore
- **Payment**: PayPal JavaScript SDK
- **Deployment**: Vercel/Netlify

## Data Structure
```javascript
// Hard-coded stores and products
const stores = [
  {
    id: 'store1',
    name: 'Fashion Corner',
    logo: '/images/fashion-corner.png',
    products: ['product1', 'product2', 'product3']
  }
];

const products = {
  'product1': {
    id: 'product1',
    name: 'Summer Dress',
    price: 49.99,
    description: 'Lightweight summer dress',
    images: ['image1.jpg'],
    storeId: 'store1'
  }
};

// Firebase structure (cart only)
// /carts/{sessionId}
//   - items[]
//   - totalAmount
```

## Component Structure
```
App
├── Header (Logo, Nav, Cart)
├── Routes
│   ├── HomePage
│   ├── StorePage
│   ├── ProductDetailPage
│   ├── CartPage
│   └── CheckoutPage
└── Footer
```

## Development Plan
1. **Setup**: Initialize React/Vite project with Tailwind and React Router
2. **Core UI**: Build responsive components and page layouts
3. **Data**: Implement hard-coded stores and products
4. **Cart**: Set up Firebase for cart functionality only
5. **Checkout**: Integrate PayPal payment processing
6. **Testing**: Ensure mobile responsiveness and payment flow

## Mobile Strategy
- Mobile-first design approach using Tailwind's responsive utilities
- Touch-friendly interface with appropriate sizing for mobile interaction
- Optimized performance with minimal asset loading

## Implementation Notes
- Anonymous sessions for cart persistence
- Products and stores remain entirely hard-coded
- PayPal Sandbox for payment testing
- Focus on clean, responsive UI for mobile devices