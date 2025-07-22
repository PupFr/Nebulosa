#!/bin/bash
source $(dirname "$0")/../.env

MESSAGE="$1"

curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
  -d chat_id="$LOG_CHANNEL_ID" \
  -d text="$MESSAGE"

