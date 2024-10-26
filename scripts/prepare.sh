#!/bin/bash
sudo apt update
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git postgresql

# install code
git clone \
    -b main \
    https://github.com/viruskizz/workflow-studio-management.git

# Config db
sudo -u postgres psql
create database animation;
create user admin with encrypted password 'secret';
grant all privileges on database animation to admin;