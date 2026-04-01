import React from "react";

export const Button = React.forwardRef<HTMLButtonElement, any>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />;
  }
);
Button.displayName = "Button";
