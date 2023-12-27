import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./fragments/Header";
import Planning from "./pages/Planning";
function App() {
  return (
    <>
      <Router>
        <Header />
        <div className="bg-[#f4f6ff] min-h-[calc(100vh_-_75px)] p-4 xl:px-48 flex flex-col gap-4">
          <Routes>
            <Route exact path="/*" element={<Planning />} />
            <Route path="/map" element={<>MAP IN PROGRESS</>} />
            <Route exact path="/audience" element={<>AUDIENCE IN PROGRESS</>} />
            <Route exact path="/reports" element={<>REPORTS IN PROGRESS</>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
