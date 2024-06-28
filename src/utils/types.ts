import { ReactNode } from "react";

export type INavItem = {
  text: string;
  link: string;
  target: "_blank" | "_self"
}

export type IChildren = {
  children: ReactNode;
}

export type ITailwindClass = React.ComponentProps<'div'>['className'];;