import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import { RiInformationFill } from "react-icons/ri";
import { Alert } from "flowbite-react";
import Cookies from "js-cookie";
import classNames from "classnames";
import Header from "~fragments/Header";
import Map from "~pages/Map";
import Login from "~pages/Login";
import Planning from "~pages/Planning";
import Register from "~pages/Register";
import Audience from "~pages/Audience";
import { AuthProvider, useAuth } from "~config/authContext";
import ForgotPassword from "~pages/ForgotPassword";
import PasswordRecovery from "~pages/PasswordRecovery";

// Main App Component
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

// AppRoutes Component handles top-level routing and layout
function AppRoutes() {
  const location = useLocation();
  const { alert, setAlert, CheckPermission } = useAuth();
  // const { CheckPermission } = useFunction();

  // Auto-dismiss alert after 3 seconds
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
          "bg-default h-full min-h-[calc(100vh_-_110px)] p-4 xl:px-20 2xl:px-40 flex flex-col gap-4 relative",
          ["/login", "/register"].includes(location.pathname)
            ? "justify-center"
            : ""
        )}
      >
        {/* Display alert if present */}
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

        {/* React Router Routes */}
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route exact path="/" element={<Planning />} />
            {Cookies.get("role") &&
              ["map", "audience"].map((route) => {
                let Component;
                switch (route) {
                  case "map":
                    Component = Map;
                    break;
                  case "audience":
                    Component = Audience;
                    break;
                }

                const element = <Component />;

                return CheckPermission({
                  path: `${route}s`,
                  children: <Route path={`/${route}/*`} element={element} />,
                });
              })}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password/*" element={<ForgotPassword />} />
          <Route path="/password-recovery/" element={<EmptyPage />} />
          <Route path="/password-recovery/:id" element={<PasswordRecovery />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

// ProtectedRoutes Component to handle authentication checks
function ProtectedRoutes() {
  const isAuthenticated = Cookies.get("user") && Cookies.get("role");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function EmptyPage() {
  return <Navigate to="/login" />;
}
export default App;
