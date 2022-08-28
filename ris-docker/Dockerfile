FROM python:3.8

RUN apt update -qy && \
    apt install -y --no-install-recommends git

WORKDIR /ris

RUN git clone https://github.com/Artori-kun/RIS

WORKDIR /ris/RIS
RUN pip install -r requirements.txt

# RUN python init_db.py

EXPOSE 5000

CMD python init_db.py && python app.py

