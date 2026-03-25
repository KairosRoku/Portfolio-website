PORTFOLIO WEBSITE CI/CD PROJECT DOCUMENTATION

1. SYSTEM OVERVIEW
This project establishes a professional-grade DevOps ecosystem for a React-based portfolio application. The system leverages containerization and automation to ensure high-quality code delivery across three isolated environments: Development (Dev), Quality Assurance (QA), and Production (Prod).

Architecture
The CI/CD architecture follows an "Infrastructure as Code" (IaC) approach where pipeline definitions are stored within the application repository itself.

- Developer Workspace: Visual Studio Code with Git integration.
- Source Control: GitHub as the central repository for code and pipeline scripts.
- Automation Server: Jenkins running in a specialized Docker container with direct access to the host's Docker engine.
- Orchestration: Jenkins Pipelines (Declarative) manage the lifecycle of each environment.
- Containerization: Docker is used to build consistent images and deploy isolated containers for each environment.

--------------------------------------------------------------------------------

2. TOOLS USED
- Jenkins: The core automation server (Containerized on Port 8081).
- Docker: Used for building the application images and managing isolated container runtimes.
- Git/GitHub: Version control and automatic webhooks for trigger-based builds.
- React: The frontend framework for the portfolio application (built with Vite and TypeScript).
- Node.js (v20): The runtime environment for building and testing the React app.
- Vitest and React Testing Library: For automated unit testing within the pipeline.
- Nginx: Used as the high-performance web server inside the production-ready Docker containers.

--------------------------------------------------------------------------------

3. PIPELINE EXPLANATION

CI Workflow (Portfolio-CI)
Triggered automatically on every push to the main branch.
1. Pull: Retrieves the latest synchronized code from GitHub.
2. Install: Runs npm install to ensure all dependencies are resolved.
3. Unit Tests: Executes npm test (Vitest). If any of the 15 tests fail, the build stops here to protect the environment.
4. Deploy to Dev: If tests pass, it builds a Docker image and replaces the portfolio-dev container on Port 3001.

Deployment Flows (QA and Prod)

Portfolio-QA
- Scheduled: Runs automatically every day at 12:00 AM (Midnight).
- Environment: Deploys to the portfolio-qa container on Port 3002.

Portfolio-Prod
- Manual: Triggered manually by the developer one-click "Build Now".
- Environment: Deploys to the portfolio-prod container on Port 3003.

--------------------------------------------------------------------------------

4. ENVIRONMENT SETUP

ENVIRONMENT     PURPOSE                                         PORT    CONTAINER NAME
Development     Continuous testing of experimental features.    3001    portfolio-dev
QA              Stable environment for quality audits.          3002    portfolio-qa
Production      The live, user-facing version of the portfolio. 3003    portfolio-prod

All environments run in isolated Alpine Linux containers to ensure zero interference between stages and minimal resource usage.

--------------------------------------------------------------------------------

5. VISUAL PROOF AND VERIFICATION
The system has been verified with stable Jenkins statuses:
- Portfolio-CI: Stable (Build #23 verified Success)
- Portfolio-QA: Stable (Build #12 verified Success)
- Portfolio-Prod: Stable (Build #19 verified Success)
- Unit Testing: 15/15 tests successfully passed in Jenkins' console logs.

--------------------------------------------------------------------------------
Documented by Antigravity AI on March 26, 2026.
