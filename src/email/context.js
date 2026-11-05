import { createContext, useContext } from "react";

// labels: variable name -> catalog label, used to draw the chips.
export const EditorContext = createContext({ labels: {} });
export const useEditorContext = () => useContext(EditorContext);
