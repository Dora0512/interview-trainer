import { cn } from "@/lib/utils";

/** Horizontally scrollable table wrapper — the page itself never scrolls sideways. */
export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn("border-b px-2 py-2 text-left text-xs font-medium whitespace-nowrap text-muted-foreground first:pl-0", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("border-b px-2 py-2 align-top tabular-nums first:pl-0", className)} {...props} />;
}
