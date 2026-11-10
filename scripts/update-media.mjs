import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateMedia() {
  console.log("💎 Updating Saubhagya Sarees imagery to verified luxury Indian ethnic fashion...");

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
    bannerImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85",
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

  // 2. Categories
  const categoryUpdates = [
    { slug: "sarees", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80" },
    { slug: "bridal", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80" },
    { slug: "non-bridal", image: "https://images.unsplash.com/photo-1654764746225-e63f5e90facd?auto=format&fit=crop&w=1000&q=80" },
    { slug: "suits", image: "https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?auto=format&fit=crop&w=1000&q=80" },
    { slug: "kurtis", image: "https://images.unsplash.com/photo-1597983073540-684a10b15ab1?auto=format&fit=crop&w=1000&q=80" },
    { slug: "dresses", image: "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=1000&q=80" },
    { slug: "festive", image: "https://images.unsplash.com/photo-1587271315307-eaebc181c749?auto=format&fit=crop&w=1000&q=80" },
    { slug: "new-arrivals", image: "https://images.unsplash.com/photo-1610047614301-13c63f00c032?auto=format&fit=crop&w=1000&q=80" },
  ];

  for (const c of categoryUpdates) {
    await prisma.category.updateMany({
      where: { slug: c.slug },
      data: { image: c.image },
    });
  }

  // 3. Product Images
  const productMediaUpdates = [
    {
      slug: "royal-banarasi-katan-silk-saree",
      images: [
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1609748340041-f5d61e061ebc?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "royal-crimson-zardozi-velvet-bridal-lehenga",
      images: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1610047520958-b42ebcd2f6cb?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "ethereal-pastel-organza-saree-with-gotta-patti",
      images: [
        "https://images.unsplash.com/photo-1616756141603-6d37d5cde2a2?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1609748340041-f5d61e061ebc?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "royal-emerald-chanderi-anarkali-suit-set",
      images: [
        "https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1597983073750-16f5ded1321f?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "mustard-georgette-sharara-set-mirror-gotta",
      images: [
        "https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1597983073540-684a10b15ab1?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "deep-wine-georgette-drape-saree-gown",
      images: [
        "https://images.unsplash.com/photo-1622207691293-5cd80466dab3?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1654764746225-e63f5e90facd?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "navy-blue-tussar-silk-straight-kurti",
      images: [
        "https://images.unsplash.com/photo-1597983073540-684a10b15ab1?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1667665970124-2273c6ef3489?auto=format&fit=crop&w=1000&q=80",
      ],
    },
    {
      slug: "rani-pink-kanjeevaram-pure-gold-zari-saree",
      images: [
        "https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80",
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
    }
  }

  console.log("✅ All media successfully updated with authentic luxury Indian ethnic fashion imagery!");
}

updateMedia()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
