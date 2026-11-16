# ScamShield LK: Sinhala/Tamil Scam SMS Detector

Final Year Research Project, Mohamed Aslam Shazwana (E201057)
BEng (Hons) Software Engineering, ESOFT / London Metropolitan University, Feb 2026 batch
Supervisor: Ms. Niruni Fonseka

**Status: complete.** The dataset, the models, the evaluation, the Flask API, the React web app
and the Flutter mobile app are finished and tested. A few features from the original plan were
left out of the submitted version; section 6 lists them.

---

## 1. What this project is

A machine learning system that classifies SMS messages as **scam**, **spam** or **legitimate**,
built for Sri Lanka's multilingual, code-mixed texting reality (Sinhala script, Tamil script,
English, and "Singlish"/"Thanglish" romanized text).

What the project delivers:
1. A documented dataset: 127 Sri Lankan messages (115 verbatim, 12 reconstructed from documented
   incidents) kept private for testing, and 3,000 AI-assisted synthetic messages for training,
   with every row labelled by its source.
2. A leakage-controlled comparison of a keyword baseline, TF-IDF with Logistic Regression and
   SVM, and mBERT, tested on 113 real messages that were never used for training.
3. Word-level explanations: each result shows the words that pushed it towards scam, checked
   against LIME.
4. A Flask API serving the model to a React web app and a Flutter mobile app, with community
   scam reports and admin moderation.

## 2. Folder map

```
scamshield-lk/
├── ml/                     # everything research/model related
│   ├── data/               # datasets (real + labeled synthetic augmentation)
│   ├── src/                # pipeline scripts
│   └── models/             # trained model artifacts (.pkl) and result files
├── backend/                # Flask REST API
│   ├── app.py
│   ├── routes/
│   └── models/             # DB models (SQLAlchemy)
├── mobile/                 # Flutter app (Home/History/Report/Dashboard tabs)
├── web/                    # React web app (public site, user portal, admin console)
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

**Demo community reports (optional).** A fresh database only has the scam categories, so the
dashboards' community stats (`GET /api/stats`) start empty. For a presentation, add 44 approved
sample reports (32 in the last 7 days) and remove them again afterwards:
```bash
cd backend
python -m scripts.seed_demo_reports            # needs DATABASE_URL, as above
python -m scripts.seed_demo_reports --remove   # deletes exactly those rows
```
Inside Docker, rebuild once so the image has the script (`docker compose up -d --build`), then
run `docker compose exec backend python -m scripts.seed_demo_reports`.
They are community reports only and never enter the training data.

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

**Demo account (optional).** Set `VITE_DEMO_EMAIL` and `VITE_DEMO_NAME` in your own
`web/.env`. When that email signs in, its history and reports are filled once with sample
checks (`src/data/demoAccount.js`), so the dashboards have content for a presentation. The
mock sign-in never stores or checks the password. Restart `npm run dev` after editing `.env`.

### 3.7 Mobile app
```bash
cd mobile
flutter pub get
flutter run --dart-define=SCAMSHIELD_API_URL=http://10.0.2.2:5000/api
```
Bottom tabs: Home · History · Report · Dashboard. Falls back to a basic on-device keyword
check (`OfflineModelService`) when the API is unreachable. There is no on-device model.
Without an Android emulator, `flutter build web --dart-define=SCAMSHIELD_API_URL=http://localhost:5000/api`
builds the same app for the browser.

**Demo account (optional).** Copy `dart_defines.example.json` to `dart_defines.local.json`
(gitignored), fill in `DEMO_EMAIL` and `DEMO_NAME`, and add
`--dart-define-from-file=dart_defines.local.json` to `flutter run` or `flutter build`. When that
email signs in, the device history is filled once with sample checks (`lib/services/demo_data.dart`).

### 3.8 Tests
From the repository root, with the backend and ML packages installed:
```bash
pip install -r requirements-dev.txt
python -m pytest
```
The tests cover:
- admin sign-in and tokens;
- report checks, the moderation queue and the public stats;
- the prediction API;
- text cleaning and the scoring helpers.

Each test uses its own throwaway SQLite database. Tests that need the trained model (`ml/models/*.pkl`)
or the private dataset skip themselves when those files are missing. With both present, one test
checks that the API gives the same label as the evaluated model for every real test message.
The mobile app has its own checks: `flutter analyze` and `flutter test` in `mobile/`.

### 3.9 Whole system with Docker
With Docker Desktop running, and `SECRET_KEY` and `ADMIN_PASSWORD` set in `.env`:
```bash
docker compose up -d --build
```
This starts PostgreSQL, Redis and the backend on http://localhost:5000. On start-up the backend
runs the migrations, seeds the categories and loads the model from `ml/models`. Then run the web
app (§3.6) as usual. `docker compose down` stops everything, and `docker compose down -v` also
deletes the database.

## 4. Dataset

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

## 5. Results

Headline result on the 113 real messages (scam vs not-scam, 95% confidence intervals). The
models were trained on synthetic data only:

| Model | F1 | AUC-ROC |
|---|---|---|
| Keyword baseline | 0.16 [0.00–0.31] | 0.54 [0.49–0.59] |
| TF-IDF + LogReg (served by the API) | 0.67 [0.57–0.77] | 0.83 [0.75–0.90] |
| TF-IDF + SVM | 0.66 [0.55–0.76] | 0.79 [0.71–0.87] |
| mBERT | 0.53 [0.41–0.63] | 0.56 [0.45–0.67] |

mBERT scored highest on the synthetic test split but did not beat TF-IDF on real messages. Full
results, including precision, recall and the other experiments, are in
`ml/data/DATASET_README.md` ("Latest results").

## 6. Project status

Completed:
- [x] Interim report
- [x] Real dataset collected and documented, plus the supervisor-approved synthetic set
- [x] Keyword baseline, TF-IDF + LogReg/SVM trained and evaluated
- [x] mBERT fine-tuned on Colab and compared
- [x] Word-level explanations in the apps, with the LIME check
- [x] Flask API, React web app and Flutter mobile app integrated end to end
- [x] Community reporting with admin moderation
- [x] Automated tests, and the whole system running in Docker
- [x] Architecture, flowchart and data diagrams brought in line with the code
- [x] Final report

Left out of the submitted version:
- Cloud hosting. The system runs locally with Docker Compose (section 3.9).
- An on-device model. The mobile app uses a keyword check when offline.
- Growing the real dataset to 500–1,000 messages. 127 were gathered, and they are used for
  testing only.
- Real user accounts. Sign-in in the user portal and the mobile app is a front-end mock. Admin
  sign-in is checked by the backend.

## 7. Running the submitted version

The submitted version runs locally: start the backend with Docker Compose (section 3.9), then
the web app (section 3.6) and the mobile app (section 3.7). It is not hosted online.
