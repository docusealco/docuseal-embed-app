import { BrowserRouter } from "react-router-dom";
import { AppContent, AppNavbar, AppSidebar } from "./components/layout";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-white">
        <div className="flex">
          <AppSidebar />
          <div className="w-full">
            <AppNavbar />
            <AppContent />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
