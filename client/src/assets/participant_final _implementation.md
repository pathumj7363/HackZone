# Complete the Participant Role Implementation

This implementation plan outlines the steps required to fully integrate the Participant role end-to-end, based on the following finalized requirements:
1. **No Mock Data**: All hardcoded mocks will be completely removed. The participant UI will strictly display data (Hackathons, Teams, Submissions) pulled directly from the database. This means hackathons will only appear if an organizer has actually created them.
2. **Email-Based Invites**: Team joining will be strictly handled via email invitations. Participants will fetch their pending invites and accept/reject them, rather than joining via a team code.

---

## Proposed Changes

### 1. Backend Models (Database Layer)

We need to add the SQL queries to interact with the database tables.

#### [MODIFY] server/models/hackathon.model.js
- Implement `getAllHackathons`: Selects all hackathons from the `hackathons` table.
- Implement `getHackathonById(id)`: Selects a specific hackathon by its ID.

#### [MODIFY] server/models/team.model.js
- Implement `getTeamByUserId(userId)`: Joins `teams` and `team_members` to fetch a user's active team.
- Implement `getPendingInvitesByEmail(email)`: Fetches all pending invites for a specific user's email from the `team_invites` table.
- *(Note: `addTeamMember`, `createTeamInvite`, and `updateTeamInviteStatus` already exist in this file).*

#### [MODIFY] server/models/submission.model.js
- Implement `getSubmissionsByTeamId(teamId)`: Selects submissions for a specific team.

---

### 2. Backend Controllers

Map the incoming requests to the model functions and return standard JSON responses.

#### [MODIFY] server/controllers/hackathon.controller.js
- Add `getHackathons`: Calls `getAllHackathons()` and returns `res.status(200).json({ data: hackathons })`.
- Add `getHackathonDetail`: Extracts `req.params.id`, calls `getHackathonById(id)`.

#### [MODIFY] server/controllers/team.controller.js
- Add `getMyTeam`: Uses `req.user.id` to call `getTeamByUserId()`.
- Add `getMyInvites`: Uses `req.user.email` (from auth token/session) to call `getPendingInvitesByEmail()`.

#### [MODIFY] server/controllers/submission.controller.js
- Add `getMySubmissions`: Uses `req.user.id` to determine the user's team via `getTeamByUserId`, then calls `getSubmissionsByTeamId()`.

---

### 3. Backend Routes

Expose the new controller methods via standard HTTP verbs.

#### [MODIFY] server/routes/hackathon.routes.js
- Add `router.get('/', verifyToken, getHackathons);`
- Add `router.get('/:id', verifyToken, getHackathonDetail);`

#### [MODIFY] server/routes/team.routes.js
- Add `router.get('/my-team', verifyToken, getMyTeam);`
- Add `router.get('/my-invites', verifyToken, getMyInvites);`

#### [MODIFY] server/routes/submission.routes.js
- Add `router.get('/my-submissions', verifyToken, getMySubmissions);`

---

### 4. Frontend API Integration

Remove **all** mock data and wire the Axios calls directly to the new backend endpoints. Ensure that the returned data structures match what the React components expect.

#### [MODIFY] client/src/api/hackathon.api.js
- Remove the `mockHackathons` array entirely.
- Replace `getHackathonsApi` with `API.get('/hackathons')`.
- Replace `getHackathonDetailApi` with `API.get('/hackathons/${id}')`.

#### [MODIFY] client/src/api/team.api.js
- Remove the mocked `getMyTeamApi` delay and return logic.
- Replace `getMyTeamApi` with `API.get('/teams/my-team')`.
- Replace the mock `joinTeamApi` (which assumed a code) with a new `getMyInvitesApi` that calls `API.get('/teams/my-invites')`. We already have `respondToInviteApi` which calls `POST /teams/invite/respond`.

#### [MODIFY] client/src/api/submission.api.js
- Remove the mocked arrays.
- Replace `getMySubmissionsApi` with `API.get('/submissions/my-submissions')`.

#### [MODIFY] client/src/pages/participant/*.jsx
- Ensure the React components in the participant folder correctly read the real data structure returned by the API (e.g., handling missing image URLs for hackathons, since our real DB doesn't have the Unsplash mock images).
- Update the team management UI to show pending email invites (fetched from `getMyInvitesApi`) and allow the user to accept/reject them via `respondToInviteApi`, removing the old "Enter Team Code" UI if it exists.

---

## Verification Plan
1. Sign in as an Organizer, create a Hackathon (to populate the database).
2. Sign in as a Participant.
3. Verify that the Hackathon list on the dashboard now shows only the real Hackathon created by the Organizer.
4. Verify that the participant can receive an email invite to a team, view the pending invite in their dashboard, and accept it to join the team.
5. Verify that past project submissions are pulled from the backend and displayed accurately on the participant dashboard, showing empty state if none exist.
