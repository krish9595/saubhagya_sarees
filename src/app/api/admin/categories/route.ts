import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, image, bannerImage, displayOrder = 0, isActive = true } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 });
    }

    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        description: description ? description.trim() : null,
        image: image || null,
        bannerImage: bannerImage || null,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isActive: !!isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Category",
        entityId: category.id,
        details: `Created category: ${category.name} (/shop/${category.slug}).`,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Category create error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, slug, description, image, bannerImage, displayOrder, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Category ID required" }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    const cleanSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : existing.slug;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        slug: cleanSlug,
        description: description !== undefined ? description : existing.description,
        image: image !== undefined ? image : existing.image,
        bannerImage: bannerImage !== undefined ? bannerImage : existing.bannerImage,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : existing.displayOrder,
        isActive: isActive !== undefined ? !!isActive : existing.isActive,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Category",
        entityId: id,
        details: `Updated category: ${updated.name}.`,
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    console.error("Category update error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Category ID required" }, { status: 400 });
    }

    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Cannot delete category because ${productCount} products are assigned to it. Reassign products first.`,
      }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    console.error("Category delete error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete category" }, { status: 500 });
  }
}
