"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    const [checked, setChecked] = React.useState(props.checked || props.defaultChecked || false);

    React.useEffect(() => {
      if (props.checked !== undefined) {
        setChecked(props.checked as boolean);
      }
    }, [props.checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setChecked(newChecked);
      onCheckedChange?.(newChecked);
      props.onChange?.(e);
    };

    return (
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          ref={ref}
          className="peer h-5 w-5 opacity-0 absolute z-10 cursor-pointer"
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 rounded-md border-2 border-primary bg-transparent transition-all duration-200 peer-checked:bg-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            className
          )}
        >
          <Check
            className={cn(
              "h-4 w-4 text-white transition-opacity duration-200",
              checked ? "opacity-100" : "opacity-0"
            )}
            strokeWidth={4}
          />
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
