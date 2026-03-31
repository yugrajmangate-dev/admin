import { NextResponse } from "next/server";
import { updateRestaurantTour } from "@/lib/platform-db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const res = await updateRestaurantTour(params.id, data);
  if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(res);
}
