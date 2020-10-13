#!/bin/bash
mysql -u root -ptoor < ./db/db.sql
mysql -u root -ptoor airbnb < ./db/users.sql
mysql -u root -ptoor airbnb < ./db/apartments.sql
mysql -u root -ptoor airbnb < ./db/reservations.sql