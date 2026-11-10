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
      initialStock = 10,
    } = body;

    if (!title || !sku || !price || !categoryId) {
      return NextResponse.json({ success: false, message: "Missing required product details" }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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
          status: "PUBLISHED",
          isNewArrival: true,
          images: {
            create: {
              url: imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
              alt: title,
              isPrimary: true,
            },
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
        include: { variants: true },
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
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ success: false, message: "Failed to create product" }, { status: 500 });
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
