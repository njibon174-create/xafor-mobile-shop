#!/bin/sh
cd /root/xafor-mobile-shop
echo "--- Starting build ---"
./node_modules/.bin/vite build 2>&1
echo "--- Build finished with code: $? ---"
ls -la dist/ 2>/dev/null | head -10
