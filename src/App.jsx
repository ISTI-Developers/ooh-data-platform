import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import classNames from "classnames";
import Header from "~fragments/Header";
import Map from "~pages/Map";
import Login from "~pages/Login";
import Planning from "~pages/Planning";
import Register from "~pages/Register";
import Audience from "~pages/Audience";
import { AuthProvider } from "~config/authContext";
import Cookies from "js-cookie";
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
        "bg-default h-full min-h-[calc(100vh_-_100px)] p-4 xl:px-20 2xl:px-40 flex flex-col gap-4 relative",
        ["/login", "/register"].includes(location.pathname)
          ? "justify-center"
          : ""
      )}
    >
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/" element={<Planning />} />
          <Route path="/map" element={<Map />} />
          <Route path="/audience/*" element={<Audience />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

function ProtectedRoutes() {
  const isAuthenticated = Cookies.get("user");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default App;
