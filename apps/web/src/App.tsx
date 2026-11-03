import { Link, Route, Routes } from "react-router-dom";
import { TicketListPage } from "./pages/TicketListPage";
import { TicketDetailPage } from "./pages/TicketDetailPage";
import { NewTicketPage } from "./pages/NewTicketPage";

export function App() {
  return (
    <div className="layout">
      <header className="topbar">
        <Link to="/" className="brand">Ticketly</Link>
        <nav>
          <Link to="/tickets/new" className="btn">New ticket</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<TicketListPage />} />
          <Route path="/tickets/new" element={<NewTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
