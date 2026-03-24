import React from "react";

import { cn } from "@/lib/cn";
import { Text as BaseText } from "@/tw";

type UITextProps = React.ComponentProps<typeof BaseText> & {
  className?: string;
};

export function UIText({ className, ...props }: UITextProps) {
  return (
    <BaseText
      selectable
      {...props}
      className={cn("font-inter text-base text-brand-ink", className)}
    />
  );
}

export function Heading({ className, ...props }: UITextProps) {
  return (
    <UIText
      {...props}
      className={cn("font-inter text-3xl font-semibold text-brand-ink", className)}
    />
  );
}

export function MutedText({ className, ...props }: UITextProps) {
  return <UIText {...props} className={cn("text-brand-ink-soft", className)} />;
}
