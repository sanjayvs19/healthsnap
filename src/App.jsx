import React from 'react';
import { WellnessProvider, useWellness } from './context/WellnessContext';
import LandingPage from './components/landing/LandingPage';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import MobileNav from './components/common/MobileNav';
import WakeUpReminder from './components/common/WakeUpReminder';

import DashboardView from './components/dashboard/DashboardView';
import SnapFoodView from './components/snap/SnapFoodView';
import SpeakView from './components/speak/SpeakView';
import WellnessJournalView from './components/journal/WellnessJournalView';
import ActivityView from './components/activity/ActivityView';
import SleepView from './components/sleep/SleepView';
import AIInsightsView from './components/insights/AIInsightsView';
import GuidanceView from './components/guidance/GuidanceView';
import TrendsView from './components/trends/TrendsView';
import ProfileView from './components/profile/ProfileView';
import ReportsView from './components/reports/ReportsView';
import TrackView from './components/track/TrackView';
import ProgressView from './components/progress/ProgressView';

import { Sparkles, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { activeView, toastMessage } = useWellness();

  // If on landing page, display the full public presentation page
  if (activeView === 'landing') {
    return (
      <>
        <LandingPage />
        {toastMessage && <Toast message={toastMessage} />}
      </>
    );
  }

  // Render main app interface with Sidebar, Header, View Area, and Mobile Nav
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'track':
        return <TrackView />;
      case 'progress':
        return <ProgressView />;
      case 'reports':
        return <ReportsView />;
      case 'snap':
        return <SnapFoodView />;
      case 'speak':
        return <SpeakView />;
      case 'journal':
        return <WellnessJournalView />;
      case 'activity':
        return <ActivityView />;
      case 'sleep':
        return <SleepView />;
      case 'insights':
        return <AIInsightsView />;
      case 'guidance':
        return <GuidanceView />;
      case 'trends':
        return <TrendsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Desktop Navigation Sidebar */}
        <div className="desktop-only-sidebar">
          <Sidebar />
        </div>

        {/* Dynamic Main Content View */}
        <main
          style={{
            flex: 1,
            padding: '28px 24px 80px',
            overflowY: 'auto',
            minHeight: 'calc(100vh - 70px)'
          }}
          className="main-view-container"
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileNav />

      {/* Floating Toast Alerts */}
      {toastMessage && <Toast message={toastMessage} />}

      {/* Wake-Up Reminder Banner */}
      <WakeUpReminder />

      <style>{`
        @media (max-width: 900px) {
          .desktop-only-sidebar {
            display: none !important;
          }
          .main-view-container {
            padding: 20px 16px 88px !important;
          }
        }
      `}</style>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      background: 'var(--bg-surface-elevated)',
      color: 'var(--text-main)',
      border: '1px solid var(--primary)',
      padding: '12px 20px',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 0 16px rgba(16, 185, 129, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.88rem',
      fontWeight: 600,
      animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <CheckCircle2 size={18} color="var(--primary)" />
      <span>{message}</span>
    </div>
  );
}

export default function App() {
  return (
    <WellnessProvider>
      <AppContent />
    </WellnessProvider>
  );
}
