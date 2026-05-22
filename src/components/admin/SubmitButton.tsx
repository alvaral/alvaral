"use client";

import { LoaderCircle } from "lucide-react";
import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

type SubmitButtonProps = ButtonProps & {
  pendingLabel?: string;
};

export default function SubmitButton({
  children,
  disabled,
  pendingLabel,
  type = "submit",
  onClick,
  ...props
}: SubmitButtonProps) {
  const [pending, setPending] = React.useState(false);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (type === "submit") {
      const form = event.currentTarget.form;

      if (form && !form.checkValidity()) {
        return;
      }
    }

    setPending(true);
  };

  return (
    <Button
      type={type}
      disabled={disabled || pending}
      onClick={handleClick}
      {...props}
    >
      {pending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? pendingLabel ?? children : children}
    </Button>
  );
}
