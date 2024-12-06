#!/bin/sh

# Fetch latest develop
git checkout develop
git fetch origin

# Checkout AVAX instance, merge develop in, and push to deploy
git checkout avax
git pull
git merge origin/develop
git push origin HEAD

# Checkout Lombard instance, merge develop in, and push to deploy
git checkout lombard
git pull
git merge origin/develop
git push origin HEAD

# Checkout Treehouse instance, merge develop in, and push to deploy
git checkout treehouse
git pull
git merge origin/develop
git push origin HEAD

# Checkout Ethena instance, merge develop in, and push to deploy
git checkout ethena
git pull
git merge origin/develop
git push origin HEAD