const RAW = [
  { id: 1, name: 'Sliced Wheat Bread', image: "/images/product-01.webp", imgW: 157, imgH: 210, fit: "contain" },
  { id: 2, name: 'Golden Pasta Shells', image: "/images/product-02.webp", imgW: 231, imgH: 210, fit: "contain" },
  { id: 3, name: 'Cheese Wedges', image: "/images/product-03.webp", imgW: 209, imgH: 210, fit: "contain" },
  { id: 4, name: 'Sweet Bell Peppers', image: "/images/product-04.webp", imgW: 179, imgH: 151, fit: "contain" },
  { id: 5, name: 'Broccoli and Tomatoes', image: "/images/product-05.webp", imgW: 190, imgH: 161, fit: "contain" },
  { id: 6, name: 'Fresh Whole Fish', image: "/images/product-06.webp", imgW: 232, imgH: 210, fit: "contain" },
  { id: 7, name: 'Dry Dog Food', image: "/images/product-07.webp", imgW: 213, imgH: 210, fit: "contain" },
  { id: 8, name: 'Seed Oil Bottles', image: "/images/product-08.webp", imgW: 138, imgH: 210, fit: "contain" },
  { id: 9, name: 'Dog Food with Chicken', image: "/images/product-09.webp", imgW: 194, imgH: 210, fit: "contain" },
  { id: 10, name: 'Creamy Pantry Spread', image: "/images/product-10.webp", imgW: 194, imgH: 210, fit: "contain" },
  { id: 11, name: 'Pet Food', image: "/images/product-11.webp", imgW: 185, imgH: 210, fit: "contain" },
  { id: 12, name: 'Glass Jars of Pantry Grains', image: "/images/product-12.webp", imgW: 209, imgH: 210, fit: "contain" },
  { id: 13, name: 'Green Apples', image: "/images/product-13.webp", imgW: 198, imgH: 210, fit: "contain" },
  { id: 14, name: 'Assorted Fruit Candy', image: "/images/product-14.webp", imgW: 213, imgH: 210, fit: "contain" },
  { id: 15, name: 'Fresh Mushrooms', image: "/images/product-15.webp", imgW: 215, imgH: 166, fit: "contain" },
  { id: 16, name: 'Fresh Leafy Greens', image: "/images/product-16.webp", imgW: 146, imgH: 210, fit: "contain" },
  { id: 17, name: 'Fresh Bread Loaf', image: "/images/product-17.webp", imgW: 138, imgH: 210, fit: "contain" },
  { id: 18, name: 'Fresh Fruit Salad', image: "/images/product-18.webp", imgW: 211, imgH: 210, fit: "contain" },
  { id: 19, name: 'Strawberry Juice Drink', image: "/images/product-19.webp", imgW: 213, imgH: 210, fit: "contain" },
  { id: 20, name: 'Citrus Fruit Juice', image: "/images/product-20.webp", imgW: 213, imgH: 210, fit: "contain" },
  { id: 21, name: 'Savory Salad Sachet', image: "/images/product-21.webp", imgW: 213, imgH: 210, fit: "cover" },
  { id: 22, name: 'Caramel Popcorn', image: "/images/product-22.webp", imgW: 213, imgH: 210, fit: "cover" },
  { id: 23, name: 'Organic Vegetable Blend', image: "/images/product-23.webp", imgW: 139, imgH: 210, fit: "cover" },
  { id: 24, name: 'Creamy Peanut Butter', image: "/images/product-24.webp", imgW: 213, imgH: 210, fit: "cover" },
  { id: 25, name: 'Roasted Pistachios', image: "/images/product-25.webp", imgW: 213, imgH: 210, fit: "cover" },
  { id: 26, name: 'Orange and Berry Juice', image: "/images/product-26.webp", imgW: 213, imgH: 210, fit: "contain" },
  { id: 27, name: 'Lasagna Tray', image: "/images/product-27.webp", imgW: 213, imgH: 210, fit: "cover" },
  { id: 28, name: 'Assorted Sweet Treats', image: "/images/product-28.webp", imgW: 213, imgH: 210, fit: "contain" },
  { id: 29, name: 'Fresh Tomatoes', image: "/images/product-29.webp", imgW: 213, imgH: 210, fit: "cover" },
  { id: 30, name: 'Tropical Fruit Juice', image: "/images/product-30.webp", imgW: 213, imgH: 210, fit: "contain" },
];

export const products = RAW.map((p) => ({
  ...p,
  price: 8,
  oldPrice: 11,
  discount: '10% OFF',
  rating: 4.5,
  reviews: 221,
}));

const byIds = (from, to) => products.filter((p) => p.id >= from && p.id <= to);

export const freshlyArrived = byIds(1, 18);
export const productsOnSale = byIds(19, 24);
export const bestSelling = byIds(25, 30);
