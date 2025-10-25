import { HEADER_KEYS } from "@/coreConstants";
import { parse, serialize } from "cookie";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const requestHeaders = new Headers();
  const payload = await request.json();
  requestHeaders.set(
    "Set-Cookie",
    serialize(payload.cookie.key, payload.cookie.value, payload.cookie.options)
  );
  return new Response("Success", {
    status: 200,
    headers: requestHeaders,
  });
}

export async function GET(request: NextRequest) {
  const token = parse(request.headers.get("cookie") ?? "")[
    HEADER_KEYS.ACCESS_TOKEN
  ];
  return new Response(JSON.stringify(Boolean(token)));
}
