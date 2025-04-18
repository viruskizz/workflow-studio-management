#!/bin/bash
sudo apt update
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git vim

# install code
git clone \
    -b main \
    https://github.com/viruskizz/workflow-studio-management.git

# Install MySQL version 8.4.4
wget https://dev.mysql.com/get/mysql-apt-config_0.8.33-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.33-1_all.deb
sudo apt update
sudo apt-get install mysql-server

# Config db
mysql -u root -p\'"$MYSQL_ROOT_PASSWORD"\' <<EOF
CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER'@'%';
FLUSH PRIVILEGES;
CREATE DATABASE $MYSQL_DATABASE;
CREATE DATABASE dev_$MYSQL_DATABASE;
EOF
