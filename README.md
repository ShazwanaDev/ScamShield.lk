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
- Python 3.11
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
```bash
python src/preprocessing.py          # cleans + normalizes raw CSVs in ml/data/
python src/keyword_baseline.py       # rule-based baseline for comparison
python src/tfidf_baseline.py         # TF-IDF + LogReg + SVM, trains + saves to ml/models/
python src/explainability_lime.py    # generates LIME explanations for sample predictions
python src/evaluate.py               # precision/recall/F1/AUC-ROC report + confusion matrix
```
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
flask --app app run --debug
```
API will be live at `http://localhost:5000`.

### 3.6 Web frontend
```bash
cd web
cp .env.example .env    # set VITE_API_URL and VITE_ADMIN_PASSPHRASE
npm install
npm run dev
```
Routes: `/` (classify), `/report`, `/dashboard`, `/admin/moderation` (passphrase-gated demo
deterrent only — see note below), `/about`.

⚠️ `/admin/moderation`'s passphrase gate is client-side only (it ships inside the built JS
and is not real access control). The backend `/api/moderate*` routes have **no server-side
auth at all** — this must be fixed before any real deployment, not just for the demo period.

### 3.7 Mobile app
```bash
cd mobile
flutter pub get
flutter run --dart-define=SCAMSHIELD_API_URL=http://10.0.2.2:5000/api
```
Bottom tabs: Check · Report · History · Stats. Falls back to a basic on-device keyword
check (`OfflineModelService`, not the real TFLite model yet) when the API is unreachable —
see §6 open issues.

## 4. Dataset status (as of this build)

| Source | Status | Count | Use |
|---|---|---|---|
| Real verified screenshots (CashAvatar, Gamespro, police impersonation, bank scams) | Verified real | ~10 | Primary training data |
| `Real_Reported_Scam_SMS_Examples.xlsx` | 3 rows verbatim, rest reconstructed | ~few dozen | Primary (verbatim rows only) + labelled reconstructions |
| Supervisor `sms_phishing_dataset_lk.xlsx` (128,650 rows) | Synthetic fingerprints detected | 1,500-row dedup sample | Documented **augmentation only**, labeled SYNTHETIC |
| `sri_lankan_sms_scam_dataset.xlsx` (2,000 rows) | Synthetic fingerprints detected | — | Not used as primary |
| Reddit 333+ messages | Templated/illustrative | — | Rejected |
| UCI SMS Spam Collection | Real, English only | 5,574 | Supplementary legitimate/English baseline class |

**Target: 500–1000 real labelled messages.** Current real count is small — this is
the most urgent open task. See `docs/data_collection_todo.md`.

⚠️ Important integrity rule baked into this pipeline: any file used for training
must be labeled `source_type` = `real` / `reconstructed` / `synthetic_augmentation`
in the CSV. The training script will refuse to treat `synthetic_augmentation` rows
as more than a clearly-flagged secondary component — never as primary evidence.

## 5. Known issues to fix before interim report submission

- Model training flowchart: fix reversed order ("Labelled SMS Dataset" currently
  appears before "Collect & Label Dataset" — swap them).
- Community reporting flowchart: add the missing admin approve/reject decision branch.
- Architecture diagram: add Redis (currently missing despite being in the stack).

## 6. Deliverables checklist

- [ ] Interim report (due end of July) — use `Interim_Report_Template.docx`
- [ ] Grow real dataset toward 500–1000 messages
- [ ] Fix the 3 known diagram issues above
- [ ] Train + evaluate TF-IDF/LogReg/SVM baseline
- [ ] Fine-tune mBERT on Colab, compare metrics
- [ ] LIME explainability demo
- [ ] Flutter + React + Flask integrated demo
- [ ] Deploy to Railway for the live demo period

## 7. Hosting

Use **Railway** (not Supabase) for the demo/submission period — avoids free-tier
inactivity pausing mid-demo, and matches the architecture docs already written.
