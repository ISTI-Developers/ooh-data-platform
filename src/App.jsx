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
import { AuthProvider, useAuth } from "~config/authContext";
import Cookies from "js-cookie";
import { Alert } from "flowbite-react";
import { RiInformationFill } from "react-icons/ri";
import { useEffect } from "react";
import Posts from "~pages/Posts";
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
  const { alert, setAlert } = useAuth();
  useEffect(() => {
    if (alert.isOn) {
      setTimeout(() => {
        setAlert({
          isOn: false,
          type: "info",
          message: "",
        });
      }, 3000);
    }
  }, [alert, setAlert]);

  return (
    <>
      <div
        className={classNames(
          "bg-default h-full min-h-[calc(100vh_-_100px)] p-4 xl:px-20 2xl:px-40 flex flex-col gap-4 relative",
          ["/login", "/register"].includes(location.pathname)
            ? "justify-center"
            : ""
        )}
      >
        {alert.isOn && (
          <Alert
            icon={RiInformationFill}
            color={alert.type}
            onDismiss={() =>
              setAlert({
                isOn: false,
                type: "info",
                message: "",
              })
            }
            className="absolute top-[10%] left-[50%] translate-x-[-50%] animate-fade-fr-t"
          >
            <span>
              <p className="w-[300px] text-center">{alert.message}</p>
            </span>
          </Alert>
        )}
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route exact path="/" element={<Planning />} />
            <Route path="/map" element={<Map />} />
            <Route path="/audience/*" element={<Audience />} />
            <Route path="/test/*" element={<Posts />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

function ProtectedRoutes() {
  const isAuthenticated = Cookies.get("user");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default App;
