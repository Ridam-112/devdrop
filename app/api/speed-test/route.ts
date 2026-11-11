import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Endpoint to measure real download latency and bandwidth
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = Math.min(
    Math.max(parseInt(searchParams.get("bytes") || "4000000", 10), 100000),
    15000000
  ); // Default 4MB, clamped between 100KB and 15MB

  // Generate deterministic chunk buffer
  const buffer = new Uint8Array(size);
  for (let i = 0; i < size; i += 1024) {
    buffer[i] = (i * 31) % 256;
  }

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": size.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

// Endpoint to measure real upload bandwidth
export async function POST(request: NextRequest) {
  try {
    const blob = await request.blob();
    const bytesReceived = blob.size;
    return NextResponse.json({
      success: true,
      bytesReceived,
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to read payload" }, { status: 400 });
  }
}

// Fast ping latency probe
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache",
    },
  });
}
