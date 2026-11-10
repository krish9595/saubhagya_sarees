import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateMedia() {
  console.log("💎 Updating Saubhagya Sarees imagery to 100% relatable luxury Indian ethnic fashion...");

  // 1. Homepage CMS Sections
  const heroSection = {
    tagline: "Saubhagya Bridal Studio • Hisar",
    headline: "Elegance Woven in Tradition",
    subheadline: "Discover timeless sarees, exquisite bridal ensembles and thoughtfully curated ethnic fashion for every celebration.",
    cta1Text: "Explore Collections",
    cta1Link: "/shop",
    cta2Text: "Discover Bridal",
    cta2Link: "/shop/bridal",
    desktopImage: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&w=1920&q=85",
    mobileImage: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&w=1080&q=80",
  };

  await prisma.homepageSection.upsert({
    where: { sectionKey: "hero_section" },
    update: { contentJson: JSON.stringify(heroSection) },
    create: {
      sectionKey: "hero_section",
      title: "Hero Campaign",
      contentJson: JSON.stringify(heroSection),
      displayOrder: 2,
    },
  });

  const bridalFeature = {
    eyebrow: "THE BRIDAL SUITE",
    headline: "For Moments That Become Memories",
    description: "Discover exquisite bridal and wedding occasionwear, thoughtfully curated for your most special celebrations.",
    ctaText: "Discover Bridal Collection",
    ctaLink: "/shop/bridal",
    bannerImage: "https://images.unsplash.com/photo-1610047614256-023d7c028d0b?auto=format&fit=crop&w=1600&q=85",
  };

  await prisma.homepageSection.upsert({
    where: { sectionKey: "bridal_feature" },
    update: { contentJson: JSON.stringify(bridalFeature) },
    create: {
      sectionKey: "bridal_feature",
      title: "Bridal Editorial Spotlight",
      contentJson: JSON.stringify(bridalFeature),
      displayOrder: 3,
    },
  });

  // 2. Categories with 100% matched imagery
  const categoryUpdates = [
    { slug: "sarees", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80" },
    { slug: "bridal", image: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&w=1000&q=80" },
    { slug: "non-bridal", image: "https://images.unsplash.com/photo-1654764746225-e63f5e90facd?auto=format&fit=crop&w=1000&q=80" },
    { slug: "suits", image: "https://images.unsplash.com/photo-1756483509177-bbabd67a3234?auto=format&fit=crop&w=1000&q=80" },
    { slug: "kurtis", image: "https://images.unsplash.com/photo-1760287363699-a08d553fb8a9?auto=format&fit=crop&w=1000&q=80" },
    { slug: "dresses", image: "https://images.unsplash.com/photo-1708534246051-7f47b279e94b?auto=format&fit=crop&w=1000&q=80" },
    { slug: "festive", image: "https://images.unsplash.com/photo-1589734750443-06dbd51c0447?auto=format&fit=crop&w=1000&q=80" },
    { slug: "new-arrivals", image: "https://images.unsplash.com/photo-1604309232579-57b2a96dc946?auto=format&fit=crop&w=1000&q=80" },
  ];

  for (const c of categoryUpdates) {
    await prisma.category.updateMany({
      where: { slug: c.slug },
      data: { image: c.image },
    });
  }

  // 3. Products with 100% matched color, fabric, and garment imagery
  const productMediaUpdates = [
    {
      slug: "royal-crimson-zardozi-velvet-bridal-lehenga",
      images: [
        "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1610047614256-023d7c028d0b?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "handwoven-royal-banarasi-katan-silk-saree",
      images: [
        "https://images.unsplash.com/photo-1604309232579-57b2a96dc946?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1610189338344-f3ce0d0f6d06?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "ethereal-pastel-organza-saree-pitta-work",
      images: [
        "https://images.unsplash.com/photo-1616756141603-6d37d5cde2a2?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1594761253360-2a487accc7bc?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "royal-emerald-chanderi-anarkali-suit-set",
      images: [
        "https://images.unsplash.com/photo-1756483509177-bbabd67a3234?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1596706487679-9f95f5891975?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "mustard-georgette-sharara-set-mirror-gotta",
      images: [
        "https://images.unsplash.com/photo-1589734750443-06dbd51c0447?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1574847872646-abff244bbd87?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "deep-wine-georgette-drape-saree-gown",
      images: [
        "https://images.unsplash.com/photo-1708534246051-7f47b279e94b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1708534246055-d7b149acb731?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "navy-blue-silk-straight-kurti-zari",
      images: [
        "https://images.unsplash.com/photo-1760287363699-a08d553fb8a9?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1760287364219-160c234ded00?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "rani-pink-kanjeevaram-pure-gold-zari-saree",
      images: [
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?auto=format&fit=crop&w=1000&q=80",
      ],
    },
  ];

  for (const item of productMediaUpdates) {
    const prod = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (prod) {
      await prisma.productImage.deleteMany({ where: { productId: prod.id } });
      let idx = 0;
      for (const url of item.images) {
        await prisma.productImage.create({
          data: {
            productId: prod.id,
            url,
            alt: `${prod.title} view ${idx + 1}`,
            displayOrder: idx,
            isPrimary: idx === 0,
          },
        });
        idx++;
      }
      console.log(`Updated images for product: ${prod.title}`);
    }
  }

  console.log("✅ All media successfully updated with 100% relatable luxury Indian ethnic fashion imagery!");
}

updateMedia()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
