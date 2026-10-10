# DevOps Capstone: End-to-End CI/CD Pipeline

A Node.js (Express) web app deployed through a full DevOps pipeline: GitHub, Jenkins, Docker, AWS EC2, Prometheus and Grafana, with cron-based backups.

## Tech Stack

- App: Node.js + Express
- Source control: Git + GitHub
- CI/CD: Jenkins
- Containers: Docker + Docker Hub
- Hosting: AWS EC2 (Ubuntu)
- Monitoring: Prometheus, Grafana, Node Exporter
- Automation: Bash scripts + cron

## Run Locally

Build and run with Docker:

    docker build -t capstone-app:v1 .
    docker run -d -p 3000:3000 --name capstone-test capstone-app:v1
    curl http://localhost:3000

Or run without Docker (needs Node.js 18+):

    npm install
    npm test
    npm start

Endpoints: `/` (home page) and `/health` (returns `{"status":"ok"}`).

## CI/CD Flow

1. Developer pushes code to GitHub.
2. Jenkins is triggered by the commit.
3. Jenkins installs dependencies and runs the tests.
4. Jenkins builds the Docker image and pushes it to Docker Hub.
5. Jenkins connects to the app EC2 server over SSH and runs the new container.
6. Prometheus and Grafana monitor the server and container.
7. A cron job runs a bash script to back up logs and clean old files.
