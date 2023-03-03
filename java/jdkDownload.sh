#!/bin/sh

# Adapted from https://github.com/cspotcode/heroku-buildpack-tabula/blob/master/bin/compile

URL=http://download.oracle.com/otn-pub/java/jdk/8u144-b01/090f390dda5b47b9b721c7dfaa008135/jdk-8u144-linux-x64.tar.gz
TAR_GZ=jdk.tar.gz

curl -L --cookie "oraclelicense=accept-securebackup-cookie" $URL -o $TAR_GZ
mkdir -p jdk
tar -xzf $TAR_GZ -C jdk --strip-components=1
rm $TAR_GZ
