import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");
  const queryIp = searchParams.get("ip");

  // Extract real client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : realIp || "127.0.0.1";

  // Real DNS query proxy (Google DNS over HTTPS)
  if (domain) {
    try {
      const cleanDomain = domain.replace(/https?:\/\//, "").split("/")[0].trim();
      const dnsRes = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=ANY`,
        { headers: { Accept: "application/json" }, cache: "no-store" }
      );
      if (dnsRes.ok) {
        const dnsData = await dnsRes.json();
        return NextResponse.json({ success: true, domain: cleanDomain, dns: dnsData });
      }
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  // Real IP Geo proxy
  if (queryIp) {
    try {
      const target = queryIp === "self" ? clientIp : queryIp;
      // Use freeipapi or ipwho.is which are free and high-limit
      const geoRes = await fetch(`https://ipwho.is/${encodeURIComponent(target)}`, {
        cache: "no-store",
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        return NextResponse.json({ success: true, geo: geoData });
      }
    } catch (err: any) {
      // Fallback
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  // Basic headers and client IP inspection
  const headersObj: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headersObj[key] = value;
  });

  return NextResponse.json({
    success: true,
    clientIp,
    headers: headersObj,
    timestamp: new Date().toISOString(),
  });
}
