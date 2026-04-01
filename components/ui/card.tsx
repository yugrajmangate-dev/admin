import React from "react";

export const Card = React.forwardRef<HTMLDivElement, any>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  }
);
Card.displayName = "Card";
