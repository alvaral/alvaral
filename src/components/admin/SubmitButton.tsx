"use client";

import { Button, type ButtonProps } from "@/components/ui/button";

export default function SubmitButton({
  children,
  disabled,
  type = "submit",
  ...props
}: ButtonProps) {
  return (
    <Button type={type} disabled={disabled} {...props}>
      {children}
    </Button>
  );
}
