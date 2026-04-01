import { NextResponse } from "next/server";
import { updateRestaurantTour } from "@/lib/platform-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const res = await updateRestaurantTour(id, data);
  if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(res);
}
