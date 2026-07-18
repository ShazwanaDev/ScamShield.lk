import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
