import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { StoreProvider } from "./state/store";
import { Layout } from "./components/Layout";
import { OverviewPage } from "./pages/Overview";
import { ProgramsPage } from "./pages/Programs";
import { UniversitiesPage } from "./pages/Universities";
import { UniversityPage } from "./pages/University";
import { ProgramPage } from "./pages/Program";
import { CountriesPage, CountryPage } from "./pages/Country";
import { CalendarPage } from "./pages/Calendar";
import { RankingsPage } from "./pages/Rankings";
import { BlockedAccountPage, ScholarshipPage, ScholarshipsPage } from "./pages/Scholarships";
import { ProfilePage } from "./pages/Profile";
import { ComparePage } from "./pages/Compare";
import { TrackerPage } from "./pages/Tracker";
import { NotFound } from "./pages/NotFound";
import { ErrorPage } from "./pages/ErrorPage";
import "./styles/base.css";
import "./styles/app.css";

// Hash routing works for local files, static hosting and single-file publishing alike.
const router = createHashRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <OverviewPage /> },
      { path: "/programlar", element: <ProgramsPage /> },
      { path: "/okullar", element: <UniversitiesPage /> },
      { path: "/okul/:id", element: <UniversityPage /> },
      { path: "/program/:uni/:prog", element: <ProgramPage /> },
      { path: "/ulkeler", element: <CountriesPage /> },
      { path: "/ulke/:code", element: <CountryPage /> },
      { path: "/burslar", element: <ScholarshipsPage /> },
      { path: "/burslar/bloke-hesap", element: <BlockedAccountPage /> },
      { path: "/burs/:id", element: <ScholarshipPage /> },
      { path: "/takvim", element: <CalendarPage /> },
      { path: "/rankingler", element: <RankingsPage /> },
      { path: "/profil", element: <ProfilePage /> },
      { path: "/karsilastir", element: <ComparePage /> },
      { path: "/takip", element: <TrackerPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>,
);
