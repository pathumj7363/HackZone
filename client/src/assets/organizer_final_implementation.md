# Complete the Organizer Role Implementation

This implementation plan outlines the steps required to fully integrate the Organizer role end-to-end. Currently, the Organizer UI relies on hardcoded data and mocked API calls (for creating hackathons, viewing judges, and assigning judges to projects).

## Proposed Changes

### 1. Backend Models (Database Layer)

We need to add SQL queries to support organizer-specific write and read operations.

#### [MODIFY] server/models/hackathon.model.js
- Implement `createHackathon(data)`: Inserts a new hackathon into the `hackathons` table (including fields like title, description, startDate, endDate, location, and status).
- Implement `updateHackathon(id, data)`: Updates an existing hackathon.
- Implement `getHackathonsByOrganizerId(organizerId)`: Fetches hackathons created by a specific organizer. *(Note: We may need to add an `organizerId` column to the `hackathons` table if it doesn't exist).*

#### [MODIFY] server/models/user.model.js
- Implement `getUsersByRole(role)`: Fetches all users matching a specific role (e.g., `'judge'`). This allows organizers to see a list of available judges to assign.

#### [MODIFY] server/models/evaluation.model.js
- Implement `assignJudgeToSubmission(judgeId, submissionId, hackathonId)`: Inserts a row into the `evaluations` table with NULL scores. This acts as a pending assignment for the judge.
- Implement `removeJudgeFromSubmission(judgeId, submissionId)`: Deletes the assignment from the `evaluations` table if scores haven't been submitted yet.

---

### 2. Backend Controllers

Map the incoming requests to the model functions.

#### [MODIFY] server/controllers/hackathon.controller.js
- Add `createHackathon`: Extracts hackathon data from `req.body`, generates a UUID, and calls `createHackathon(data)`.
- Add `updateHackathon`: Updates an existing hackathon based on `req.params.id`.
- Add `getMyHackathons`: Uses `req.user.id` to fetch only the hackathons managed by this organizer.

#### [MODIFY] server/controllers/user.controller.js
- Add `getJudges`: Calls `getUsersByRole('judge')` and returns the list of judges.

#### [MODIFY] server/controllers/evaluation.controller.js
- Add `assignJudge`: Extracts `judgeId` and `submissionId` and calls `assignJudgeToSubmission()`.
- Add `unassignJudge`: Removes a pending assignment.

---

### 3. Backend Routes

Expose the new controller methods via standard HTTP verbs, secured by `isOrganizer` middleware where appropriate.

#### [MODIFY] server/routes/hackathon.routes.js
- Add `router.post('/', verifyToken, isOrganizer, createHackathon);`
- Add `router.put('/:id', verifyToken, isOrganizer, updateHackathon);`
- Add `router.get('/my-hackathons', verifyToken, isOrganizer, getMyHackathons);`

#### [MODIFY] server/routes/user.routes.js
- Add `router.get('/judges', verifyToken, isOrganizer, getJudges);`

#### [MODIFY] server/routes/evaluation.routes.js
- Add `router.post('/assign', verifyToken, isOrganizer, assignJudge);`
- Add `router.delete('/assign', verifyToken, isOrganizer, unassignJudge);`

---

### 4. Frontend API Integration

Remove **all** mock data and wire the Axios calls directly to the new backend endpoints.

#### [MODIFY] client/src/api/hackathon.api.js
- Remove the `createHackathonApi` mock delay.
- Replace `createHackathonApi` with `API.post('/hackathons', data)`.
- Replace `getHackathonsApi` for organizers with `API.get('/hackathons/my-hackathons')`.

#### [MODIFY] client/src/api/judge.api.js (Create or Modify)
- Add `getAvailableJudgesApi()` calling `API.get('/users/judges')`.
- Add `assignJudgeApi(judgeId, submissionId)` calling `API.post('/evaluations/assign')`.
- Add `unassignJudgeApi(judgeId, submissionId)` calling `API.delete('/evaluations/assign')`.

#### [MODIFY] client/src/pages/organizer/ManageHackathon.jsx
- Remove `setTimeout` mocks.
- Ensure the form submission accurately hits the new `createHackathonApi`.
- If the database schema for `hackathons` is missing `organizerId`, we must run an `ALTER TABLE` query first to support this.

#### [MODIFY] client/src/pages/organizer/AssignJudges.jsx
- Remove the hardcoded `mockJudges` and `initialProjects` arrays.
- Fetch available judges using `getAvailableJudgesApi()` on mount.
- Fetch all submissions for the active hackathon.
- Wire the "Assign" button to `assignJudgeApi()`.

---

## Verification Plan
1. Sign in as an Organizer.
2. Navigate to "Manage Hackathons" and create a new hackathon. Verify it saves successfully and appears in the list without refreshing.
3. Sign in as a Participant, form a team, and submit a project to that hackathon.
4. Sign back in as the Organizer, navigate to "Assign Judges".
5. Verify the submitted project appears.
6. Verify a list of real registered Judges appears.
7. Assign a judge to the project.
8. Sign in as the Judge and verify the project appears on their "Assigned Projects" dashboard.
