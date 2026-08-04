import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

// Student tools
import StudyAssistant from './pages/student/StudyAssistant';
import FlashcardGenerator from './pages/student/FlashcardGenerator';
import PomodoroTimer from './pages/student/PomodoroTimer';
import GPACalculator from './pages/student/GPACalculator';
import CitationGenerator from './pages/student/CitationGenerator';
import ExamCountdown from './pages/student/ExamCountdown';

// Children tools
import MathPlayground from './pages/children/MathPlayground';
import SpellingBee from './pages/children/SpellingBee';
import StoryCreator from './pages/children/StoryCreator';
import DrawingCanvas from './pages/children/DrawingCanvas';
import ABCLearning from './pages/children/ABCLearning';

// Professional tools
import ProAssistant from './pages/professional/ProAssistant';
import MeetingNotes from './pages/professional/MeetingNotes';
import TaskManager from './pages/professional/TaskManager';
import TimeTracker from './pages/professional/TimeTracker';
import EmailDrafter from './pages/professional/EmailDrafter';
import InvoiceCalculator from './pages/professional/InvoiceCalculator';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!profile?.role) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, profile } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/auth" element={user ? <Navigate to={profile?.role ? '/dashboard' : '/onboarding'} replace /> : <AuthPage />} />
      <Route path="/onboarding" element={
        <ProtectedRoute><OnboardingPage /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <OnboardingGuard>
          <Layout><Dashboard /></Layout>
        </OnboardingGuard>
      } />
      {/* Student */}
      <Route path="/tools/study-assistant" element={<OnboardingGuard><Layout><StudyAssistant /></Layout></OnboardingGuard>} />
      <Route path="/tools/flashcards" element={<OnboardingGuard><Layout><FlashcardGenerator /></Layout></OnboardingGuard>} />
      <Route path="/tools/pomodoro" element={<OnboardingGuard><Layout><PomodoroTimer /></Layout></OnboardingGuard>} />
      <Route path="/tools/gpa" element={<OnboardingGuard><Layout><GPACalculator /></Layout></OnboardingGuard>} />
      <Route path="/tools/citation" element={<OnboardingGuard><Layout><CitationGenerator /></Layout></OnboardingGuard>} />
      <Route path="/tools/exam-countdown" element={<OnboardingGuard><Layout><ExamCountdown /></Layout></OnboardingGuard>} />
      {/* Children */}
      <Route path="/tools/math" element={<OnboardingGuard><Layout><MathPlayground /></Layout></OnboardingGuard>} />
      <Route path="/tools/spelling" element={<OnboardingGuard><Layout><SpellingBee /></Layout></OnboardingGuard>} />
      <Route path="/tools/story" element={<OnboardingGuard><Layout><StoryCreator /></Layout></OnboardingGuard>} />
      <Route path="/tools/drawing" element={<OnboardingGuard><Layout><DrawingCanvas /></Layout></OnboardingGuard>} />
      <Route path="/tools/abc" element={<OnboardingGuard><Layout><ABCLearning /></Layout></OnboardingGuard>} />
      {/* Professional */}
      <Route path="/tools/pro-assistant" element={<OnboardingGuard><Layout><ProAssistant /></Layout></OnboardingGuard>} />
      <Route path="/tools/meeting-notes" element={<OnboardingGuard><Layout><MeetingNotes /></Layout></OnboardingGuard>} />
      <Route path="/tools/tasks" element={<OnboardingGuard><Layout><TaskManager /></Layout></OnboardingGuard>} />
      <Route path="/tools/time-tracker" element={<OnboardingGuard><Layout><TimeTracker /></Layout></OnboardingGuard>} />
      <Route path="/tools/email-drafter" element={<OnboardingGuard><Layout><EmailDrafter /></Layout></OnboardingGuard>} />
      <Route path="/tools/invoice" element={<OnboardingGuard><Layout><InvoiceCalculator /></Layout></OnboardingGuard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
