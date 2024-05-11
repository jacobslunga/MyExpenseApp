import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createFactory, createMiddleware } from "hono/factory";

const authDomain = process.env.KINDE_DOMAIN!;
const clientId = process.env.KINDE_CLIENT_ID!;
const clientSecret = process.env.KINDE_CLIENT_SECRET!;
const redirectURL = process.env.KINDE_REDIRECT_URI!;
const logoutRedirectURL = process.env.KINDE_LOGOUT_REDIRECT_URI!;

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain,
    clientId,
    clientSecret,
    redirectURL,
    logoutRedirectURL,
  }
);

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    } as const;
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const isAuthenticated = await kindeClient.isAuthenticated(
      sessionManager(c)
    );
    if (!isAuthenticated) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user = await kindeClient.getUserProfile(sessionManager(c));
    c.set("user", user);
    await next();
  } catch (error) {
    console.error(error);
    return c.json({ error: "Unauthorized" }, 401);
  }
});
