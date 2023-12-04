import clsx from "clsx";
import { ComponentProps } from "react";

export type CardProps = ComponentProps<"div">;

const Card = ({ className, ...props }: CardProps) => {
  return (
    <div {...props} className={clsx("bg-light-30 rounded-lg", className)} />
  );
};

export default Card;
