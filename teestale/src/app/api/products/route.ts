import { NextResponse } from "next/server";
import { products } from "../../../productsData";

const successHeaders = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  "X-Content-Type-Options": "nosniff",
};

export const revalidate = 60;

export function GET() {
  try {
    return NextResponse.json({ products }, { headers: successHeaders });
  } catch (error) {
    console.error("Failed to serve the TeesTale product catalog.", error);
    return NextResponse.json(
      { error: "The product catalog could not be loaded." },
      { status: 500, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
    );
  }
}
