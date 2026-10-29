"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { WORKSPACE_COOKIE, workspaceOptions } from "@/lib/server/workspace";

export async function selectWorkspace(formData: FormData) {
  const key = String(formData.get("workspace") ?? "");
  // Only keys from the server-side allow-list are accepted.
  if (!workspaceOptions().some((o) => o.key === key)) return;
  (await cookies()).set(WORKSPACE_COOKIE, key, { path: "/", sameSite: "lax", httpOnly: true, maxAge: 60 * 60 * 24 * 365 });
  revalidatePath("/", "layout");
}
