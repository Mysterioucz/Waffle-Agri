import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmId = searchParams.get("farmId");

    if (!farmId) {
      return NextResponse.json(
        { success: false, error: "farmId is required" },
        { status: 400 }
      );
    }

    const crops = await prisma.crop.findMany({
      where: { farmId },
      include: {
        farm: {
          select: {
            name: true,
            location: true,
          },
        },
        _count: {
          select: {
            activities: true,
          },
        },
      },
      orderBy: { plantingDate: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: crops,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Crops API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch crops",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      farmId,
      name,
      variety,
      plantingDate,
      expectedHarvest,
      area,
      status,
      healthScore,
    } = body;

    const crop = await prisma.crop.create({
      data: {
        farmId,
        name,
        variety,
        plantingDate: new Date(plantingDate),
        expectedHarvest: new Date(expectedHarvest),
        area,
        status: status || "PLANTED",
        healthScore: healthScore || 100,
      },
    });

    return NextResponse.json({
      success: true,
      data: crop,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Crop creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create crop",
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}
