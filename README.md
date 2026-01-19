# AI Feedback & Rating Prediction System (Task 1 + Task 2)

This repository contains solutions for two tasks:

- **Task 1:** Rating Prediction via Prompting (Yelp Reviews dataset)
- **Task 2:** Two-Dashboard AI Feedback System (Production Web App)

Both tasks use LLMs for structured JSON outputs, evaluation, and real-world web deployment.

---

## 📂 Repository Structure

```bash
.
├── task-1-rating-prediction/
│   ├── fynd-task-1.ipynb      # Jupyter notebook for rating prediction
│   ├── README.md              # Task 1 documentation
│   ├── result.csv             # Final prediction results
│   ├── output/                # Intermediate outputs & checkpoints
│   │   ├── all_prompt_outputs.csv
│   │   ├── checkpoint_v1.csv
│   │   ├── checkpoint_v2.csv
│   │   ├── checkpoint_v3.csv
│   │   └── consistency_check/
│   │       ├── consistency_v1.csv
│   │       ├── consistency_v2.csv
│   │       └── consistency_v3.csv
│   └── yelp_data/
│       └── yelp.csv           # Source Yelp reviews dataset
│
└── task-2-ai-feedback-system/
    ├── README.md              # Task 2 documentation
    ├── frontend/
    │   ├── README.md
    │   └── src/               # React + Vite + Tailwind UI
    └── backend/
        ├── README.md
        └── src/               # Spring Boot REST API + MySQL + LLM
