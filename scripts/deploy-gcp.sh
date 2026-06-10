#!/usr/bin/env bash
# Deploy Python + Java backends to Google Cloud Run.
# Frontend stays on Render — update Render env vars from the output at the end.
#
# Prerequisites:
#   1. New GCP account with $300 trial (or billing enabled)
#   2. gcloud CLI installed and logged in: gcloud auth login
#   3. Set your project: gcloud config set project YOUR_PROJECT_ID
#
# Usage:
#   ./scripts/deploy-gcp.sh
#   ./scripts/deploy-gcp.sh YOUR_PROJECT_ID us-central1 https://your-app.onrender.com

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_ID="${1:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${2:-us-central1}"
FRONTEND_URL="${3:-https://options-frontend.onrender.com}"

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "Error: No GCP project set. Run:"
  echo "  gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "Project:  ${PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Frontend: ${FRONTEND_URL}"
echo ""

echo "Enabling required APIs (first time only)..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project="${PROJECT_ID}"

PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
echo "Project number: ${PROJECT_NUMBER}"

echo "Setting IAM permissions for Cloud Build (required on new GCP projects)..."
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin" --quiet >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/storage.admin" --quiet >/dev/null 2>&1 || true

gcloud iam service-accounts add-iam-policy-binding \
  "${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" --quiet >/dev/null 2>&1 || true

for ROLE in storage.admin artifactregistry.writer logging.logWriter cloudbuild.builds.builder; do
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/${ROLE}" --quiet >/dev/null 2>&1 || true
done
echo "IAM permissions set."

echo ""
echo "=== Deploying Python API ==="
gcloud run deploy options-python-api \
  --source "${ROOT_DIR}/option-recommender-python" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=3 \
  --timeout=120

PYTHON_URL="$(gcloud run services describe options-python-api --project="${PROJECT_ID}" --region="${REGION}" --format='value(status.url)')"
echo "Python URL: ${PYTHON_URL}"

echo ""
echo "=== Deploying Java API ==="
gcloud run deploy options-java-backend \
  --source "${ROOT_DIR}/option-recommender-java" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=3 \
  --timeout=120 \
  --set-env-vars="PYTHON_API_URL=${PYTHON_URL}/,FRONTEND_URL=${FRONTEND_URL}"

JAVA_URL="$(gcloud run services describe options-java-backend --project="${PROJECT_ID}" --region="${REGION}" --format='value(status.url)')"
echo "Java URL: ${JAVA_URL}"

echo ""
echo "=== Smoke tests ==="
curl -sf "${PYTHON_URL}/ping" && echo "  Python /ping OK"
curl -sf "${JAVA_URL}/ping" && echo "  Java /ping OK"

echo ""
echo "=============================================="
echo "GCP backends deployed."
echo ""
echo "Update Render Static Site environment variables:"
echo "  VITE_BACKEND_URL=${JAVA_URL}"
echo "  VITE_BACKEND_PYTHON_URL=${PYTHON_URL}"
echo ""
echo "Then: Manual Deploy → Clear build cache & deploy"
echo ""
echo "Optional: shut down old Render Python/Java services to avoid confusion."
echo "=============================================="
