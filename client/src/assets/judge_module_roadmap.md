# Judge Role Module Roadmap

This document outlines the complete plan to build the **Judge Role Module** for HackZone. Judges are responsible for reviewing project submissions, assigning scores based on criteria, and providing feedback. For each phase, a ready-to-use AI prompt is provided so you can copy, paste, and let the AI execute the work.

## Phase 1: Database & Model Extensions

The backend needs an evaluation system to securely store scores and feedback for each project submission. We will expand the `user.model.js` and create an `evaluation.model.js`.

> [!TIP]
> **Prompt to copy & paste for Phase 1:**
> "Review and update the Mongoose models in `server/models` for the Judge role. Specifically: 
> 1. Extend `user.model.js` to include judge-specific fields like `occupation`, `expertiseTags` (array of strings), and `linkedInUrl`. 
> 2. Ensure the `evaluation.model.js` schema includes references to the `submissionId`, `judgeId`, and `hackathonId`. 
> 3. Add scoring criteria fields to the evaluation model, such as `innovationScore`, `technicalComplexityScore`, `designScore`, and `usabilityScore` (e.g., numbers 1-10), along with a `feedback` text field.
> Provide the updated code for these models."

---

## Phase 2: Backend Controllers & Routes

Judges need endpoints to view the submissions assigned to them and to submit or update their scores.

> [!TIP]
> **Prompt to copy & paste for Phase 2:**
> "Create and update the Express controllers and routes for the Judge module. 
> 1. Create a `judge.controller.js` to handle updating the judge's public profile and expertise. 
> 2. Create an `evaluation.controller.js` with routes protected by an `isJudge` middleware. 
> 3. Implement endpoints to: Fetch all submissions assigned to the currently logged-in judge, Submit a new evaluation for a project, and Update an existing evaluation. 
> 4. Add logic to calculate the total average score for a submission once an evaluation is submitted.
> Provide the code for the middleware, controllers, and routes."

---

## Phase 3: Frontend API Services & State

The React frontend needs to securely communicate with the new judge-only backend endpoints to pull down the projects they need to review.

> [!TIP]
> **Prompt to copy & paste for Phase 3:**
> "Implement the frontend API integration for the Judge module in `client/src/api`. 
> 1. Create a `judge.api.js` file with functions to fetch and update the judge's profile. 
> 2. Create an `evaluation.api.js` file with functions to fetch assigned submissions (`getAssignedSubmissions`) and to post scores (`submitEvaluation`, `updateEvaluation`). 
> Ensure all API calls correctly attach the JWT authentication token and include error handling."

---

## Phase 4: Judge Dashboard UI

The Dashboard is the landing page for a judge. It should immediately show them their progress and what projects are waiting in their queue.

> [!TIP]
> **Prompt to copy & paste for Phase 4:**
> "Design and implement the `JudgeDashboard.jsx` page in `client/src/pages/dashboard`. The UI should feature the modern dark glassmorphism theme. It should display:
> 1. Metric cards: Pending Reviews, Completed Reviews, Total Hackathons Judging.
> 2. A 'To-Do' list or grid of project submissions that have been assigned to them but not yet scored.
> 3. Visual indicators (like progress bars) showing how many projects they have left to evaluate for a specific hackathon.
> Please use the existing `Card` and `Button` components to maintain design consistency."

---

## Phase 5: Submission Viewer & Scoring Rubric UI

This is the core workspace for a judge. They need to see the project details and input their scores side-by-side.

> [!TIP]
> **Prompt to copy & paste for Phase 5:**
> "Build the Project Review UI for the judge. 
> 1. Create a `ReviewSubmission.jsx` page. The left column should display the project's details (Title, Description, GitHub Link, and an embedded Demo Video). 
> 2. The right column should be a sticky 'Scoring Rubric' form. Implement slider inputs or star ratings for the scoring criteria (Innovation, Technical, Design, Usability). 
> 3. Include a text area for written feedback and a 'Submit Evaluation' button. 
> 4. Ensure the UI looks clean, utilizes the dark theme, and connects to the `submitEvaluation` API service."

---

## Phase 6: Leaderboard Preview UI

Judges often want to see how their scoring impacts the overall hackathon results before the event concludes.

> [!TIP]
> **Prompt to copy & paste for Phase 6:**
> "Implement a Leaderboard view for the judges. 
> 1. Update the `HackathonDetails` page or create a `JudgeLeaderboard.jsx` component that allows a judge to see the current rankings of all submissions based on the aggregated scores. 
> 2. Highlight the projects they have personally scored versus those they haven't. 
> 3. Ensure this data is fetched securely and is only visible to users with the 'judge' or 'organizer' role."

---

## Verification Plan

As we execute these phases, we will verify by:
1. Creating an account with the `judge` role and testing the `isJudge` middleware to ensure they cannot access organizer routes, but can access their assigned submissions.
2. Manually submitting an evaluation via the frontend UI and verifying that the database correctly updates the `evaluation.model.js` and aggregates the score on the `submission.model.js`.
3. Ensuring the sliders/rating inputs in the UI update state correctly and look premium in the dark theme.
