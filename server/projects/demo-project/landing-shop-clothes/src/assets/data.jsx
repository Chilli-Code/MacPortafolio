const navLinksData = [
  {
    isActive: true,
    name: "WOMENSWEAR",
  },
  {
    isActive: false,
    name: "MENSWEAR",
  },
  {
    isActive: false,
    name: "KIDS",
  },
  {
    isActive: false,
    name: "SALE",
  },
  {
    isActive: false,
    name: "DISCOVER",
  },
];

const filterButtonsData = [
  {
    name: "All",
    count: 12,
    isActive: true,
  },
  {
    name: "Summer Coll",
    count: 24,
    isActive: false,
  },
  {
    name: "New Ariv",
    count: 19,
    isActive: false,
  },
  {
    name: "Best Sell",
    count: 48,
    isActive: false,
  },
  {
    name: "Flash",
    count: 29,
    isActive: false,
  },
];

const productData = [
  {
    name: "CORD SHIRT",
    price: "$100",
    tag: "NEW ARRIVAL",
    imgHeight: "aspect-[3/4]",
    bgUrl: "bg-[url(/images/art-2.png)]",
  },
  {
    name: "CPO SHIRT",
    price: "$90",
    tag: "GET OFF 20%",
    imgHeight: "aspect-[3/4]",
    bgUrl: "bg-[url(/images/art-1.png)]",
  },
  {
    name: "SUMMER SWEATER",
    price: "$50",
    tag: null,
    imgHeight: "aspect-[3/4]",
    bgUrl: "bg-[url(/images/art-3.png)]",
  },
  {
    name: "T-SHIRTS",
    price: "$60",
    tag: null,
    imgHeight: "aspect-[3/4]",
    bgUrl: "bg-[url(/images/art-4.png)]",
  },
  {
    name: "CASUAL TROUSERS",
    price: "$120",
    tag: null,
    imgHeight: "aspect-[3/4]",
    bgUrl: "bg-[url(/images/art-6.png)]",
  },
  {
    name: "CARDIGAN",
    price: "$150",
    tag: null,
    imgHeight: "aspect-[3/4]",
    bgUrl: "bg-[url(/images/art-5.png)]",
  },
];

const productLinksData = [
  {
    title: "Product",
    links: ["Womenswear", "Menswear", "Kids", "Sale", "Discover"],
  },
];
const buyingLinksData = [
  {
    title: "Buying",
    links: [
      "Shipping",
      "Returns",
      "Terms of Use",
      "Privacy Policy",
      "Customer Service",
    ],
  },
];
const socialLinksData = [
  {
    title: "Social",
    links: ["Instagram", "Facebook", "Twitter"],
  },
];

// (
//   // Hero Image Source:
//   "https://images.unsplash.com/photo-1576281930835-7633c4652623?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764"
// );

export {
  navLinksData,
  filterButtonsData,
  productData,
  socialLinksData,
  buyingLinksData,
  productLinksData,
};
