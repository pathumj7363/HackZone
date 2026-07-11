# Complete the Organizer Role Implementation (10-Day Plan)

This implementation plan outlines the steps required to fully integrate the Organizer role end-to-end. Currently, the Organizer UI relies on hardcoded data and mocked API calls (for creating hackathons, viewing judges, and assigning judges to projects).

The following 50 tasks are designed to be completed at a pace of 5 tasks per day over 10 days.

## Day 1: Database Setup & Hackathon Model (Part 1)
- [x] **Task 1:** Add `organizerId` column to `hackathons` table in database schema (if not exists).
  - **Commit:** `feat(db): add organizerId column to hackathons table`
- [x] **Task 2:** Implement `createHackathon(data)` SQL query in `hackathon.model.js`.
  - **Commit:** `feat(models): implement createHackathon query`
- [ ] **Task 3:** Write unit tests or manual verification scripts for `createHackathon` query.
  - **Commit:** `test(models): verify createHackathon query functionality`
- [ ] **Task 4:** Implement `updateHackathon(id, data)` SQL query in `hackathon.model.js`.
  - **Commit:** `feat(models): implement updateHackathon query`
- [ ] **Task 5:** Write unit tests or manual verification scripts for `updateHackathon` query.
  - **Commit:** `test(models): verify updateHackathon query functionality`

## Day 2: Hackathon Model (Part 2) & User Model
- [ ] **Task 6:** Implement `getHackathonsByOrganizerId(organizerId)` query in `hackathon.model.js`.
  - **Commit:** `feat(models): implement getHackathonsByOrganizerId query`
- [ ] **Task 7:** Implement error handling and edge cases for hackathon model queries.
  - **Commit:** `fix(models): enhance error handling for hackathon queries`
- [ ] **Task 8:** Implement `getUsersByRole(role)` SQL query in `user.model.js`.
  - **Commit:** `feat(models): implement getUsersByRole query for judges`
- [ ] **Task 9:** Write unit tests for `getUsersByRole` query.
  - **Commit:** `test(models): verify getUsersByRole query`
- [ ] **Task 10:** Optimize database indexes for user roles and hackathon organizer ID.
  - **Commit:** `chore(db): add indexes for organizer_id and user roles`

## Day 3: Evaluation Model
- [ ] **Task 11:** Implement `assignJudgeToSubmission(judgeId, submissionId, hackathonId)` query in `evaluation.model.js`.
  - **Commit:** `feat(models): implement assignJudgeToSubmission query`
- [ ] **Task 12:** Add constraint checks in `evaluation.model.js` to prevent duplicate assignments.
  - **Commit:** `fix(models): prevent duplicate judge assignments in db`
- [ ] **Task 13:** Implement `removeJudgeFromSubmission(judgeId, submissionId)` query in `evaluation.model.js`.
  - **Commit:** `feat(models): implement removeJudgeFromSubmission query`
- [ ] **Task 14:** Add validation to ensure scores are NULL before removing assignment.
  - **Commit:** `fix(models): validate scores before removing judge assignment`
- [ ] **Task 15:** Write comprehensive tests for evaluation model assignment queries.
  - **Commit:** `test(models): verify judge assignment database operations`

## Day 4: Hackathon Controllers (Part 1)
- [ ] **Task 16:** Implement `createHackathon` controller method in `hackathon.controller.js`.
  - **Commit:** `feat(controllers): add createHackathon controller logic`
- [ ] **Task 17:** Add request body validation for `createHackathon` controller.
  - **Commit:** `feat(controllers): validate createHackathon request payload`
- [ ] **Task 18:** Implement `updateHackathon` controller method in `hackathon.controller.js`.
  - **Commit:** `feat(controllers): add updateHackathon controller logic`
- [ ] **Task 19:** Add authorization check in `updateHackathon` to ensure organizer owns the hackathon.
  - **Commit:** `fix(controllers): secure updateHackathon to owner organizer`
- [ ] **Task 20:** Implement `getMyHackathons` controller method in `hackathon.controller.js`.
  - **Commit:** `feat(controllers): add getMyHackathons controller logic`

## Day 5: User & Evaluation Controllers
- [ ] **Task 21:** Implement `getJudges` controller method in `user.controller.js`.
  - **Commit:** `feat(controllers): add getJudges controller logic`
- [ ] **Task 22:** Add pagination and search filtering to `getJudges` controller.
  - **Commit:** `feat(controllers): support pagination for getJudges`
- [ ] **Task 23:** Implement `assignJudge` controller method in `evaluation.controller.js`.
  - **Commit:** `feat(controllers): add assignJudge controller logic`
- [ ] **Task 24:** Implement `unassignJudge` controller method in `evaluation.controller.js`.
  - **Commit:** `feat(controllers): add unassignJudge controller logic`
- [ ] **Task 25:** Add error handling and response formatting for evaluation controllers.
  - **Commit:** `fix(controllers): standardize evaluation controller responses`

## Day 6: Backend Routes Integration
- [ ] **Task 26:** Add `isOrganizer` middleware if not already present.
  - **Commit:** `feat(middleware): implement isOrganizer authorization middleware`
- [ ] **Task 27:** Register `POST /` route in `hackathon.routes.js`.
  - **Commit:** `feat(routes): register create hackathon endpoint`
- [ ] **Task 28:** Register `PUT /:id` route in `hackathon.routes.js`.
  - **Commit:** `feat(routes): register update hackathon endpoint`
- [ ] **Task 29:** Register `GET /my-hackathons` route in `hackathon.routes.js`.
  - **Commit:** `feat(routes): register get my hackathons endpoint`
- [ ] **Task 30:** Register `GET /judges` in `user.routes.js`.
  - **Commit:** `feat(routes): register get judges endpoint`

## Day 7: Evaluation Routes & Frontend API (Part 1)
- [ ] **Task 31:** Register `POST /assign` route in `evaluation.routes.js`.
  - **Commit:** `feat(routes): register assign judge endpoint`
- [ ] **Task 32:** Register `DELETE /assign` route in `evaluation.routes.js`.
  - **Commit:** `feat(routes): register unassign judge endpoint`
- [ ] **Task 33:** Test all new backend endpoints via Postman or automated API tests.
  - **Commit:** `test(api): verify organizer endpoints end-to-end`
- [ ] **Task 34:** Remove `createHackathonApi` mock delay in `client/src/api/hackathon.api.js`.
  - **Commit:** `refactor(api): remove createHackathon mock delay`
- [ ] **Task 35:** Connect `createHackathonApi` to `API.post('/hackathons')`.
  - **Commit:** `feat(api): connect createHackathon to real endpoint`

## Day 8: Frontend API (Part 2) & ManageHackathon Page
- [ ] **Task 36:** Connect `getHackathonsApi` to `API.get('/hackathons/my-hackathons')`.
  - **Commit:** `feat(api): connect getHackathons to real endpoint`
- [ ] **Task 37:** Create `judge.api.js` and add `getAvailableJudgesApi`.
  - **Commit:** `feat(api): create judge API service with getAvailableJudges`
- [ ] **Task 38:** Add `assignJudgeApi` and `unassignJudgeApi` to `judge.api.js`.
  - **Commit:** `feat(api): add assign and unassign judge API methods`
- [ ] **Task 39:** Update `ManageHackathon.jsx` to remove all `setTimeout` mocks.
  - **Commit:** `refactor(pages): clean up ManageHackathon mocks`
- [ ] **Task 40:** Integrate `createHackathonApi` in `ManageHackathon.jsx` form submission.
  - **Commit:** `feat(pages): integrate real create hackathon API in ManageHackathon`

## Day 9: AssignJudges Page Integration
- [ ] **Task 41:** Add state management for fetching real hackathons list in `ManageHackathon.jsx`.
  - **Commit:** `feat(pages): fetch and display real hackathons list`
- [ ] **Task 42:** Remove hardcoded `mockJudges` array in `AssignJudges.jsx`.
  - **Commit:** `refactor(pages): remove mock judges data`
- [ ] **Task 43:** Integrate `getAvailableJudgesApi` in `AssignJudges.jsx` on mount.
  - **Commit:** `feat(pages): fetch real judges list in AssignJudges`
- [ ] **Task 44:** Remove hardcoded `initialProjects` array in `AssignJudges.jsx`.
  - **Commit:** `refactor(pages): remove mock projects data`
- [ ] **Task 45:** Fetch real submissions for the active hackathon in `AssignJudges.jsx`.
  - **Commit:** `feat(pages): fetch real submissions in AssignJudges`

## Day 10: Finalizing & E2E Testing
- [ ] **Task 46:** Wire the "Assign" button in `AssignJudges.jsx` to `assignJudgeApi`.
  - **Commit:** `feat(pages): implement assign judge button logic`
- [ ] **Task 47:** Wire the "Unassign" or "Remove" button in `AssignJudges.jsx` to `unassignJudgeApi`.
  - **Commit:** `feat(pages): implement unassign judge button logic`
- [ ] **Task 48:** Add toast notifications for successful/failed API calls in Organizer pages.
  - **Commit:** `feat(ui): add toast notifications for organizer actions`
- [ ] **Task 49:** Perform end-to-end test (Create Hackathon -> Submit Project -> Assign Judge).
  - **Commit:** `test(e2e): verify complete organizer workflow`
- [ ] **Task 50:** Final code review, cleanup console logs, and fix any styling issues.
  - **Commit:** `chore: cleanup logs and polish organizer module`

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
