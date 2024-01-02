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
function App() {
  return (
    <>
      <Router>
        <Header />
        <AppRoutes />
      </Router>
    </>
  );
}
function AppRoutes() {
  const location = useLocation();
  return (
    <div
      className={classNames(
        "bg-[#f4f6ff] h-full min-h-[calc(100vh_-_75px)] p-4 xl:px-48 flex flex-col gap-4",
        ["/login", "/register"].includes(location.pathname)
          ? "justify-center"
          : ""
      )}
    >
      <Routes>
        <Route exact path="/*" element={<Planning />} />
        <Route path="/map" element={<Map />} />
        <Route exact path="/audience" element={<>AUDIENCE IN PROGRESS</>} />
        <Route exact path="/reports" element={<>REPORTS IN PROGRESS</>} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
