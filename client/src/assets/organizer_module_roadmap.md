# Organizer Role Module Roadmap

This document outlines the complete plan to build the **Organizer Role Module** for HackZone. Organizers are responsible for creating hackathons, managing participants, assigning judges, and reviewing submissions. For each phase, a ready-to-use AI prompt is provided so you can copy, paste, and let the AI execute the work.

## Phase 1: Database & Model Extensions

The backend needs to robustly support the creation and management of hackathons, prizes, and organization details. We will expand the existing `user.model.js` and `hackathon.model.js` schemas.

> [!TIP]
> **Prompt to copy & paste for Phase 1:**
> "Review and update the Mongoose models in `server/models` for the Organizer role. Specifically: 
> 1. Extend `user.model.js` to include organizer-specific fields like `organizationName`, `websiteUrl`, and `isVerified`. 
> 2. Ensure `hackathon.model.js` has comprehensive fields for `title`, `description`, `startDate`, `endDate`, `rules`, `prizes` (array of objects), `sponsors`, and references to `judges` (array of ObjectIds). 
> 3. Ensure the hackathon model tracks the `organizerId` so permissions can be strictly enforced.
> Provide the updated code for these models."

---

## Phase 2: Backend Controllers & Routes

Organizers need exclusive API endpoints to perform CRUD (Create, Read, Update, Delete) operations on their hackathons and view the participant metrics.

> [!TIP]
> **Prompt to copy & paste for Phase 2:**
> "Create and update the Express controllers and routes for the Organizer module. 
> 1. Create an `organizer.controller.js` to handle updating the organization's public profile. 
> 2. Create a set of routes in `hackathon.routes.js` protected by an `isOrganizer` middleware. 
> 3. Implement controller functions to: Create a new hackathon, Edit an existing hackathon, Delete/Cancel a hackathon, and Fetch all participants registered for their specific hackathon. 
> 4. Implement a route to invite/assign users with the 'judge' role to the hackathon.
> Provide the code for the middleware, controllers, and routes."

---

## Phase 3: Frontend API Services & State

The React frontend needs to securely communicate with the new organizer-only backend endpoints.

> [!TIP]
> **Prompt to copy & paste for Phase 3:**
> "Implement the frontend API integration for the Organizer module in `client/src/api`. 
> 1. Create an `organizer.api.js` file with functions to fetch and update the organization's profile. 
> 2. Create a `manageHackathon.api.js` file with functions to create, update, and delete hackathons. 
> 3. Add functions to fetch analytics (participant count, submission count) for the organizer dashboard. 
> Ensure all API calls correctly attach the JWT authentication token."

---

## Phase 4: Organizer Dashboard UI

The Organizer Dashboard is the central command center. It should display high-level metrics for their active and past hackathons.

> [!TIP]
> **Prompt to copy & paste for Phase 4:**
> "Design and implement the `OrganizerDashboard.jsx` page in `client/src/pages/dashboard`. The UI should feature the modern dark glassmorphism theme. It should display:
> 1. Top-level metric cards: Total Hackathons Hosted, Total Participants, Total Submissions.
> 2. A list or grid of their 'Active Hackathons' with quick action buttons (Edit, Manage Participants, View Submissions).
> 3. A prominent 'Create New Hackathon' Call-to-Action button.
> Please use the existing `Card` and `Button` components to maintain design consistency."

---

## Phase 5: Hackathon Creation & Editing UI

Creating a hackathon requires a detailed, structured form. A multi-step wizard is usually best for user experience.

> [!TIP]
> **Prompt to copy & paste for Phase 5:**
> "Build the Hackathon Creation UI for the organizer. 
> 1. Create a `CreateHackathon.jsx` page that uses a multi-step form (Step 1: Basic Info, Step 2: Dates & Rules, Step 3: Prizes & Sponsors). 
> 2. Ensure all inputs utilize the custom dark theme styling. 
> 3. Add validation so organizers cannot submit past dates for deadlines. 
> 4. Connect this form to the `createHackathon` API service we built in Phase 3. Include loading states and success/error toast notifications."

---

## Phase 6: Hackathon Management & Submissions Viewer UI

Once a hackathon is live, the organizer needs to manage the event, see who has registered, and eventually review the submitted projects.

> [!TIP]
> **Prompt to copy & paste for Phase 6:**
> "Implement the Event Management flow for organizers. 
> 1. Create a `ManageParticipants.jsx` interface where the organizer can see a table of registered users/teams and their status. 
> 2. Create a `ReviewSubmissions.jsx` page where organizers can view all submitted projects (GitHub links, demo videos) in a visually appealing grid. 
> 3. Add a feature to this page allowing the organizer to assign specific submissions to specific Judges for review."

---

## Verification Plan

As we execute these phases, we will verify by:
1. Creating an account with the `organizer` role and testing the JWT permissions to ensure they (and only they) can access the creation routes.
2. Manually creating a test hackathon via the frontend UI and verifying all fields (dates, prizes) save correctly in the MongoDB database.
3. Checking the UI responsiveness and ensuring the dark theme aesthetic remains perfectly consistent across all complex forms and data tables.
