import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./fragments/Header";
import Planning from "./pages/Planning";
import Map from "./pages/Map";
import Login from "./pages/Login";
import classNames from "classnames";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./config/authContext";
import Audience from "./pages/Audience";
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
  const { user } = useAuth();
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
        {user && (
          <>
            <Route exact path="/" element={<Planning />} />
            <Route path="/map" element={<Map />} />
            <Route exact path="/audience/*" element={<Audience />} />
          </>
        )}
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
