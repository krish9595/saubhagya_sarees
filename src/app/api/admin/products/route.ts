import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Fetch admin products error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      sku,
      price,
      mrp,
      categoryId,
      fabric,
      occasion,
      primaryColor,
      description,
      shortDescription,
      imageUrl,
      images,
      initialStock = 10,
      isNewArrival = true,
      isBestseller = false,
      isFeatured = false,
      status = "PUBLISHED",
    } = body;

    if (!title || !sku || !price || !categoryId) {
      return NextResponse.json({ success: false, message: "Missing required product details" }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Prepare images array
    let imagesToCreate: { url: string; alt?: string; isPrimary: boolean; displayOrder: number }[] = [];
    if (Array.isArray(images) && images.length > 0) {
      imagesToCreate = images.map((img: any, idx: number) => ({
        url: typeof img === "string" ? img : img.url,
        alt: typeof img === "string" ? title : img.alt || title,
        isPrimary: typeof img === "string" ? idx === 0 : !!img.isPrimary,
        displayOrder: idx,
      }));
    } else if (imageUrl) {
      imagesToCreate = [{
        url: imageUrl,
        alt: title,
        isPrimary: true,
        displayOrder: 0,
      }];
    } else {
      imagesToCreate = [{
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
        alt: title,
        isPrimary: true,
        displayOrder: 0,
      }];
    }

    const product = await prisma.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          title: title.trim(),
          slug: cleanSlug,
          sku: sku.trim().toUpperCase(),
          price: parseFloat(price),
          mrp: parseFloat(mrp || price),
          categoryId,
          fabric: fabric || null,
          occasion: occasion || null,
          primaryColor: primaryColor || null,
          description: description || title,
          shortDescription: shortDescription || null,
          status: status || "PUBLISHED",
          isNewArrival: !!isNewArrival,
          isBestseller: !!isBestseller,
          isFeatured: !!isFeatured,
          images: {
            create: imagesToCreate,
          },
          variants: {
            create: {
              title: "Standard Free Size",
              sku: `${sku.trim().toUpperCase()}-FREE`,
              size: "Free Size",
              stockQuantity: parseInt(initialStock, 10) || 10,
            },
          },
        },
        include: { variants: true, images: true },
      });

      // Initialize inventory record
      await tx.inventory.create({
        data: {
          productId: p.id,
          variantId: p.variants[0]?.id,
          quantity: parseInt(initialStock, 10) || 10,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          action: "CREATE",
          entity: "Product",
          entityId: p.id,
          details: `Admin added new product: ${title} (SKU: ${sku}).`,
        },
      });

      return p;
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      sku,
      price,
      mrp,
      categoryId,
      fabric,
      occasion,
      primaryColor,
      description,
      shortDescription,
      status,
      isNewArrival,
      isBestseller,
      isFeatured,
      images,
      imageUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID required for update" }, { status: 400 });
    }

    // Verify product exists
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    const cleanSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : existing.slug;

    await prisma.$transaction(async (tx) => {
      // 1. Update main product fields
      await tx.product.update({
        where: { id },
        data: {
          title: title !== undefined ? title.trim() : existing.title,
          slug: cleanSlug,
          sku: sku !== undefined ? sku.trim().toUpperCase() : existing.sku,
          price: price !== undefined ? parseFloat(price) : existing.price,
          mrp: mrp !== undefined ? parseFloat(mrp) : existing.mrp,
          categoryId: categoryId || existing.categoryId,
          fabric: fabric !== undefined ? fabric : existing.fabric,
          occasion: occasion !== undefined ? occasion : existing.occasion,
          primaryColor: primaryColor !== undefined ? primaryColor : existing.primaryColor,
          description: description !== undefined ? description : existing.description,
          shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
          status: status !== undefined ? status : existing.status,
          isNewArrival: isNewArrival !== undefined ? !!isNewArrival : existing.isNewArrival,
          isBestseller: isBestseller !== undefined ? !!isBestseller : existing.isBestseller,
          isFeatured: isFeatured !== undefined ? !!isFeatured : existing.isFeatured,
        },
      });

      // 2. Update images if supplied
      if (images !== undefined || imageUrl !== undefined) {
        let newImages: { url: string; alt?: string; isPrimary: boolean; displayOrder: number }[] = [];

        if (Array.isArray(images) && images.length > 0) {
          newImages = images.map((img: any, idx: number) => ({
            url: typeof img === "string" ? img : img.url,
            alt: typeof img === "string" ? (title || existing.title) : img.alt || (title || existing.title),
            isPrimary: typeof img === "string" ? idx === 0 : !!img.isPrimary,
            displayOrder: idx,
          }));
        } else if (imageUrl) {
          newImages = [{
            url: imageUrl,
            alt: title || existing.title,
            isPrimary: true,
            displayOrder: 0,
          }];
        }

        if (newImages.length > 0) {
          // Delete old images and recreate
          await tx.productImage.deleteMany({ where: { productId: id } });
          await tx.productImage.createMany({
            data: newImages.map((img) => ({
              productId: id,
              url: img.url,
              alt: img.alt,
              isPrimary: img.isPrimary,
              displayOrder: img.displayOrder,
            })),
          });
        }
      }

      // 3. Audit log
      await tx.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Product",
          entityId: id,
          details: `Admin updated product details for: ${title || existing.title}`,
        },
      });
    });

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });

    await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entity: "Product",
        entityId: id,
        details: `Admin deleted product ID: ${id}.`,
      },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
