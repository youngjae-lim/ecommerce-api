## Hosted Project

[E-Commerce API Heroku URL](https://ecommerce-api-prod.herokuapp.com/)

#### Deploy on Heroku

```shell
# Remove existing git repo
rm -rf .git 

# Initialize git and stage/commit it
git init
git add .
git commit -m "initial commit"

# Use heroku-cli to login
heroku login

# Create a new app with an app name 
heroku create "App Name"

# Check if your remote git repository is heroku
git remote -v

# setup env vars in Heroku app settings through GUI

# Push your local git repository to heroku
git push heroku master/main
```
