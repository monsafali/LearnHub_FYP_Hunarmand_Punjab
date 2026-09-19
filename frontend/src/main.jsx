import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import toast, { Toaster } from "react-hot-toast";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthInitializer from "./components/AuthInitializer";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster position="top-right" />

     <AuthInitializer>
        <App />
      </AuthInitializer>
  </BrowserRouter>,
);
