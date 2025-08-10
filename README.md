# VitaShift

Relive your past. Redesign your future.

## Local Development

Backend (Node + TypeScript):

1. Setup
```
cd vitashift-backend
cp .env.example .env
# local dev
sed -i 's/USE_MEMORY_DB=false/USE_MEMORY_DB=true/' .env
npm install
npm run dev
```
- Health: `curl http://localhost:4000/health`
- Register/Login: `/api/auth/register`, `/api/auth/login`

Expo app:
```
cd vitashift-app
npm install
API_BASE=http://localhost:4000 npm start
```

## AWS Deployment (Terraform)

- Files under `infra/terraform` provision S3, SQS, VPC, ECS, and ALB.
- Required inputs: `aws_region`, `container_image`, `mongo_uri`, `jwt_secret`, `jwt_refresh_secret`.

Steps:
```
cd infra/terraform
terraform init
terraform apply -var "container_image=YOUR_ECR_IMAGE" -var "mongo_uri=YOUR_MONGO_URI" -var "jwt_secret=..." -var "jwt_refresh_secret=..."
```

## Environment Variables
- Backend: `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `AWS_REGION`, `S3_BUCKET`, `EMAIL_FROM`, `STRIPE_SECRET_KEY`, optional price IDs.
- App: `API_BASE` (via `app.config.ts` extra).

## Notes
- Storage presign returns 501 until `AWS_REGION` and `S3_BUCKET` are set.
- Forgot password email is sent only if SES is configured.
- Parallel Life uses an in-process worker for MVP; replace with SQS/Lambda for scale.