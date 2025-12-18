import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Compare } from "./pages/Compare";
import { News } from "./pages/News";
import { Pricing } from "./pages/Pricing";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/comparer", element: <Compare /> },
  { path: "/actualites", element: <News /> },
  { path: "/tarifs", element: <Pricing /> }
]);
