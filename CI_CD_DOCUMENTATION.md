# CI/CD Architecture Documentation - Portfolio Website

## System Overview
This project implements a professional CI/CD pipeline using **Jenkins** running within a **Docker** environment. The pipeline automates the lifecycle of a **React** application (Vite-based) from code commit to deployment in multiple environments (Dev, QA, and Production).

## CI/CD Architecture
The architecture follows a containerized approach where Jenkins acts as the orchestrator, and Docker handles the application's runtime environments.

- **Trigger Source**: GitHub Repository
- **Orchestrator**: Jenkins (running in a Docker container)
- **Runtime**: Docker Containers for Dev (Port 3001), QA (Port 3002), and Production (Port 3003).

## Tools Used
1.  **Jenkins**: Automation server for CI/CD pipelines.
2.  **Docker**: For containerizing both Jenkins and the Portfolio application.
3.  **React / Vite / Vitest**: Modern web framework and testing suite.
4.  **Nginx**: Web server for serving the React build inside Docker.

## Pipeline Explanation
The workflow is divided into three distinct jobs:

### 1. CI Pipeline (Automatic Trigger)
- **Triggers**: On every Git push to the `main` branch.
- **Workflow**:
    1.  **Checkout**: Pull latest code from GitHub.
    2.  **Build**: Install dependencies via `npm install`.
    3.  **Test**: Execute unit tests using `vitest`.
    4.  **Deploy**: If successful, build a new Docker image and update the **Development** container on **Port 3001**.

### 2. QA Deployment (Scheduled)
- **Triggers**: Automatically every day at **12:00 AM**.
- **Workflow**:
    1.  **Checkout**: Pull latest code.
    2.  **Deploy**: Build/Run a container on **Port 3002** dedicated to QA.

### 3. Production Deployment (Manual)
- **Triggers**: Manual execution from the Jenkins UI.
- **Workflow**:
    1.  **Checkout**: Pull stable code.
    2.  **Deploy**: Build/Run the production container on **Port 3003**.

## Environment Setup
| Environment | Port | Trigger | Container Name |
| :--- | :--- | :--- | :--- |
| **Development** | 3001 | Push (CI) | `portfolio-dev` |
| **QA** | 3002 | Daily 12 AM | `portfolio-qa` |
| **Production** | 3003 | Manual | `portfolio-prod` |

## Deployment Strategy
Every deployment follows these steps:
- Stop and remove the existing container for that environment.
- Rebuild the Docker image with appropriate tags.
- Spin up a fresh container mapped to the specific environment port.

## Screenshots (Guide for Setup)
- **Jenkins Setup**: Ensure the "Git", "NodeJS", and "Docker Pipeline" plugins are installed.
- **Docker Integration**: Jenkins is configured with `/var/run/docker.sock` to enable "Docker-out-of-Docker" (DooD) builds.
- **Unit Tests**: 4 test suites are implemented covering `Hero`, `Navigation`, `Footer`, and `SectionHeader` components.
