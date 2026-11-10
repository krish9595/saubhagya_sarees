import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [variants, movements] = await Promise.all([
      prisma.productVariant.findMany({
        include: {
          product: {
            select: { id: true, title: true, sku: true },
          },
          inventories: true,
        },
        orderBy: { stockQuantity: "asc" },
      }),
      prisma.inventoryMovement.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: {
          createdByUser: { select: { name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({ success: true, variants, movements });
  } catch (error) {
    console.error("Inventory fetch error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { variantId, changeDelta, notes, changeType = "ADJUSTMENT" } = await req.json();

    if (!variantId || typeof changeDelta !== "number") {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json({ success: false, message: "Variant not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedVariant = await tx.productVariant.update({
        where: { id: variantId },
        data: {
          stockQuantity: { increment: changeDelta },
        },
      });

      // Update or create inventory record
      await tx.inventory.upsert({
        where: {
          productId_variantId: {
            productId: variant.productId,
            variantId: variant.id,
          },
        },
        update: {
          quantity: updatedVariant.stockQuantity,
        },
        create: {
          productId: variant.productId,
          variantId: variant.id,
          quantity: updatedVariant.stockQuantity,
        },
      });

      // Record movement log
      await tx.inventoryMovement.create({
        data: {
          productId: variant.productId,
          variantId: variant.id,
          changeType,
          quantityDelta: changeDelta,
          balanceAfter: updatedVariant.stockQuantity,
          notes: notes || `Manual stock adjustment (${changeDelta > 0 ? `+${changeDelta}` : changeDelta})`,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Inventory",
          entityId: variant.id,
          details: `Stock adjustment for ${variant.product.title} (${variant.sku}): ${changeDelta > 0 ? `+${changeDelta}` : changeDelta} units. Balance: ${updatedVariant.stockQuantity}.`,
        },
      });

      return updatedVariant;
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Inventory update error:", error);
    return NextResponse.json({ success: false, message: "Failed to adjust inventory" }, { status: 500 });
  }
}
