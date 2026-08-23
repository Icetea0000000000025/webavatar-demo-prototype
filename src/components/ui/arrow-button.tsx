import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ArrowButtonProps extends ButtonProps {
  direction?: "right" | "left";
  position?: "left" | "right";
}

export const ArrowButton = React.forwardRef<HTMLButtonElement, ArrowButtonProps>(
  (
    {
      children,
      direction = "right",
      position = "right",
      className,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const arrow = (
      <ArrowRight
        data-icon={position === "left" ? "inline-start" : "inline-end"}
        className={cn(
          "transition-transform duration-200 size-4 shrink-0",
          direction === "left" && "-scale-x-100",
          direction === "left"
            ? "group-hover/button:-translate-x-1"
            : "group-hover/button:translate-x-1"
        )}
      />
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
      return (
        <Button
          ref={ref}
          asChild
          className={cn("group/button inline-flex items-center gap-1.5", className)}
          {...props}
        >
          {React.cloneElement(child, {
            className: cn("group/button inline-flex items-center justify-center gap-1.5", child.props.className),
            children: (
              <>
                {position === "left" && arrow}
                {child.props.children}
                {position === "right" && arrow}
              </>
            ),
          })}
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        asChild={asChild}
        className={cn("group/button inline-flex items-center gap-1.5", className)}
        {...props}
      >
        {position === "left" && arrow}
        {children}
        {position === "right" && arrow}
      </Button>
    );
  }
);
ArrowButton.displayName = "ArrowButton";

export default ArrowButton;
