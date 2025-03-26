# GitOps-Based Deployment with ArgoCD & Kubernetes

## Overview
This project implements a **GitOps-based CI/CD pipeline** using **Jenkins, Docker, Kubernetes, and Argo CD** to automate deployments whenever code changes are committed to GitHub.

## Workflow
1. **Commit to GitHub** → Triggers Jenkins pipeline.
2. **Jenkins Actions**:
   - Clones repo
   - Builds Docker image
   - Pushes image to Docker Hub
3. **Kubernetes & Argo CD**:
   - Argo CD monitors repo for changes
   - Kubernetes automatically pulls the latest image & updates deployment

## Tech Stack
- **Jenkins** (CI/CD automation)
- **Docker** (Containerization)
- **Kubernetes** (Orchestration)
- **Argo CD** (GitOps-based deployment)
- **GitHub** (Code & manifests storage)
- **Docker Hub** (Image repository)

## Setup & Installation
1. Install **Jenkins** and configure a pipeline with the necessary plugins.
2. Deploy **Kubernetes cluster** with Argo CD installed.
3. Configure **Argo CD** to monitor GitHub repository.
4. Ensure Kubernetes **manifests pull the latest image** automatically.

## How It Works
1. Make a code change and push it to GitHub.
2. Jenkins job runs, builds, and pushes an updated Docker image.
3. Kubernetes manifests detect the latest image.
4. Argo CD syncs the latest changes and deploys them automatically.

## Benefits
✅ Fully automated deployments
✅ Version-controlled infrastructure
✅ Scalable & reliable GitOps approach

## Troubleshooting
- **Argo CD not syncing?** Check logs: `kubectl logs -n argocd <argocd-server-pod>`
- **Pods not running?** Inspect with `kubectl logs <pod-name>`
- **Service LoadBalancer pending?** Check with `kubectl get services`

## Future Enhancements
- **Use Helm charts** for better Kubernetes configuration
- **Integrate monitoring tools** like Prometheus & Grafana
- **Implement RBAC policies** for security-

## SnapShots
- Jenkins Pipe Stages

![image](https://github.com/user-attachments/assets/c99e219c-3ee0-47cf-bbcf-3ec24bc6de57)

- ArgoCD
![image](https://github.com/user-attachments/assets/c0f84fa6-b071-40e1-942d-39932ddfa37c)
![image](https://github.com/user-attachments/assets/711b3edd-5304-4e3d-8ee9-909e2e04a2e7)

- UI


---
This project ensures seamless, automated deployments using best DevOps practices! 🚀
