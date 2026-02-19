git restore .
git pull 
pnpm i --frozen-lockfile
rm -rf dist
pnpm build
sudo rm -rf /var/www/omega-paytrack/*
sudo cp -r dist/* /var/www/omega-paytrack/
docker exec reverse-proxy nginx -s reload
