import AppRoutes from "./AppRoutes";

const AppContent = () => {
  return (
    <div className="p-4">
      <div className="bg-slate-50 rounded-box p-6 border border-slate-300 h-screen-1/3">
        <AppRoutes />
      </div>
    </div>
  );
};

export default AppContent;
