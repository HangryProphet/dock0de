import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.tsx";

const theme = createTheme({
  fontFamily: "Manrope, Sora, Noto Sans, Segoe UI, sans-serif",
  primaryColor: "brand",
  primaryShade: 6,
  radius: {
    xs: "8px",
    sm: "10px",
    md: "12px",
    lg: "14px",
    xl: "16px",
  },
  defaultRadius: "lg",
  colors: {
    brand: [
      "#EEF0FF",
      "#E0E4FF",
      "#C1C8F7",
      "#A1A9E6",
      "#7F86D4",
      "#5B64B8",
      "#2E3A8C",
      "#29347E",
      "#232D6F",
      "#1D2368",
    ],
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>
);
