import type { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export function InfoTooltip({ content, children, className }: InfoTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger render={<span className={cn("cursor-pointer", className)} />}>
        {children}
      </PopoverTrigger>
      <PopoverContent side="top" align="center" className="max-w-64 p-2.5 text-xs">
        {content}
      </PopoverContent>
    </Popover>
  );
}
