import { NextResponse } from "next/server";
import { listPlatformRestaurants, createRestaurant } from "@/lib/platform-db";

export async function GET() {
  const restaurants = await listPlatformRestaurants();
  return NextResponse.json(restaurants);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newRestaurant = await createRestaurant(data);
    return NextResponse.json(newRestaurant);
  } catch (error) {
    console.error("Failed to create restaurant:", error);
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 });
  }
}
