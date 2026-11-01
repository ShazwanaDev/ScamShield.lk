# ScamShield LK — Sinhala/Tamil Scam SMS Detector

Final Year Research Project — Mohamed Aslam Shazwana (E201057)
BEng (Hons) Software Engineering — ESOFT / London Metropolitan University, Feb 2026 batch
Supervisor: Ms. Niruni Fonseka

---

## 1. What this project is

A machine learning system that classifies SMS messages as **Scam** or **Legitimate**,
built specifically for Sri Lanka's multilingual, code-mixed texting reality
(Sinhala script, Tamil script, English, and "Singlish"/"Thanglish" romanized text).

Core research contributions:
1. First labelled real Sri Lankan scam SMS dataset (Sinhala/Tamil/Singlish/code-mixed).
2. Word-level explainability (LIME + TF-IDF feature importance) so predictions aren't a black box.
3. Comparison of a lightweight TF-IDF+LogReg/SVM baseline against mBERT for this
   low-resource code-mixed setting.

## 2. Folder map

```
scamshield-lk/
├── ml/                     # everything research/model related
│   ├── data/               # datasets (real + labeled synthetic augmentation)
│   ├── src/                # pipeline scripts
│   └── models/             # trained model artifacts land here (.pkl, .tflite)
├── backend/                # Flask REST API
│   ├── app.py
│   ├── routes/
│   └── models/             # DB models (SQLAlchemy)
├── mobile/                 # Flutter app (Check/Report/History/Stats tabs)
├── web/                    # React web app (Classify/Report/Dashboard/Admin/About)
├── docs/                   # architecture notes, ERD notes, diagram fix notes
├── docker-compose.yml      # local Postgres + Redis
└── README.md               # this file
```

## 3. Setup — do this top to bottom

### 3.1 Prerequisites
- Python 3.11 or 3.12 (the pinned packages in `requirements.txt` have no builds for 3.13+;
  on Windows, `py -3.12 -m venv venv` picks the right version)
- Node 18+ (for the React web app)
- Flutter 3.x SDK (for the mobile app)
- Docker Desktop (for Postgres + Redis locally)
- Git

### 3.2 Clone / unzip and enter the project
```bash
cd scamshield-lk
```

### 3.3 ML environment
```bash
cd ml
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3.4 Run the ML pipeline (in order)
First copy the private real dataset into place. It's gitignored and must never be committed:
```bash
cp /path/to/private/ScamShield_Verified_Real_Dataset_FINAL.xlsx data/raw/
```
Then run, from `ml/`:
```bash
python src/preprocessing.py          # merges real + synthetic, cleans, dedups, splits; writes data/processed/dataset.csv
python src/keyword_baseline.py       # rule-based baseline, scored on the same test sets
python src/tfidf_baseline.py         # 3-way TF-IDF + LogReg/SVM trained on synthetic only; saves ml/models/*.pkl
python src/explainability_lime.py    # LIME + TF-IDF explanations for real scam examples (private output)
python src/evaluate.py               # real-message test (A), synthetic+real CV (B), synthetic 3-way (C)
python src/export_web_results.py     # copies the measured results into web/src/data/modelResults.json
```
`ml/data/DATASET_README.md` documents the data sources, how the synthetic data was generated, the
evaluation protocol and the latest results.
mBERT fine-tuning is meant to run on Google Colab GPU (CPU fine-tuning of mBERT
is impractically slow) — see `ml/src/mbert_colab_notebook_notes.md`.

### 3.5 Backend (Flask API)
```bash
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# start local Postgres + Redis
cd ..
docker compose up -d

cd backend
export DATABASE_URL=postgresql://scamshield:scamshield@localhost:5432/scamshield
export REDIS_URL=redis://localhost:6379/0
export SECRET_KEY=<a long random value>     # signs admin sessions
export ADMIN_PASSWORD=<your admin passphrase>  # admin sign-in stays off while unset
flask --app app run --debug
```
API will be live at `http://localhost:5000`. With Docker Compose, put `SECRET_KEY` and
`ADMIN_PASSWORD` in a `.env` file next to `docker-compose.yml` (see `.env.example`).

### 3.6 Web frontend
```bash
cd web
cp .env.example .env    # set VITE_API_URL
npm install
npm run dev
```
The public site, the user portal (`/app`) and the admin console (`/admin`) all run from this
app. Admin sign-in at `/admin/login` is checked by the backend: the passphrase is the
backend's `ADMIN_PASSWORD`, and the moderation API refuses requests without the signed
session token it hands out. User accounts in `/app` are still a frontend-only mock.

### 3.7 Mobile app
```bash
cd mobile
flutter pub get
flutter run --dart-define=SCAMSHIELD_API_URL=http://10.0.2.2:5000/api
```
Bottom tabs: Check · Report · History · Stats. Falls back to a basic on-device keyword
check (`OfflineModelService`, not the real TFLite model yet) when the API is unreachable —
see §6 open issues.

## 4. Dataset status (as of 25 Oct 2026)

| Source | Location | Count | Use |
|---|---|---|---|
| Real collected messages | `ml/data/raw/` (private, gitignored) | 115 verbatim + 12 reconstructed | **Test set only** for the primary models; also used in the synthetic+real CV experiment |
| AI-assisted synthetic augmentation (supervisor-approved 8 Oct 2026) | `ml/data/synthetic/` | 3,000 (231 templates) | Training data, with a template-grouped synthetic test split |

Models are 3-way (legitimate / scam / spam). The headline real-world result is scam vs not-scam
on the real messages, because those carry only scam/legitimate labels. See
`ml/data/DATASET_README.md` for provenance, the generation procedure, the evaluation protocol,
results and limitations.

⚠️ Integrity rule enforced by the pipeline: every row carries `source_type` = `real` /
`reconstructed` / `synthetic_augmentation`. Synthetic rows are never reported as collected data,
and the primary models never train on real messages.

## 5. Known issues to fix before interim report submission

- Model training flowchart: fix reversed order ("Labelled SMS Dataset" currently
  appears before "Collect & Label Dataset" — swap them).
- Community reporting flowchart: add the missing admin approve/reject decision branch.
- Architecture diagram: add Redis (currently missing despite being in the stack).

## 6. Deliverables checklist

- [ ] Interim report (due end of July) — use `Interim_Report_Template.docx`
- [ ] Grow real dataset toward 500–1000 messages
- [ ] Fix the 3 known diagram issues above
- [x] Train + evaluate TF-IDF/LogReg/SVM baseline (results in `ml/data/DATASET_README.md`, "Latest results")
- [x] Fine-tune mBERT on Colab, compare metrics (results in `ml/data/DATASET_README.md`)
- [ ] LIME explainability demo
- [ ] Flutter + React + Flask integrated demo
- [ ] Deploy to Railway for the live demo period

## 7. Hosting

Use **Railway** (not Supabase) for the demo/submission period — avoids free-tier
inactivity pausing mid-demo, and matches the architecture docs already written.
