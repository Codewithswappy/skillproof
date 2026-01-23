"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded border border-neutral-300 ring-offset-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "peer-checked:bg-neutral-900 peer-checked:border-neutral-900 peer-checked:text-neutral-50",
            "dark:border-neutral-700 dark:ring-offset-neutral-950",
            "dark:peer-checked:bg-neutral-50 dark:peer-checked:border-neutral-50 dark:peer-checked:text-neutral-900",
            "cursor-pointer flex items-center justify-center transition-colors",
            className,
          )}
          onClick={() => onCheckedChange?.(!checked)}
        >
          {checked && <IconCheck className="h-3 w-3" strokeWidth={3} />}
        </div>
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
