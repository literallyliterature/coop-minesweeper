#!/usr/bin/env sh

# based on https://medium.com/swlh/deploy-vue-app-to-github-pages-2ada48d7397e

# abort on errors
set -e
# build
npm run build
# navigate into the build output directory
cd dist
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:literallyliterature/hello-world.git master:gh-pages
cd -