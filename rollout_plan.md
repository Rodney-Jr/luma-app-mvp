# Luma Rollout Plan (summary)

Phase 0: Local MVP (this repo)
- Validate core flows: session creation, chatbot, counsellor registration
- Invite 10 volunteer counsellors for pilot

Phase 1: Hosted MVP
- Deploy to EC2 using docker-compose
- Add domain, SSL (ACM/CloudFront or Let's Encrypt)
- Integrate Stripe/Paystack for donations

Phase 2: Harden and scale
- Move DB to RDS/Postgres with backups
- Add logging (CloudWatch / ELK), monitoring, and alerts
- Replace docker-compose with ECS/Fargate or EKS
- Add authentication for counsellors/admins (JWT + refresh)

Phase 3: Features
- Real-time chat persistence and message search
- LLM-based triage chatbot with safety filters
- Scheduling / availability, counselor ratings
AWS 