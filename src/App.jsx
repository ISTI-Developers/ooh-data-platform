import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import classNames from "classnames";
import Header from "~fragments/Header";
import Map from "~pages/Map";
import Login from "~pages/Login";
import Planning from "~pages/Planning";
import Register from "~pages/Register";
import Audience from "~pages/Audience";
import { AuthProvider } from "~config/authContext";
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Header />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </>
  );
}
function AppRoutes() {
  const location = useLocation();
  return (
    <div
      className={classNames(
        "bg-default h-full min-h-[calc(100vh_-_75px)] p-4 xl:px-20 2xl:px-40 flex flex-col gap-4 relative",
        ["/login", "/register"].includes(location.pathname)
          ? "justify-center"
          : ""
      )}
    >
      <Routes>
        <Route path="/" element={<Planning />} />
        <Route path="/map" element={<Map />} />
        <Route path="/audience/*" element={<Audience />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
