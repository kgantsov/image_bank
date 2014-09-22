FROM ubuntu:14.04

RUN apt-get -y update
RUN apt-get -y upgrade

# Install Python Setuptools
RUN apt-get install -y python-setuptools python-imaging python-dev
RUN apt-get install -y node nodejs npm
RUN npm install -g bower

# Install pip
RUN easy_install pip

# Expose ports
# EXPOSE 8000

ADD . /code
WORKDIR /code

RUN pip install -r requirements.txt
RUN python manage.py migrate

CMD python manage.py runserver
