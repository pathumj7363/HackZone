import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/common/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RoleSelect from './pages/auth/RoleSelect'
import ParticipantDashboard from './pages/dashboard/ParticipantDashboard'
import UnifiedProfile from './pages/profile/UnifiedProfile'
import HackathonList from './pages/participant/HackathonList'
import HackathonDetail from './pages/participant/HackathonDetail'
import HackathonRegistration from './pages/hackathon/HackathonRegistration'
import TeamHub from './pages/team/TeamHub'
import ProjectSubmission from './pages/submission/ProjectSubmission'
import MySubmissions from './pages/submission/MySubmissions'
import EvaluationResults from './pages/submission/EvaluationResults'
import ParticipantScoreboard from './pages/participant/ParticipantScoreboard'
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import ManageHackathon from './pages/organizer/ManageHackathon'
import ManageSubmissions from './pages/organizer/ManageSubmissions'
import OrganizerSubmissionPreview from './pages/organizer/OrganizerSubmissionPreview'
import AssignJudges from './pages/organizer/AssignJudges'
import Announcements from './pages/organizer/Announcements'
import OrganizerScoreboard from './pages/organizer/OrganizerScoreboard'
import JudgeDashboard from './pages/judge/JudgeDashboard'
import AssignedProjects from './pages/judge/AssignedProjects'
import EvaluateProject from './pages/judge/EvaluateProject'
import JudgeLeaderboard from './pages/judge/JudgeLeaderboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import NotFound from './components/common/NotFound'
import PublicLayout from './components/layout/PublicLayout'
import AppLayout from './components/layout/AppLayout'
import AdminLayout from './components/layout/AdminLayout'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register/role-select" element={<RoleSelect />} />
            <Route path="/register" element={<Register />} />

            <Route path="/hackathons/:id/register" element={<ProtectedRoute allowedRoles={['participant']}><HackathonRegistration /></ProtectedRoute>} />

            <Route element={<AppLayout />}>
              {/* Unified Profile Route */}
              <Route path="/profile" element={<ProtectedRoute allowedRoles={['participant', 'judge', 'organizer']}><UnifiedProfile /></ProtectedRoute>} />
              <Route path="/profile/:id" element={<ProtectedRoute allowedRoles={['participant', 'judge', 'organizer']}><UnifiedProfile /></ProtectedRoute>} />

              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['participant']}><ParticipantDashboard /></ProtectedRoute>} />
              <Route path="/hackathons" element={<ProtectedRoute allowedRoles={['participant']}><HackathonList /></ProtectedRoute>} />
              <Route path="/hackathons/:id" element={<ProtectedRoute allowedRoles={['participant']}><HackathonDetail /></ProtectedRoute>} />

              <Route path="/teams/*" element={<ProtectedRoute allowedRoles={['participant']}><TeamHub /></ProtectedRoute>} />

              <Route path="/submit" element={<ProtectedRoute allowedRoles={['participant']}><ProjectSubmission /></ProtectedRoute>} />
              <Route path="/submissions" element={<ProtectedRoute allowedRoles={['participant']}><MySubmissions /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute allowedRoles={['participant']}><EvaluationResults /></ProtectedRoute>} />
              <Route path="/participant/scoreboard" element={<ProtectedRoute allowedRoles={['participant']}><ParticipantScoreboard /></ProtectedRoute>} />

              <Route path="/organizer" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
              <Route path="/organizer/hackathon" element={<ProtectedRoute allowedRoles={['organizer']}><ManageHackathon /></ProtectedRoute>} />
              <Route path="/organizer/submissions" element={<ProtectedRoute allowedRoles={['organizer']}><ManageSubmissions /></ProtectedRoute>} />
              <Route path="/organizer/submission/:id" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerSubmissionPreview /></ProtectedRoute>} />
              <Route path="/organizer/judges" element={<ProtectedRoute allowedRoles={['organizer']}><AssignJudges /></ProtectedRoute>} />
              <Route path="/organizer/announce" element={<ProtectedRoute allowedRoles={['organizer']}><Announcements /></ProtectedRoute>} />
              <Route path="/organizer/scoreboard" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerScoreboard /></ProtectedRoute>} />

              <Route path="/judge" element={<ProtectedRoute allowedRoles={['judge', 'organizer']}><JudgeDashboard /></ProtectedRoute>} />
              <Route path="/judge/dashboard" element={<ProtectedRoute allowedRoles={['judge', 'organizer']}><JudgeDashboard /></ProtectedRoute>} />
              <Route path="/judge/projects" element={<ProtectedRoute allowedRoles={['judge']}><AssignedProjects /></ProtectedRoute>} />
              <Route path="/judge/evaluate/:id" element={<ProtectedRoute allowedRoles={['judge']}><EvaluateProject /></ProtectedRoute>} />
              <Route path="/judge/leaderboard/:hackathonId" element={<ProtectedRoute allowedRoles={['judge', 'organizer']}><JudgeLeaderboard /></ProtectedRoute>} />
              <Route path="/judge/leaderboard" element={<ProtectedRoute allowedRoles={['judge', 'organizer']}><JudgeLeaderboard /></ProtectedRoute>} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}