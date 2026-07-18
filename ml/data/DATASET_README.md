# Dataset folder — rules

## Required schema for every CSV in this folder

| column | meaning |
|---|---|
| `message` | the SMS text, exactly as received/transcribed |
| `language` | one of: sinhala, tamil, english, singlish, code_mixed |
| `label` | scam / legitimate |
| `category` | e.g. loan_scam, bank_transfer_scam, lottery_scam, delivery_scam, police_impersonation, otp_fraud, legitimate_transactional |
| `source_type` | **real** / **reconstructed** / **synthetic_augmentation** — see below |
| `source_note` | where this came from, for traceability |

## `source_type` values — do not skip this

- **real** — a verbatim, verified genuine message (screenshot transcription, personally
  received message, or a source you can point to that quotes the exact wording).
- **reconstructed** — you know the incident happened (news article, SLCERT advisory)
  but you are recreating the likely wording because the cited source didn't quote it
  verbatim. This is NOT the same as real, and must never be presented as primary
  collected data in the report.
- **synthetic_augmentation** — template-generated or LLM-generated, used only as a
  documented secondary augmentation component. Never counted toward the "real
  collected dataset" figure in the report.

## Current files

- `scamshield_new_messages.csv` — placeholder rows for the ~10 real messages transcribed
  from the screenshots ZIP. **Replace the placeholder text with the actual transcribed
  message content** — it was intentionally left blank here since the original
  screenshots aren't available in this fresh environment.
- Add further real messages as you collect them (Fact Crescendo screenshots, Reddit,
  Facebook consumer-protection groups) using this same schema.

## Splitting for training

`preprocessing.py` will produce `train.csv` / `val.csv` / `test.csv` — the test set
must be held out and never touched during training or validation, per the proposal.
