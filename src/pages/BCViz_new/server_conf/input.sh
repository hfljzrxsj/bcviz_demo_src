sudo nginx -s reload
curl "http://127.0.0.1"

cd ./search-BCviz/
cmake .
make

sudo apt update --fix-missing --no-install-recommends --no-install-suggests
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends nginx
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends fcgiwrap
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends libfcgi-dev
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends nodejs
sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends npm
# sudo apt install --assume-yes --fix-broken --fix-missing --no-install-recommends gedit
sudo service fcgiwrap start
sudo chown -R --dereference -L --recursive root:root /etc/nginx/sites-available/default
# sudo chown -R --dereference root:root /var/run/fcgiwrap.socket
sudo chgrp --recursive www-data /var/run/fcgiwrap.socket
sudo chmod --recursive 777 /var/run/fcgiwrap.socket

# codearts-cangjie /etc/nginx/sites-available/

# sudo chown -R --dereference -L --recursive root:root /usr/lib/
# sudo mkdir /usr/lib/BCviz/
# sudo touch /usr/lib/BCviz/test.cgi
# codearts-cangjie /usr/lib/BCviz/
sudo chmod --recursive 777 /etc/nginx/sites-available/search-BCviz/MBS


# sudo apt remove nginx

apt install unzip
unzip BCviz-API-CE4D.zip
apt install cmake
sudo chmod --recursive 777 /etc/nginx/sites-available/v3/search-BCviz/MBS
sudo chmod --recursive 777 /etc/nginx/sites-available/v3/search-BCviz/v3.js

sudo nginx -t
sudo systemctl reload nginx


sudo curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install git-lfs

curl "http://127.0.0.1/api/BCviz/v3?dataset=example.txt&BCviz_file=example_cohesion.txt&s=1&t=1&problem_type=MEB"

wget https://anonymous.4open.science/api/repo/BCviz-API-CE4D/zip
unzip zip