FROM python:3.11 AS builder
EXPOSE 8000
WORKDIR /backend
COPY requirements.txt /backend
RUN pip3 install -r requirements.txt --no-cache-dir
COPY . /backend
ENTRYPOINT ["python3"]
CMD ["manage.py", "runserver", "0.0.0.0:8000"]
