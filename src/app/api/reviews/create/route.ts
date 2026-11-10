import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { productId, authorName, rating, comment } = await req.json();

    if (!productId || !authorName || !comment) {
      return NextResponse.json({ success: false, message: "Missing required review fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        authorName: authorName.trim(),
        rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
        comment: comment.trim(),
        status: "APPROVED", // published with moderation capability in admin
      },
    });

    // Update product rating and review count
    const allReviews = await prisma.review.findMany({
      where: { productId, status: "APPROVED" },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ success: false, message: "Failed to submit review" }, { status: 500 });
  }
}
