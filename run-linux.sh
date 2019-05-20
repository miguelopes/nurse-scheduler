#!/bin/sh

set -eux

. ./backend/profile-linux.sh
python2 ./backend/server.py &

# For development:
# npm start

# For production:
# npm install
# npm run build
