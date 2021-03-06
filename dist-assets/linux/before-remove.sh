#!/usr/bin/env bash
set -eu

# Check if we're running during an upgrade step on Fedora
# https://fedoraproject.org/wiki/Packaging:Scriptlets#Syntax
if [ $1 -gt 0 ]; then
    echo not running
    exit 0;
fi

if which systemctl &> /dev/null; then
    # the user might've disabled or stopped the service themselves already
    systemctl stop mullvad-daemon.service || true
    systemctl disable mullvad-daemon.service || true
elif /sbin/init --version | grep upstart &> /dev/null; then
    stop mullvad-daemon
    rm -f /etc/init/mullvad-daemon.conf
fi
