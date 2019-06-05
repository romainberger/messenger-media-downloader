#!/bin/bash

echo -n "Email or phone number:"
read email
echo -n "Password:"
read -s password
echo

# echo $email
# echo $password

node ./index.js $email $password
