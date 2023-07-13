import { FC, PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
  className?: string;
}

const Card: FC<CardProps> = ({ children, className }) => {
  return <div className={`bg-light-3 rounded-lg ${className}`}>{children}</div>;
};

export default Card;
