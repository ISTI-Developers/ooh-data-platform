import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
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
import { AuthProvider, useAuth } from "~config/AuthContext";
import ReportDecks from "~pages/ReportDecks";
import MapProvider from "~config/MapsContext";
import Reports from "~pages/Reports";
import { CampaignProvider } from "~config/Campaigns";
import LandingPage from "~pages/Utasi/LandingPage";
import { StationProvider } from "~config/LRTContext";
// Main App Component
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <CampaignProvider>
              <nav className="shadow-md border-b-2">
                <Header />
              </nav>
              <AppRoutes />
          </CampaignProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

// AppRoutes Component handles top-level routing and layout
function AppRoutes() {
  const location = useLocation();
  const { alert, setAlert, CheckPermission, role, retrieveRoleModules } = useAuth();
  const componentMap = {
    planning: Planning,
    maps: Map,
    audiences: Audience,
    reports: ReportDecks,
    campaigns: Reports,
    utasi_lrt: LandingPage,
  };

  const [modules, setModules] = useState(null);
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

  useEffect(() => {
    if (!role) return;
    const retrieve = async () => {
      const response = await retrieveRoleModules();
      setModules(response);
    };
    retrieve();
  }, [role]);

  const moduleList = useMemo(() => {
    if (!modules) return [];
    return modules
      .filter((module) => module.view === "client" && module.is_parent)
      .filter((module) => {
        return CheckPermission({
          path: module.name.toLowerCase(),
        });
      });
  }, [CheckPermission, modules]);

  return (
    <div
      className={classNames(
        "bg-default h-full min-h-[calc(100vh_-_92px)] p-4 2xl:px-40 flex flex-col gap-4 relative",
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
      <MapProvider>
        <StationProvider>
          <Routes>
            <Route element={<ProtectedRoutes />}>
              {moduleList &&
                moduleList.map((module, index) => {
                  const route = module.name.toLowerCase();
                  const Component = componentMap[route];

                  return CheckPermission({
                    path: route,
                    children: (
                      <Route key={module.module_id} path={index === 0 ? `/` : `/${route}/*`} element={<Component />} />
                    ),
                  });
                })}
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password/*" element={<ForgotPassword />} />
            <Route path="/password-recovery/" element={<EmptyPage />} />
            <Route path="/password-recovery/:id" element={<PasswordRecovery />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </StationProvider>
      </MapProvider>
    </div>
  );
}

// ProtectedRoutes Component to handle authentication checks
function ProtectedRoutes() {
  const { user, role } = useAuth();
  const isAuthenticated = useMemo(() => {
    return (user && role) ?? false;
  }, [user, role]);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function EmptyPage() {
  return <Navigate to="/login" />;
}
export default App;
