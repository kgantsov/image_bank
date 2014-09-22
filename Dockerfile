FROM ubuntu:14.04

RUN apt-get -y update
RUN apt-get -y upgrade

# Install Python Setuptools
RUN apt-get install -y python-setuptools python-imaging python-dev libjpeg-dev libpng-dev git
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install -y nodejs
RUN npm install -g bower

# Install pip
RUN easy_install pip

# Expose ports
EXPOSE 8000

ADD . /code
WORKDIR /code

RUN pip install -r requirements.txt
RUN bower install --allow-root
RUN python manage.py migrate
RUN python manage.py loaddata webapp/fixtures/initial_data.json

CMD python manage.py runserver 0.0.0.0:8000
