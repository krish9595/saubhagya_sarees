import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Seeding Saubhagya Sarees & Bridal Studio database...");

  // 1. Roles & Permissions
  const permissionsData = [
    { slug: "products:view", name: "View Products", category: "Products" },
    { slug: "products:manage", name: "Create & Edit Products", category: "Products" },
    { slug: "products:delete", name: "Delete Products", category: "Products" },
    { slug: "orders:view", name: "View Orders", category: "Orders" },
    { slug: "orders:manage", name: "Update Orders & Status", category: "Orders" },
    { slug: "inventory:view", name: "View Inventory", category: "Inventory" },
    { slug: "inventory:manage", name: "Adjust & Restock Inventory", category: "Inventory" },
    { slug: "customers:view", name: "View Customers", category: "Customers" },
    { slug: "customers:manage", name: "Edit Customer Notes", category: "Customers" },
    { slug: "coupons:manage", name: "Manage Coupons", category: "Marketing" },
    { slug: "reviews:manage", name: "Moderate Reviews", category: "Marketing" },
    { slug: "cms:manage", name: "Manage Homepage & CMS", category: "Content" },
    { slug: "settings:manage", name: "Store Settings", category: "Settings" },
    { slug: "staff:manage", name: "Manage Staff & Roles", category: "Security" },
  ];

  for (const perm of permissionsData) {
    await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: {},
      create: perm,
    });
  }

  const allPermissions = await prisma.permission.findMany();

  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      displayName: "Super Administrator",
      description: "Full unconstrained administrative access across all modules",
    },
  });

  const storeManagerRole = await prisma.role.upsert({
    where: { name: "STORE_MANAGER" },
    update: {},
    create: {
      name: "STORE_MANAGER",
      displayName: "Store Manager",
      description: "Manages catalogue, orders, customers and inventory",
    },
  });

  const inventoryManagerRole = await prisma.role.upsert({
    where: { name: "INVENTORY_MANAGER" },
    update: {},
    create: {
      name: "INVENTORY_MANAGER",
      displayName: "Inventory Manager",
      description: "Manages stock levels, batch adjustments and restocking",
    },
  });

  // Assign all permissions to super admin
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // 2. Admin Users
  const passwordHash = await bcrypt.hash("Saubhagya@2026", 10);

  const superAdminUser = await prisma.user.upsert({
    where: { email: "admin@saubhagyasarees.com" },
    update: { passwordHash },
    create: {
      email: "admin@saubhagyasarees.com",
      name: "Saubhagya Studio Owner",
      phone: "+91 99960 88960",
      passwordHash,
      roleId: superAdminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "manager@saubhagyasarees.com" },
    update: { passwordHash },
    create: {
      email: "manager@saubhagyasarees.com",
      name: "Senior Studio Manager",
      phone: "+91 98765 43210",
      passwordHash,
      roleId: storeManagerRole.id,
    },
  });

  // 3. Categories
  const categoriesData = [
    {
      name: "Sarees",
      slug: "sarees",
      description: "Handcrafted Banarasi, royal Kanjeevaram, ethereal Organza and festive silk sarees curated with generational craftsmanship.",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
      bannerImage: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=80",
      displayOrder: 1,
      seoTitle: "Designer Sarees & Handloom Silk Sarees | Saubhagya Sarees Hisar",
      seoDescription: "Shop luxury Indian sarees in pure silk, organza, georgette, and banarasi weaves at Saubhagya Sarees & Bridal Studio.",
    },
    {
      name: "Bridal Collection",
      slug: "bridal",
      description: "Heirloom bridal lehengas, reception ensembles, and ceremonial wedding sarees embellished with zardozi, dabka and gota patti.",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      bannerImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80",
      displayOrder: 2,
      seoTitle: "Luxury Bridal Lehengas & Wedding Ensembles | Saubhagya Bridal Studio",
      seoDescription: "Exquisite bridal trousseau, velvet lehengas and royal wedding sarees in Hisar, Haryana.",
    },
    {
      name: "Non-Bridal Wear",
      slug: "non-bridal",
      description: "Glamorous sangeet lehengas, cocktail gowns, and designer fusion drapes for bridesmaids and wedding guests.",
      image: "https://images.unsplash.com/photo-1654764746225-e63f5e90facd?auto=format&fit=crop&w=1000&q=80",
      displayOrder: 3,
      seoTitle: "Designer Non-Bridal Outfits & Sangeet Ensembles | Saubhagya",
      seoDescription: "Explore bespoke non-bridal lehengas, reception sarees, and cocktail dresses.",
    },
    {
      name: "Suits",
      slug: "suits",
      description: "Hand-embroidered pure Chanderi suits, regal Anarkalis, sharara sets and straight-cut festive ensembles.",
      image: "https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?auto=format&fit=crop&w=1000&q=80",
      displayOrder: 4,
      seoTitle: "Designer Suits & Anarkali Sets | Saubhagya Sarees & Studio",
      seoDescription: "Premium unstitched and ready-to-wear festive salwar suits, shararas and chanderi anarkalis.",
    },
    {
      name: "Kurtis",
      slug: "kurtis",
      description: "Chic luxury kurtis, silk tunics, and long festive kurtis with subtle hand-embroidery and zari accents.",
      image: "https://images.unsplash.com/photo-1597983073540-684a10b15ab1?auto=format&fit=crop&w=1000&q=80",
      displayOrder: 5,
      seoTitle: "Designer Kurtis & Tunics | Saubhagya Ethnic Fashion",
      seoDescription: "Shop graceful everyday and festive kurtis crafted from pure cotton, silk and georgette.",
    },
    {
      name: "Dresses",
      slug: "dresses",
      description: "Contemporary Indo-western maxi dresses, drape gowns, and fusion ethnic silhouettes designed for modern celebrations.",
      image: "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=1000&q=80",
      displayOrder: 6,
      seoTitle: "Indo-Western & Ethnic Dresses | Saubhagya Bridal Studio",
      seoDescription: "Exquisite fusion gowns and designer ethnic dresses for festivities and cocktail soirees.",
    },
    {
      name: "Festive Collection",
      slug: "festive",
      description: "Vibrant ethnic ensembles curated specially for Karwa Chauth, Diwali, Teej and intimate family gatherings.",
      image: "https://images.unsplash.com/photo-1587271315307-eaebc181c749?auto=format&fit=crop&w=1000&q=80",
      displayOrder: 7,
      seoTitle: "Festive Ethnic Wear Collection | Saubhagya Sarees",
      seoDescription: "Celebrate Indian festivals in timeless sarees, suits and festive lehengas.",
    },
    {
      name: "New Arrivals",
      slug: "new-arrivals",
      description: "Fresh drops directly from our Hisar bridal studio featuring season-exclusive handlooms and designs.",
      image: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&w=1000&q=80",
      displayOrder: 8,
      seoTitle: "New Arrivals Ethnic Wear | Saubhagya Sarees & Bridal Studio",
      seoDescription: "Discover latest saree arrivals, festive suits and bridal additions at Saubhagya Sarees.",
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = createdCat.id;
  }

  // 4. Curated Collections
  const collectionsData = [
    {
      name: "Shringaar Bridal Edit 2026",
      slug: "shringaar-bridal-2026",
      tagline: "For moments that become heirloom memories",
      description: "A royal tribute to traditional bridal aesthetics featuring rich velvets, pure raw silks and intricate zardozi craftsmanship.",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
      bannerImage: "https://images.unsplash.com/photo-1583391733975-08149ebffb5e?auto=format&fit=crop&w=1600&q=80",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "Virasat Silk Sarees",
      slug: "virasat-silks",
      tagline: "Generations of handwoven elegance",
      description: "Authentic Banarasi katan silks, pure Kanjeevarams with pure gold zari borders, and tissue silks.",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: "Noor Festive Collection",
      slug: "noor-festive",
      tagline: "Radiate warmth and celebratory grace",
      description: "Luminous hues of crimson, turmeric, deep emerald and royal magenta designed for festive gatherings.",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80",
      isFeatured: true,
      displayOrder: 3,
    },
  ];

  const collectionMap = {};
  for (const col of collectionsData) {
    const createdCol = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
    collectionMap[col.slug] = createdCol.id;
  }

  // 5. Products Catalogue
  const products = [
    {
      title: "Royal Crimson Zardozi Micro-Velvet Bridal Lehenga",
      slug: "royal-crimson-zardozi-velvet-bridal-lehenga",
      sku: "SBS-BR-0101",
      shortDescription: "Regal crimson micro-velvet bridal lehenga hand-embroidered with antique dabka, tilla, and sequins. Paired with dual dupattas.",
      description: `Step into timeless majesty with the Royal Crimson Zardozi Bridal Lehenga from the Saubhagya Bridal Studio. Crafted from rich micro-velvet, each panel is adorned with intricate mughal jaal motifs, handcrafted dabka, french knots, and gold badla work. 

The ensemble includes a structured lehenga skirt with a 4.2-meter circular flare, an intricately embellished blouse with dori tie-ups, a deep crimson velvet shoulder dupatta, and a lightweight peach tissue veil dupatta with scalloped borders.`,
      price: 68500,
      mrp: 89900,
      discountPercent: 24,
      taxRate: 5,
      fabric: "Pure Micro Velvet & Silk Organza",
      occasion: "Bridal",
      primaryColor: "Crimson Red",
      blouseDetails: "Padded custom-stitched blouse with antique gold tassels",
      suitComponents: "Lehenga, Blouse, Velvet Dupatta, Tissue Veil Dupatta",
      careInstructions: "Dry Clean Only. Preserve wrapped in pure cotton muslin fabric. Avoid spraying perfumes directly on zardozi embellishments.",
      customizationAvailable: true,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      categoryId: categoryMap["bridal"],
      collectionId: collectionMap["shringaar-bridal-2026"],
      tags: "bridal lehenga, wedding, crimson red, velvet lehenga, zardozi, hisar bridal studio",
      rating: 5.0,
      reviewCount: 14,
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1610047520958-b42ebcd2f6cb?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Custom Stitched (S-M)", sku: "SBS-BR-0101-SM", size: "M", color: "Crimson Red", colorHex: "#7A1616", stock: 3 },
        { title: "Custom Stitched (L-XL)", sku: "SBS-BR-0101-LXL", size: "L", color: "Crimson Red", colorHex: "#7A1616", stock: 2 },
        { title: "Semi-Stitched Free Size", sku: "SBS-BR-0101-FREE", size: "Free Size", color: "Crimson Red", colorHex: "#7A1616", stock: 5 },
      ],
    },
    {
      title: "Handwoven Royal Banarasi Katan Silk Saree",
      slug: "handwoven-royal-banarasi-katan-silk-saree",
      sku: "SBS-SR-0201",
      shortDescription: "Pure Katan silk Banarasi saree in deep wine maroon featuring intricate gold kadwa shikargah motifs and a grand pallu.",
      description: `A masterwork of generational weavers, this authentic Banarasi saree is woven with certified pure mulberry katan silk. The body features intricate kadwa floral jaal in antique gold zari, while the resplendent pallu showcases traditional royal shikargah motifs.

Comes with Silk Mark certification and includes an unstitched contrast brocade blouse piece.`,
      price: 18500,
      mrp: 24000,
      discountPercent: 23,
      taxRate: 5,
      fabric: "Pure Katan Silk with Gold Zari",
      occasion: "Wedding Guest",
      primaryColor: "Wine Maroon",
      sareeLength: "5.5 meters saree + 0.8 meter blouse piece",
      blouseDetails: "Unstitched heavy zari brocade blouse piece included",
      careInstructions: "Dry Clean Only. Iron on reverse using low temperature silk setting. Fold along zari creases carefully.",
      customizationAvailable: false,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      categoryId: categoryMap["sarees"],
      collectionId: collectionMap["virasat-silks"],
      tags: "banarasi saree, katan silk, wine saree, zari pallu, bridal saree",
      rating: 4.9,
      reviewCount: 22,
      images: [
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1609748340041-f5d61e061ebc?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Standard Free Size", sku: "SBS-SR-0201-FREE", size: "Free Size", color: "Wine Maroon", colorHex: "#4A1525", stock: 8 },
      ],
    },
    {
      title: "Ethereal Pastel Organza Saree with Hand-Cut Pitta Work",
      slug: "ethereal-pastel-organza-saree-pitta-work",
      sku: "SBS-SR-0202",
      shortDescription: "Powder pink Italian organza saree highlighted with hand-cut gotta patti borders, pearl scalloping, and resham florals.",
      description: `Drape yourself in modern romance. This sheer, featherlight Italian organza saree features delicate hand-painted pastel blossoms embellished with fine cut-dana, pearls, and soft champagne pitta work along the scalloped hemline. 

An ideal choice for day weddings, sangeet brunches, and celebratory dinners.`,
      price: 12900,
      mrp: 16500,
      discountPercent: 22,
      taxRate: 5,
      fabric: "Premium Italian Silk Organza",
      occasion: "Festive",
      primaryColor: "Powder Pink",
      sareeLength: "5.5 meters + 0.9 meter blouse",
      blouseDetails: "Raw silk designer embroidered blouse piece",
      careInstructions: "Dry Clean Only. Store flat in saree covers.",
      customizationAvailable: false,
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      categoryId: categoryMap["sarees"],
      collectionId: collectionMap["noor-festive"],
      tags: "organza saree, pastel pink, gotta patti, day wedding",
      rating: 4.8,
      reviewCount: 9,
      images: [
        "https://images.unsplash.com/photo-1616756141603-6d37d5cde2a2?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1609748340041-f5d61e061ebc?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Standard Free Size", sku: "SBS-SR-0202-FREE", size: "Free Size", color: "Powder Pink", colorHex: "#EAB8B8", stock: 6 },
      ],
    },
    {
      title: "Royal Emerald Hand-Embroidered Chanderi Anarkali Suit Set",
      slug: "royal-emerald-chanderi-anarkali-suit-set",
      sku: "SBS-ST-0301",
      shortDescription: "Floor-length pure Chanderi silk Anarkali kurta with churidar and hand-painted organza dupatta with intricate zari borders.",
      description: `Exude royal poise in this opulent emerald green Anarkali suit set. The kalidar kurta features hand-embroidered neckline with marodi and badla work, teamed with comfortable silk-blend churidar trousers and a lavish organza dupatta with scalloped borders.`,
      price: 14500,
      mrp: 19500,
      discountPercent: 26,
      taxRate: 5,
      fabric: "Pure Chanderi Silk with Cotton Silk Lining",
      occasion: "Festive",
      primaryColor: "Emerald Green",
      suitComponents: "Anarkali Kurta, Churidar Pant, Silk Organza Dupatta",
      careInstructions: "Dry Clean Recommended. Do not bleach or tumble dry.",
      customizationAvailable: true,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      categoryId: categoryMap["suits"],
      collectionId: collectionMap["noor-festive"],
      tags: "anarkali suit, chanderi silk, emerald green, festive wear, wedding suit",
      rating: 4.9,
      reviewCount: 18,
      images: [
        "https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1597983073750-16f5ded1321f?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Small (S)", sku: "SBS-ST-0301-S", size: "S", color: "Emerald Green", colorHex: "#114732", stock: 4 },
        { title: "Medium (M)", sku: "SBS-ST-0301-M", size: "M", color: "Emerald Green", colorHex: "#114732", stock: 6 },
        { title: "Large (L)", sku: "SBS-ST-0301-L", size: "L", color: "Emerald Green", colorHex: "#114732", stock: 4 },
        { title: "X-Large (XL)", sku: "SBS-ST-0301-XL", size: "XL", color: "Emerald Green", colorHex: "#114732", stock: 2 },
      ],
    },
    {
      title: "Mustard Georgette Sharara Set with Mirror & Gotta Work",
      slug: "mustard-georgette-sharara-set-mirror-gotta",
      sku: "SBS-ST-0302",
      shortDescription: "Festive mustard yellow short kurti with flared tiered sharara and sequined net dupatta for haldi and mehendi celebrations.",
      description: `Light up celebratory afternoons with this sunshine mustard yellow sharara set. Embellished with authentic mirror work, resham threads, and tiered gotta laces, this three-piece ensemble blends youthful grace with ethnic grandeur.`,
      price: 8900,
      mrp: 12000,
      discountPercent: 25,
      taxRate: 5,
      fabric: "Viscose Georgette with Shantoon Lining",
      occasion: "Festive",
      primaryColor: "Mustard Yellow",
      suitComponents: "Peplum Kurti, Flared Tiered Sharara, Net Dupatta",
      careInstructions: "Dry Clean Only to protect delicate mirror work.",
      customizationAvailable: true,
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      categoryId: categoryMap["suits"],
      collectionId: collectionMap["noor-festive"],
      tags: "sharara set, haldi dress, mustard suit, mirror work",
      rating: 4.7,
      reviewCount: 11,
      images: [
        "https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1597983073540-684a10b15ab1?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Medium (M)", sku: "SBS-ST-0302-M", size: "M", color: "Mustard Yellow", colorHex: "#DDA208", stock: 5 },
        { title: "Large (L)", sku: "SBS-ST-0302-L", size: "L", color: "Mustard Yellow", colorHex: "#DDA208", stock: 3 },
      ],
    },
    {
      title: "Deep Wine Georgette Drape Saree Gown",
      slug: "deep-wine-georgette-drape-saree-gown",
      sku: "SBS-DR-0401",
      shortDescription: "Pre-stitched ready-to-wear drape saree gown with structured shoulder pallu and hand-embroidered pearl belt.",
      description: `Designed for cocktail nights and high-octane reception parties, this modern pre-draped saree gown offers effortless elegance. Crafted from fluid georgette with an embroidered illusion bodice and a dramatic attached pleated pallu.`,
      price: 16900,
      mrp: 22000,
      discountPercent: 23,
      taxRate: 5,
      fabric: "Flowy Micro Georgette",
      occasion: "Party",
      primaryColor: "Deep Wine",
      careInstructions: "Specialist Dry Clean Only.",
      customizationAvailable: true,
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      categoryId: categoryMap["dresses"],
      tags: "saree gown, pre-draped saree, wine dress, cocktail gown, indo western",
      rating: 5.0,
      reviewCount: 8,
      images: [
        "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1654764746225-e63f5e90facd?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Small (S)", sku: "SBS-DR-0401-S", size: "S", color: "Deep Wine", colorHex: "#3E1321", stock: 3 },
        { title: "Medium (M)", sku: "SBS-DR-0401-M", size: "M", color: "Deep Wine", colorHex: "#3E1321", stock: 4 },
        { title: "Large (L)", sku: "SBS-DR-0401-L", size: "L", color: "Deep Wine", colorHex: "#3E1321", stock: 2 },
      ],
    },
    {
      title: "Royal Navy Blue Silk Straight Kurti with Zari Collar",
      slug: "navy-blue-silk-straight-kurti-zari",
      sku: "SBS-KR-0501",
      shortDescription: "Pure raw silk straight-cut kurti with mandarin collar embellished with antique copper zari and side slits.",
      description: `A masterclass in understated elegance. This navy blue pure raw silk kurti features clean architectural tailoring, concealed button placket, and subtle metallic zari embroidery at the collar and cuffs.`,
      price: 4900,
      mrp: 6500,
      discountPercent: 25,
      taxRate: 5,
      fabric: "Pure Raw Silk",
      occasion: "Casual",
      primaryColor: "Navy Blue",
      careInstructions: "Dry Clean Only.",
      customizationAvailable: false,
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      categoryId: categoryMap["kurtis"],
      tags: "silk kurti, navy kurti, straight kurti, office wear, festive tunic",
      rating: 4.8,
      reviewCount: 15,
      images: [
        "https://images.unsplash.com/photo-1597983073540-684a10b15ab1?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1667665970124-2273c6ef3489?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Small (S)", sku: "SBS-KR-0501-S", size: "S", color: "Navy Blue", colorHex: "#11223E", stock: 6 },
        { title: "Medium (M)", sku: "SBS-KR-0501-M", size: "M", color: "Navy Blue", colorHex: "#11223E", stock: 8 },
        { title: "Large (L)", sku: "SBS-KR-0501-L", size: "L", color: "Navy Blue", colorHex: "#11223E", stock: 5 },
      ],
    },
    {
      title: "Rani Pink Kanjeevaram Silk Saree with Pure Gold Zari Border",
      slug: "rani-pink-kanjeevaram-pure-gold-zari-saree",
      sku: "SBS-SR-0203",
      shortDescription: "Heirloom Kanchipuram silk saree in vibrant Rani Pink featuring Korvai weaving and traditional peacock motifs.",
      description: `Direct from master looms of South India, this Rani Pink Kanjeevaram silk saree is woven with certified pure 2-ply silk and dipped in molten gold zari. Features authentic temple borders and an ornate pallu commemorating eternal prosperity.`,
      price: 24900,
      mrp: 32000,
      discountPercent: 22,
      taxRate: 5,
      fabric: "Pure Kanchipuram Mulberry Silk with Gold Zari",
      occasion: "Bridal",
      primaryColor: "Rani Pink",
      sareeLength: "5.5 meters + 0.8 meter blouse",
      blouseDetails: "Unstitched matching silk blouse with heavy zari border",
      careInstructions: "Dry clean only. Roll with butter paper to safeguard zari lustre.",
      customizationAvailable: false,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      categoryId: categoryMap["sarees"],
      collectionId: collectionMap["virasat-silks"],
      tags: "kanjeevaram saree, rani pink, wedding saree, pure silk, south silk",
      rating: 5.0,
      reviewCount: 19,
      images: [
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1609748340041-f5d61e061ebc?auto=format&fit=crop&w=1000&q=80",
      ],
      variants: [
        { title: "Standard Free Size", sku: "SBS-SR-0203-FREE", size: "Free Size", color: "Rani Pink", colorHex: "#B81452", stock: 7 },
      ],
    },
  ];

  for (const p of products) {
    const { images, variants, ...prodData } = p;
    const createdProd = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: prodData,
      create: prodData,
    });

    // Create Images
    await prisma.productImage.deleteMany({ where: { productId: createdProd.id } });
    let orderIdx = 0;
    for (const imgUrl of images) {
      await prisma.productImage.create({
        data: {
          productId: createdProd.id,
          url: imgUrl,
          alt: `${createdProd.title} - view ${orderIdx + 1}`,
          displayOrder: orderIdx,
          isPrimary: orderIdx === 0,
        },
      });
      orderIdx++;
    }

    // Create Variants & Inventory
    for (const v of variants) {
      const createdVar = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          stockQuantity: v.stock,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
        },
        create: {
          productId: createdProd.id,
          title: v.title,
          sku: v.sku,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stockQuantity: v.stock,
        },
      });

      // Update or create inventory
      await prisma.inventory.upsert({
        where: {
          productId_variantId: {
            productId: createdProd.id,
            variantId: createdVar.id,
          },
        },
        update: {
          quantity: v.stock,
        },
        create: {
          productId: createdProd.id,
          variantId: createdVar.id,
          quantity: v.stock,
          lowStockThreshold: 3,
        },
      });

      // Initial movement
      await prisma.inventoryMovement.create({
        data: {
          productId: createdProd.id,
          variantId: createdVar.id,
          changeType: "RESTOCK",
          quantityDelta: v.stock,
          balanceAfter: v.stock,
          notes: "Initial catalogue opening stock",
          createdByUserId: superAdminUser.id,
        },
      });
    }
  }

  // 6. Homepage CMS Sections
  const cmsSections = [
    {
      sectionKey: "announcement_bar",
      title: "Top Announcement Bar",
      contentJson: JSON.stringify({
        text: "✨ Handcrafted Heritage | Complimentary Shipping Across India on Orders Above ₹4,999 | Studio Visits Welcome",
        link: "/shop",
        badge: "NEW ARRIVALS",
        isActive: true,
      }),
      displayOrder: 1,
    },
    {
      sectionKey: "hero_section",
      title: "Main Luxury Hero Banner",
      contentJson: JSON.stringify({
        headline: "Elegance Woven in Tradition",
        subheadline: "Discover timeless sarees, exquisite bridal ensembles and thoughtfully curated ethnic fashion for every celebration.",
        cta1Text: "Explore Collections",
        cta1Link: "/shop",
        cta2Text: "Discover Bridal",
        cta2Link: "/shop/bridal",
        desktopImage: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&w=1920&q=85",
        mobileImage: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&w=1080&q=80",
        tagline: "SAUBHAGYA BRIDAL STUDIO • HISAR",
      }),
      displayOrder: 2,
    },
    {
      sectionKey: "bridal_feature",
      title: "Bridal Editorial Spotlight",
      contentJson: JSON.stringify({
        eyebrow: "THE BRIDAL SUITE",
        headline: "For Moments That Become Memories",
        description: "Discover exquisite bridal and wedding occasionwear, thoughtfully curated for your most special celebrations.",
        ctaText: "Discover Bridal Collection",
        ctaLink: "/shop/bridal",
        bannerImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85",
      }),
      displayOrder: 3,
    },
    {
      sectionKey: "brand_story",
      title: "Brand Story & Heritage",
      contentJson: JSON.stringify({
        eyebrow: "OUR PHILOSOPHY",
        headline: "Tradition, Elegance & The Art of Dressing Beautifully",
        body: "Located in the heart of Hisar at the Wholesale Cloth Market, Saubhagya Sarees & Bridal Studio has been a cherished ethnic fashion destination for women seeking timeless grace. From opulent bridal trousseaus and pure Kanjeevaram silks to breezy festive suits and contemporary fusion dresses, our studio curates attire that celebrates the warmth and vibrancy of Indian culture.",
        storeLocation: "SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Tayal Bagh Colony, Hisar, Haryana 125001",
        phone: "+91 99960 88960",
        hours: "Monday to Sunday: 10:30 AM – 8:30 PM",
      }),
      displayOrder: 4,
    },
  ];

  for (const s of cmsSections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: s.sectionKey },
      update: s,
      create: s,
    });
  }

  // 7. Store Settings
  const defaultSettings = [
    { key: "store_name", value: "Saubhagya Sarees & Bridal Studio", group: "GENERAL" },
    { key: "store_tagline", value: "Elegance Woven in Tradition", group: "GENERAL" },
    { key: "store_phone", value: "+91 99960 88960", group: "GENERAL" },
    { key: "store_whatsapp", value: "919996088960", group: "GENERAL" },
    { key: "store_email", value: "care@saubhagyasarees.com", group: "GENERAL" },
    { key: "store_address", value: "SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Tayal Bagh Colony, Hisar, Haryana 125001", group: "GENERAL" },
    { key: "currency_symbol", value: "₹", group: "GENERAL" },
    { key: "currency_code", value: "INR", group: "GENERAL" },
    { key: "free_shipping_threshold", value: "4999", group: "SHIPPING" },
    { key: "standard_shipping_fee", value: "150", group: "SHIPPING" },
    { key: "express_shipping_fee", value: "350", group: "SHIPPING" },
    { key: "tax_gst_rate", value: "5", group: "PAYMENT" },
    { key: "enable_cod", value: "true", group: "PAYMENT" },
    { key: "enable_razorpay", value: "true", group: "PAYMENT" },
    { key: "razorpay_mode", value: "TEST", group: "PAYMENT" },
    { key: "instagram_handle", value: "saubhagya_sarees_31", group: "SOCIAL" },
    { key: "instagram_url", value: "https://www.instagram.com/saubhagya_sarees_31/", group: "SOCIAL" },
  ];

  for (const st of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: st.key },
      update: st,
      create: st,
    });
  }

  // 8. Coupons
  const couponsData = [
    {
      code: "SAUBHAGYA10",
      description: "10% off on all orders above ₹2,999",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 2999,
      maxDiscount: 1500,
      isActive: true,
    },
    {
      code: "BRIDAL2026",
      description: "Flat ₹2,500 off on luxury bridal purchases above ₹25,000",
      discountType: "FIXED",
      discountValue: 2500,
      minOrderValue: 25000,
      maxDiscount: 2500,
      isActive: true,
    },
    {
      code: "WELCOME500",
      description: "Flat ₹500 off on your first festive order above ₹3,999",
      discountType: "FIXED",
      discountValue: 500,
      minOrderValue: 3999,
      maxDiscount: 500,
      isActive: true,
    },
  ];

  for (const cp of couponsData) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: cp,
      create: cp,
    });
  }

  // 9. Sample Customers & Orders for realistic demonstration
  const sampleCustomer = await prisma.customer.upsert({
    where: { phone: "+91 98123 45678" },
    update: {},
    create: {
      name: "Pooja Singhal",
      email: "pooja.singhal@example.com",
      phone: "+91 98123 45678",
      notes: "Preferred customer, frequent shopper for festive silks in Hisar.",
      addresses: {
        create: {
          fullName: "Pooja Singhal",
          phone: "+91 98123 45678",
          streetAddress: "House 142, Urban Estate II",
          landmark: "Near OP Jindal Model School",
          city: "Hisar",
          state: "Haryana",
          postalCode: "125005",
          isDefault: true,
        },
      },
    },
  });

  // Sample Completed Order
  const sampleProduct = await prisma.product.findFirst({ where: { sku: "SBS-SR-0201" } });
  const sampleVariant = await prisma.productVariant.findFirst({ where: { productId: sampleProduct.id } });

  const existingOrder = await prisma.order.findUnique({ where: { orderNumber: "SSB-2026-1001" } });
  if (!existingOrder && sampleProduct) {
    const order = await prisma.order.create({
      data: {
        orderNumber: "SSB-2026-1001",
        customerId: sampleCustomer.id,
        guestName: sampleCustomer.name,
        guestEmail: sampleCustomer.email,
        guestPhone: sampleCustomer.phone,
        status: "DELIVERED",
        subtotal: 18500,
        discountAmount: 1850,
        taxAmount: 832.5,
        shippingAmount: 0,
        totalAmount: 17482.5,
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        paymentId: "pay_test_987162543",
        couponCode: "SAUBHAGYA10",
        shippingAddressJson: JSON.stringify({
          fullName: "Pooja Singhal",
          phone: "+91 98123 45678",
          streetAddress: "House 142, Urban Estate II",
          city: "Hisar",
          state: "Haryana",
          postalCode: "125005",
        }),
        awbCode: "SR-HISAR-889102",
        courierName: "BlueDart Express",
        trackingUrl: "https://track.bluedart.com/SR-HISAR-889102",
        deliveredAt: new Date(Date.now() - 3600000 * 48),
        items: {
          create: {
            productId: sampleProduct.id,
            variantId: sampleVariant?.id,
            productName: sampleProduct.title,
            productSku: sampleProduct.sku,
            unitPrice: 18500,
            mrp: 24000,
            quantity: 1,
            totalPrice: 18500,
            imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
          },
        },
        statusHistory: {
          create: [
            { fromStatus: null, toStatus: "CONFIRMED", notes: "Payment verified successfully via Razorpay" },
            { fromStatus: "CONFIRMED", toStatus: "PROCESSING", notes: "Order dispatched to Hisar studio warehouse packing desk" },
            { fromStatus: "PROCESSING", toStatus: "SHIPPED", notes: "Handed over to BlueDart courier. AWB: SR-HISAR-889102" },
            { fromStatus: "SHIPPED", toStatus: "DELIVERED", notes: "Delivered to customer with signed receipt" },
          ],
        },
      },
    });

    // Sample Review
    await prisma.review.create({
      data: {
        productId: sampleProduct.id,
        customerId: sampleCustomer.id,
        authorName: "Pooja Singhal",
        authorEmail: "pooja.singhal@example.com",
        rating: 5,
        title: "Breathtaking Banarasi Silk!",
        comment: "The zari sheen and texture of the Katan silk is truly authentic. Received complimentary gift packaging and prompt delivery here in Hisar. Absolutely recommended for bridal trousseau!",
        verifiedPurchase: true,
        status: "APPROVED",
      },
    });
  }

  console.log("✅ Seed completed successfully with full Indian ethnic catalogue, categories, roles, and settings!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
