"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "open" | "moderate" | "crowded";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let colorClass = "";
  switch (status) {
    case "open":
      colorClass = "bg-green-500 text-white";
      break;
    case "moderate":
      colorClass = "bg-amber-500 text-white";
      break;
    case "crowded":
      colorClass = "bg-red-500 text-white";
      break;
  }

  return (
    <Badge className={colorClass} data-testid="status-badge">
      {status}
    </Badge>
  );
}
