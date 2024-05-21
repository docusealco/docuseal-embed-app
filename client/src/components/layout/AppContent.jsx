import AppRoutes from "./AppRoutes";

const AppContent = () => {
  return (
    <div className="px-4 pt-4">
      <div className="bg-slate-50 rounded-box p-6 border border-slate-300">
        <AppRoutes />
      </div>
    </div>
  );
};

export default AppContent;
