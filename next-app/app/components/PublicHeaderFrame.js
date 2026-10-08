import { cloneElement, isValidElement } from "react";

export default function PublicHeaderFrame({ children }) {
  const framedChild = isValidElement(children) ? cloneElement(children, { withinFrame: true }) : children;
  return <div className="public-header-frame">{framedChild}</div>;
}
