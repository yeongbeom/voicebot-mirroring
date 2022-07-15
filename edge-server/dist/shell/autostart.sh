sleep 15
node ~/voicebot/edge-server/dist/index.js &
sleep 5
#/usr/bin/chromium --noerrdialogs --disable-infobars --kiosk https://voicebot.vercel.app/
chromium-browser --noerrdialogs --disable-infobars --kiosk https://voicebot.vercel.app/