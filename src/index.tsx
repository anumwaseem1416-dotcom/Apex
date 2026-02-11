import "./index.css";
import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { SpeedInsights } from "@vercel/speed-insights/react";

render(
  <>
    <App />
    <SpeedInsights />
  </>,
  document.getElementById("root")
);
