import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import "../src/theme/theme.css";
import "./index.css";
import Catalogo from "./Catalogo.jsx";

createRoot(document.getElementById("root")).render(
  <MemoryRouter>
    <Catalogo />
  </MemoryRouter>,
);
