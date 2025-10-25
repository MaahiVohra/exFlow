import { HEADER_KEYS } from "@/coreConstants";
import { SerializeOptions } from "cookie";

export async function setTokenCookie(authToken: AuthToken) {
  await updateTokenCookie(authToken.token, {
    httpOnly: true,
    secure: true,
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    maxAge: authToken.expiresIn,
    sameSite: "lax",
    path: "/",
  });
}

async function updateTokenCookie(value: string, options: SerializeOptions) {
  await fetch("/api/cookie", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cookie: {
        key: HEADER_KEYS.ACCESS_TOKEN,
        value,
        options,
      },
    }),
  });
}

export async function clearTokenCookie() {
  return await updateTokenCookie("", {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_APP_ENV !== "development",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    maxAge: -1,
    sameSite: "lax",
    path: "/",
  });
}
