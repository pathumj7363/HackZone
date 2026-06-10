# Participant Role Module Roadmap

This document outlines the complete plan to build the **Participant Role Module** for HackZone, from database schemas to frontend UI. For each phase, a ready-to-use AI prompt is provided so you can simply copy, paste, and let the AI execute the work step-by-step.

## Phase 1: Database & Model Extensions

The backend needs to support extended participant profiles, team creation, hackathon registrations, and project submissions. Since we already have the base models (`user.model.js`, `team.model.js`, `hackathon.model.js`, `submission.model.js`), we need to ensure they have the specific fields required for a participant.

> [!TIP]
> **Prompt to copy & paste for Phase 1:**
> "Review and update the Mongoose models in `server/models` for the Participant role. Specifically: 
> 1. Extend `user.model.js` to include participant-specific fields like `skills` (array of strings), `githubUrl`, `linkedinUrl`, and `bio`. 
> 2. Ensure `team.model.js` has a robust schema for team invites, max capacity, and a reference to the `hackathon` they are joining. 
> 3. Ensure `submission.model.js` has fields for `githubRepo`, `demoVideoUrl`, and `description`. 
> Provide the updated code for these models."

---

## Phase 2: Backend Controllers & Routes

Once the database schemas are ready, we need the API endpoints that the frontend will call. This includes updating participant profiles, managing teams, registering for hackathons, and submitting projects.

> [!TIP]
> **Prompt to copy & paste for Phase 2:**
> "Create and update the Express controllers and routes for the Participant module. 
> 1. Create a `participant.controller.js` to handle updating the user's profile (skills, bio, links). 
> 2. Update `team.controller.js` to allow a participant to create a team, invite other users by email, accept invites, and leave teams. 
> 3. Update `hackathon.controller.js` with an endpoint for participants to register for an active hackathon (either solo or as a team). 
> 4. Update `submission.controller.js` with an endpoint for participants to submit their final hackathon project. 
> Make sure to secure all routes using the authentication middleware."

---

## Phase 3: Frontend API Services & State

The frontend React app needs to be able to talk to the new backend endpoints. This involves creating service files using Axios (or fetch) and setting up any necessary React Context or state management to hold the participant's data.

> [!TIP]
> **Prompt to copy & paste for Phase 3:**
> "Implement the frontend API integration for the Participant module in `client/src/api`. 
> 1. Create a `participant.api.js` file with functions to fetch and update the user's profile. 
> 2. Create a `team.api.js` file with functions to create teams, fetch team details, send invites, and respond to invites. 
> 3. Create a `submission.api.js` file to handle submitting projects. 
> Ensure all API calls correctly attach the JWT authentication token."

---

## Phase 4: Participant Dashboard UI

The Dashboard is the central hub for a participant. It should give them a quick overview of their active hackathons, pending team invites, and upcoming deadlines.

> [!TIP]
> **Prompt to copy & paste for Phase 4:**
> "Design and implement the `ParticipantDashboard.jsx` page in `client/src/pages/dashboard`. CRITICAL: Do NOT change `global.css` or the overall theme. Implement the UI using the existing light theme and existing components. It should display:
> 1. A summary of hackathons the user is currently registered for.
> 2. A section showing active team invites with 'Accept'/'Decline' buttons.
> 3. A quick-link section to browse new, upcoming hackathons.
> Please use the existing `Card` and `Button` components to maintain design consistency."

---

## Phase 5: Team Builder & Profile UI

Participants need dedicated pages to edit their skills/links and a UI to find or invite teammates to their hackathon teams.

> [!TIP]
> **Prompt to copy & paste for Phase 5:**
> "Build the Profile and Team Management UIs for the participant. 
> 1. Create a `ParticipantProfile.jsx` page where users can add their skills, bio, GitHub, and LinkedIn links. Ensure the form uses the existing light theme input styles. 
> 2. Create a `TeamManager.jsx` component that lets a user view their current team members, search for other users by email to invite them, and see the status of sent invites. 
> Connect these components to the API services we created in Phase 3."

---

## Phase 6: Hackathon Registration & Submission UI

Finally, participants need to be able to view a hackathon's details, click "Register", and eventually submit their project when the hackathon ends.

> [!TIP]
> **Prompt to copy & paste for Phase 6:**
> "Implement the Registration and Submission flow for participants. 
> 1. Update the `HackathonDetails.jsx` page to include a 'Register for Hackathon' button that opens a modal allowing them to register solo or select their team. 
> 2. Create a `ProjectSubmission.jsx` page that contains a form for participants to submit their project title, description, GitHub URL, and Demo Video URL. 
> Ensure both flows have proper error handling and success notifications."

---

## Verification Plan

As we execute these phases, we will verify by:
1. Testing the backend endpoints via Postman or terminal `curl` commands to ensure data saves correctly in MongoDB.
2. Logging in as a test participant on the React frontend to manually test the Dashboard, Profile, Team Invites, and Submission workflows.
3. Ensuring the UI correctly uses the existing light theme and matches the overall HackZone aesthetic.
