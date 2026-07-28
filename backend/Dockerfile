FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chmod +x entrypoint.sh

ENV FLASK_APP=app.py
EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
