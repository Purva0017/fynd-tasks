# Task 1 — Rating Prediction via Prompting (Yelp Reviews)

This folder contains the full work for **Task 1: Rating Prediction via Prompting**, where Yelp review texts are classified into **1–5 star ratings** using prompt-engineering (no model training).  
The LLM is instructed to return **strict JSON output** for automation and evaluation.

---

## Objective

Design prompts that classify Yelp reviews into **1–5 star ratings**, returning JSON:

```json
{
  "predicted_stars": 4,
  "explanation": "Brief reasoning for the assigned rating."
}
```

---

## Dataset

**Kaggle:** Yelp Reviews Dataset  
https://www.kaggle.com/datasets/omkarsabnis/yelp-reviews-dataset

A random sample of **~200 reviews** is used for evaluation.

---

## Prompting Approaches Implemented

Three prompt versions were designed and tested:

### V1 — Baseline (Strict JSON + short rubric)
- Minimal instructions
- Small rubric mapping sentiment → stars
- Purpose: baseline comparison

### V2 — Rubric + decision rules (Best balance)
- More detailed rubric
- Adds decision priorities (overall satisfaction, severity of complaints, etc.)
- Adds stability rule: if borderline → choose lower rating
- Purpose: improved accuracy & reliability

### V3 — Few-shot + rubric (Best accuracy, higher token use)
- Includes examples for 1/2/3/4/5-star reviews
- Strong format imitation → higher JSON validity
- Purpose: highest accuracy and JSON validity

Prompt templates are defined in the notebook as `prompt_v1()`, `prompt_v2()`, `prompt_v3()`.

---

## Evaluation Metrics

Each prompt is evaluated on the same sampled dataset using:

1) **Accuracy (Actual vs Predicted)**  
Exact match percentage:

Accuracy = (# predicted == actual) / N

2) **JSON Validity Rate**  
% of outputs that:
- parse as JSON
- include required keys
- return valid integer rating 1–5

3) **Reliability / Consistency**  
To measure stability:
- select 20 reviews
- run predictions **3 times**
- compute % of reviews that received the **same rating across all repeats**

---

## Reliability / “No Data Loss” Design

To avoid losing results from API failures or rate limits:
- Each API call is **checkpointed immediately** to CSV (append mode)
- If the notebook crashes, it resumes without recomputing completed rows

Checkpoint files:
- `checkpoint_v1.csv`, `checkpoint_v2.csv`, `checkpoint_v3.csv`
- `consistency_v1.csv`, `consistency_v2.csv`, `consistency_v3.csv`

---

## How to Run (Google Colab)

### 1) Install dependencies
```bash
pip install kaggle groq pandas numpy tqdm tabulate
```

### 2) Kaggle download setup
- Download `kaggle.json` from Kaggle → Account → API token
- Upload in Colab
- Run the notebook cells to download + unzip the dataset

### 3) Groq keys
This notebook uses **4 Groq API keys** (to isolate token budgets):
- Key for V1
- Key for V2
- Key for V3
- Key for Consistency runs

### 4) Run notebook
Open and run:
- `Task1_Yelp_Prompting.ipynb`

---

## Outputs

Generated files (CSV):
- `all_prompt_outputs.csv` → merged outputs for V1/V2/V3
- `comparison_metrics.csv` → accuracy/validity/consistency comparison table
- `results_prompt_v1.csv`, `results_prompt_v2.csv`, `results_prompt_v3.csv`

---

## Notes / Trade-offs

- V1 is fastest but weaker JSON compliance & stability
- V2 is the best balance of accuracy vs consistency vs cost
- V3 gives the best performance but consumes more tokens due to few-shot examples
