PORTFOLIO CI/CD PIPELINE SETUP GUIDE

This guide explains how to set up the entire automated pipeline from GitHub to Jenkins and Docker containers.

PREREQUISITES
- Docker Desktop (installed and running).
- GitHub Account with access to your repository.
- Node.js (for local testing).

--------------------------------------------------------------------------------

1. INITIAL REPOSITORY SETUP
- Clone the Project: Use the command "git clone https://github.com/KairosRoku/Portfolio-website.git".
- Verify Configuration: Ensure the Jenkinsfile.dev, Jenkinsfile.qa, and Jenkinsfile.prod are present in the root directory.

--------------------------------------------------------------------------------

2. LAUNCH JENKINS IN DOCKER
- Prepare the Jenkins Environment: Use the provided docker-compose.jenkins.yml.
- Build and Start: Use the command "docker-compose -f docker-compose.jenkins.yml up -d --build".
- Access Jenkins: Use the browser to open "http://localhost:8081".
- Unlock Jenkins: Use the command "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword" to get the password.

--------------------------------------------------------------------------------

3. CONFIGURE JENKINS TOOLS
- NodeJS Tool Configuration: Go to Manage Jenkins > Global Tool Configuration.
- Add NodeJS Installation: Use the name "node20" and the version "22.x" or higher.

--------------------------------------------------------------------------------

4. CREATE THE PIPELINE JOBS
Create 3 separate Pipeline jobs in the Jenkins dashboard:

Job A: Portfolio-CI (Automatic)
- Definition: Pipeline script from SCM.
- SCM: Git
- URL: https://github.com/KairosRoku/Portfolio-website.git
- Script Path: Jenkinsfile.dev
- Trigger: GitHub hook trigger for GITScm polling.

Job B: Portfolio-QA (Scheduled)
- Definition: Pipeline script from SCM.
- Script Path: Jenkinsfile.qa
- Trigger: Build periodically (Schedule: 0 0 * * *).

Job C: Portfolio-Prod (Manual)
- Definition: Pipeline script from SCM.
- Script Path: Jenkinsfile.prod
- Trigger: Manual only.

--------------------------------------------------------------------------------

5. VERIFY THE DEPLOYMENT
- Trigger a Build: Push any change to GitHub. Portfolio-CI will automatically start.
- Check Containers: Use the command "docker ps" to see the three environments:
  - portfolio-dev (Port 3001)
  - portfolio-qa (Port 3002)
  - portfolio-prod (Port 3003)
- Access the App: Open your browser at http://localhost:3001.

--------------------------------------------------------------------------------
Setup Complete. Your pipeline is now fully automated and Docker-ready.
