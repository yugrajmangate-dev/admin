import { NextResponse } from "next/server";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { restaurants } from "@/lib/restaurants";

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: "No DB" }, { status: 500 });
  }

  let count = 0;
  try {
    for (const rest of restaurants) {
      await setDoc(doc(db, "restaurants", rest.id), rest);
      count++;
    }
    return NextResponse.json({ message: `Successfully seeded ${count} restaurants.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
