import { NextResponse } from "next/server";
import { listPlatformRestaurants } from "@/lib/platform-db";

export async function GET() {
  const restaurants = await listPlatformRestaurants();
  return NextResponse.json(restaurants);
}
