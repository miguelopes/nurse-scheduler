#!/usr/bin/env sh

set -eux

#
# python
#

python2 -m pip install -r requirements.txt

#
# z3
#

install_dependency() {
  url=$1
  name=$2
  curl -Lo "$name.zip" "$url/$name.zip"
  unzip "$name.zip" -d ~/lib/
  rm -f "$name.zip"
}

git_z3_url=https://github.com/Z3Prover/z3/releases/download/z3-4.8.4/
win_z3_name=z3-4.8.4.d6df51951f4c-x64-win
nux_z3_name=z3-4.8.4.d6df51951f4c-x64-ubuntu-16.04
mkdir -p ~/lib
if uname -a | grep -qiE '(cygwin|msys)'; then
  [ -d ~/lib/"$win_z3_name" ] || install_dependency "$git_z3_url" "$win_z3_name"
else
  [ -d ~/lib/"$nux_z3_name" ] || install_dependency "$git_z3_url" "$nux_z3_name"
fi
