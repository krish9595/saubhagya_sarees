import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { reviewId, status } = await req.json();
    if (!reviewId || !status) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json({ success: false, message: "Failed to update review" }, { status: 500 });
  }
}
