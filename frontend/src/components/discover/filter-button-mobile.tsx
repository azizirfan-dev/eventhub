"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onClick: () => void;
}

export function FilterButtonMobile({ onClick }: Props) {
  return (
    <Button
      size="sm"
      variant="outline"
      className="lg:hidden rounded-full"
      onClick={onClick}
    >
      <Filter className="h-4 w-4 mr-1" />
      Filters
    </Button>
  );
}
