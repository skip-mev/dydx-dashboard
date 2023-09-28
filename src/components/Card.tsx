import { ComponentProps } from "react";

export type CardProps = ComponentProps<"div">;

const Card = ({ className, ...props }: CardProps) => {
  return <div className={`bg-light-3 rounded-lg ${className}`} {...props} />;
};

export default Card;
