import { createContext } from "react";

const HoverCapable = createContext(window.matchMedia("(hover: hover)").matches);

export default HoverCapable;
