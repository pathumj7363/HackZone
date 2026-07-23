# Complete the Participant Role Implementation (8-Day Plan)

This implementation plan outlines the steps required to fully integrate the Participant role end-to-end, based on the following finalized requirements:
1. **No Mock Data**: All hardcoded mocks will be completely removed. The participant UI will strictly display data (Hackathons, Teams, Submissions) pulled directly from the database.
2. **Email-Based Invites**: Team joining will be strictly handled via email invitations. Participants will fetch their pending invites and accept/reject them, rather than joining via a team code.

After checking the current repository state, none of these participant-specific integrations have been implemented yet. The following 40 tasks are designed to be completed at a pace of 5 tasks per day over 8 days.

## Day 1: Hackathon & Team Models
- [x] **Task 1:** Implement `getAllHackathons` query in `hackathon.model.js`.
  - **Commit:** `feat(models): implement getAllHackathons query`
- [x] **Task 2:** Implement `getHackathonById` query in `hackathon.model.js`.
  - **Commit:** `feat(models): implement getHackathonById query`
- [x] **Task 3:** Write unit tests for hackathon model participant queries.
  - **Commit:** `test(models): verify hackathon participant queries`
- [x] **Task 4:** Implement `getTeamByUserId` query in `team.model.js` joining `teams` and `team_members`.
  - **Commit:** `feat(models): implement getTeamByUserId query`
- [x] **Task 5:** Implement `getPendingInvitesByEmail` query in `team.model.js`.
  - **Commit:** `feat(models): implement getPendingInvitesByEmail query`

## Day 2: Submission Model & Controllers (Part 1)
- [x] **Task 6:** Write unit tests for team model participant queries.
  - **Commit:** `test(models): verify team participant queries`
- [x] **Task 7:** Implement `getSubmissionsByTeamId` query in `submission.model.js`.
  - **Commit:** `feat(models): implement getSubmissionsByTeamId query`
- [x] **Task 8:** Write unit tests for submission model participant queries.
  - **Commit:** `test(models): verify submission participant queries`
- [x] **Task 9:** Implement `getHackathons` controller in `hackathon.controller.js`.
  - **Commit:** `feat(controllers): add getHackathons controller logic`
- [x] **Task 10:** Implement `getHackathonDetail` controller in `hackathon.controller.js`.
  - **Commit:** `feat(controllers): add getHackathonDetail controller logic`

## Day 3: Controllers (Part 2) & Hackathon Routes
- [x] **Task 11:** Implement `getMyTeam` controller in `team.controller.js`.
  - **Commit:** `feat(controllers): add getMyTeam controller logic`
- [x] **Task 12:** Implement `getMyInvites` controller in `team.controller.js`.
  - **Commit:** `feat(controllers): add getMyInvites controller logic`
- [x] **Task 13:** Implement `getMySubmissions` controller in `submission.controller.js`.
  - **Commit:** `feat(controllers): add getMySubmissions controller logic`
- [x] **Task 14:** Add standard error handling to all new participant controllers.
  - **Commit:** `fix(controllers): add error handling for participant controllers`
- [x] **Task 15:** Register `GET /` route in `hackathon.routes.js`.
  - **Commit:** `feat(routes): register get all hackathons endpoint`

## Day 4: Team & Submission Routes & API Tests
- [ ] **Task 16:** Register `GET /:id` route in `hackathon.routes.js`.
  - **Commit:** `feat(routes): register get hackathon detail endpoint`
- [ ] **Task 17:** Register `GET /my-team` route in `team.routes.js`.
  - **Commit:** `feat(routes): register get my team endpoint`
- [ ] **Task 18:** Register `GET /my-invites` route in `team.routes.js`.
  - **Commit:** `feat(routes): register get my invites endpoint`
- [ ] **Task 19:** Register `GET /my-submissions` route in `submission.routes.js`.
  - **Commit:** `feat(routes): register get my submissions endpoint`
- [ ] **Task 20:** Test all new participant backend endpoints via Postman or automated API tests.
  - **Commit:** `test(api): verify participant endpoints end-to-end`

## Day 5: Frontend API Setup (Part 1)
- [x] **Task 21:** Remove `mockHackathons` array and mock delay in `client/src/api/hackathon.api.js`.
  - **Commit:** `refactor(api): remove hackathon mock data`
- [x] **Task 22:** Connect `getHackathonsApi` to `API.get('/hackathons')`.
  - **Commit:** `feat(api): connect getHackathons to real endpoint`
- [x] **Task 23:** Connect `getHackathonDetailApi` to `API.get('/hackathons/${id}')`.
  - **Commit:** `feat(api): implement getHackathonDetailApi`
- [x] **Task 24:** Remove mock delay and logic in `getMyTeamApi` in `team.api.js`.
  - **Commit:** `refactor(api): clean up team API mocks`
- [x] **Task 25:** Connect `getMyTeamApi` to `API.get('/teams/my-team')`.
  - **Commit:** `feat(api): Connect getMyTeam to real endpoint`

## Day 6: Frontend API Setup (Part 2) & Participant UI Setup
- [x] **Task 26:** Create `getMyInvitesApi` connecting to `API.get('/teams/my-invites')`.
  - **Commit:** `feat(api): add getMyInvites API method`
- [x] **Task 27:** Remove mocked arrays in `client/src/api/submission.api.js`.
  - **Commit:** `refactor(api): remove submission mock data`
- [x] **Task 28:** Connect `getMySubmissionsApi` to `API.get('/submissions/my-submissions')`.
  - **Commit:** `feat(api): connect getMySubmissions to real endpoint`
- [x] **Task 29:** Update Hackathon Dashboard UI to handle real data structure (e.g., missing image URLs).
  - **Commit:** `feat(pages): integrate real data in Hackathon Dashboard`
- [ ] **Task 30:** Add loading states/spinners to Hackathon Dashboard while fetching data.
  - **Commit:** `feat(ui): add loading states for hackathon fetching`

## Day 7: Team Management UI
- [ ] **Task 31:** Remove old "Enter Team Code" UI from team management page.
  - **Commit:** `refactor(pages): remove team code join UI`
- [ ] **Task 32:** Fetch and display pending email invites using `getMyInvitesApi`.
  - **Commit:** `feat(pages): fetch and display pending team invites`
- [ ] **Task 33:** Wire "Accept" and "Reject" buttons for invites to `respondToInviteApi`.
  - **Commit:** `feat(pages): implement invite accept and reject logic`
- [ ] **Task 34:** Refresh team details and invite list automatically after responding to an invite.
  - **Commit:** `feat(pages): refresh team state after invite response`
- [ ] **Task 35:** Handle errors and display toast notifications for invite actions.
  - **Commit:** `feat(ui): add notifications for team invite actions`

## Day 8: Submissions UI & Final Polish
- [ ] **Task 36:** Update Participant Dashboard to fetch and display past submissions using `getMySubmissionsApi`.
  - **Commit:** `feat(pages): fetch real submissions in participant dashboard`
- [ ] **Task 37:** Implement an empty state UI if the user has no submissions.
  - **Commit:** `feat(ui): add empty state for missing submissions`
- [ ] **Task 38:** Handle any database schema edge cases (e.g., null values, date formatting on frontend).
  - **Commit:** `fix(pages): handle data formatting and null values`
- [ ] **Task 39:** Perform full end-to-end test (Login -> See Hackathons -> Check Invites -> View Submissions).
  - **Commit:** `test(e2e): verify complete participant workflow`
- [ ] **Task 40:** Final code review, cleanup console logs, and polish the participant module.
  - **Commit:** `chore: cleanup logs and polish participant module`

---
## Verification Plan
1. Sign in as an Organizer, create a Hackathon (to populate the database).
2. Sign in as a Participant.
3. Verify that the Hackathon list on the dashboard now shows only the real Hackathon created by the Organizer.
4. Verify that the participant can receive an email invite to a team, view the pending invite in their dashboard, and accept it to join the team.
5. Verify that past project submissions are pulled from the backend and displayed accurately on the participant dashboard, showing empty state if none exist.
