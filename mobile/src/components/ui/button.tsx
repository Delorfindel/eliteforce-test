import React from "react";

import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/spinner";
import { UIText } from "@/components/ui/text";
import { Pressable } from "@/tw";

type ButtonProps = React.ComponentProps<typeof Pressable> & {
  className?: string;
  labelClassName?: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: React.ReactNode;
};

const buttonVariants = {
  primary: "bg-brand-clay",
  secondary: "bg-brand-mint",
  ghost: "bg-transparent border border-brand-border",
  danger: "bg-brand-danger"
} as const;

const textVariants = {
  primary: "text-white",
  secondary: "text-white",
  ghost: "text-brand-ink",
  danger: "text-white"
} as const;

export function Button({
  children,
  className,
  disabled,
  labelClassName,
  loading,
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const accessibilityLabel =
    typeof children === "string" ? children : props.accessibilityLabel;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled }}
      accessibilityRole="button"
      disabled={isDisabled}
      {...props}
      className={cn(
        "min-h-14 items-center justify-center rounded-[24px] px-5",
        buttonVariants[variant],
        isDisabled && "opacity-60",
        className
      )}
    >
      {loading ? (
        <Spinner color={variant === "ghost" ? "#182328" : "#ffffff"} />
      ) : (
        <UIText
          className={cn(
            "text-base font-semibold",
            textVariants[variant],
            labelClassName
          )}
        >
          {children}
        </UIText>
      )}
    </Pressable>
  );
}
