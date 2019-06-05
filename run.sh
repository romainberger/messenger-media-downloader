#!/bin/bash

# use bash prompt to avoid installing a
# million dependencies for simple stuff

echo -n "Email or phone number: "
read email
echo -n "Password: "
read -s password
echo
echo -n "Conversation URL: "
read conversation

node ./index.js $email $password $conversation
