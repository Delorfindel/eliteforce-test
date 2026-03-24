import React from "react";

import { cn } from "@/lib/cn";
import { TextInput } from "@/tw";

type InputProps = React.ComponentProps<typeof TextInput> & {
  className?: string;
};

export function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      placeholderTextColor="#A3A3A3"
      {...props}
      className={cn(
        "min-h-14 rounded-full border border-brand-border bg-white px-4 text-base text-brand-ink",
        className
      )}
    />
  );
}
