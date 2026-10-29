"use client";

import { useRef } from "react";
import { selectWorkspace } from "@/app/actions";

export function WorkspaceSwitcher({
  options,
  current,
  label,
}: {
  options: { key: string; label: string }[];
  current: string;
  label: string;
}) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={selectWorkspace} className="min-w-0">
      <label className="sr-only" htmlFor="workspace">
        {label}
      </label>
      <select
        id="workspace"
        name="workspace"
        defaultValue={current}
        onChange={() => form.current?.requestSubmit()}
        className="h-8 w-full max-w-64 truncate rounded-md border bg-card px-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </form>
  );
}
