import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DepotProvider } from "./context/DepotContext";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import AlertPage from "./pages/AlertPage";
import CostComparison from "./pages/CostComparison";
import History from "./pages/History";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <DepotProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/alert" element={<AlertPage />} />
            <Route path="/cost-comparison" element={<CostComparison />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DepotProvider>
  );
}
