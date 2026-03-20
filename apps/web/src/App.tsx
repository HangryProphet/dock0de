import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { AuthPage } from "./pages/AuthPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ProfessorDashboard } from "./pages/ProfessorDashboard";
import { DockPage } from "./pages/DockPage";
import { ProfessorClassDashboard } from "./pages/ProfessorClassDashboard";
import { SubmissionMatrix } from "./pages/SubmissionMatrix";
import { SandboxPage } from "./pages/SandboxPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/student" replace />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/professor" element={<ProfessorDashboard />} />
          <Route path="/sandbox" element={<SandboxPage />} />
          <Route
            path="/professor/class/:id"
            element={<ProfessorClassDashboard />}
          />
          <Route
            path="/professor/class/:id/activities/:activityId"
            element={<SubmissionMatrix />}
          />
          <Route path="/dock/:id" element={<DockPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
