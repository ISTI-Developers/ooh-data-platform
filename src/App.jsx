import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import classNames from "classnames";
import { Alert } from "flowbite-react";
import { RiInformationFill } from "react-icons/ri";
import Map from "~pages/Map";
import Login from "~pages/Login";
import Planning from "~pages/Planning";
import Audience from "~pages/Audience";
import Register from "~pages/Register";
import Header from "~fragments/Header";
import ForgotPassword from "~pages/ForgotPassword";
import PasswordRecovery from "~pages/PasswordRecovery";
import { AuthProvider, useAuth } from "~config/authContext";
import Reports from "~pages/Reports";
import { ReportProvider } from "~config/ReportContext";

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
  let hasUser = Cookies.get("role");

  if (hasUser) hasUser = JSON.parse(hasUser);
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
            {/* <Route exact path="/" element={<Planning />} /> */}
            {hasUser &&
              //map the two pages that can or cannot be seen by the user based on role privileges.
              ["planning", "map", "audience"].map((route) => {
                let Component;
                switch (route) {
                  case "planning":
                    Component = Planning;
                    break;
                  case "map":
                    Component = Map;
                    break;
                  case "audience":
                    Component = Audience;
                    break;
                }

                const element = <Component />;

                //the function to check the permission
                if (route === "planning") {
                  return CheckPermission({
                    path: route,
                    children: <Route path={`/`} element={element} />,
                  });
                } else {
                  return CheckPermission({
                    path: `${route}s`,
                    children: <Route path={`/${route}/*`} element={element} />,
                  });
                }
              })}
            {hasUser &&
              ["sales", "superadmin"].includes(
                hasUser.role_name.toLowerCase()
              ) && (
                <Route
                  path="/reports"
                  element={
                    <ReportProvider>
                      <Reports />
                    </ReportProvider>
                  }
                />
              )}
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
