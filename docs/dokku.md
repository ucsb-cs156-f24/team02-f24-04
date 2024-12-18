
# Deploying on Dokku

To deploy on dokku, see the instructions here:


On your dokku server (once per team; the dokku server is shared by the entire team):

1. Create the app: 
   ```
   dokku apps:create team02
   ```
2. Enable HTTPS: <https://ucsb-cs156.github.io/topics/dokku/enabling_https.html>
3. Enable Postgres: <https://ucsb-cs156.github.io/topics/dokku/postgres_database.html>
4. Setup Google OAuth: <https://ucsb-cs156.github.io/topics/oauth/oauth_google_setup.html>
5. Setup Environment Variables: <https://ucsb-cs156.github.io/topics/dokku/environment_variables.html>
6. Sync with repo (substitute your own team name):
   ```
   dokku git:sync team02 https://github.com/ucsb-cs156-s24/team02-s24-6pm-4 main
   ```
>>>>>>> starter/main

You will also need the command:


7. Build app:
   ```
   dokku ps:rebuild team02
   ```

Any time you need to redeploy, you can do so by repeating steps 6 and 7.

# Deploying a dev instance on Dokku

You can also create a private dev instance on Dokku
where you can try out your changes.  That allows you to 
deploy branches other than `main` and see what happens.

1. Create the app: 
   ```
   dokku apps:create team02-yourName-dev
   ```
2. Do steps (2) through (5) above.
3. Sync with repo (substitute your own team name and branch name):
   ```
   dokku git:sync https://github.com/ucsb-cs156-s24/team02-s24-6pm-4 team02-yourName your-branch-name
   ```
4. Build app:
   ```
   dokku ps:rebuild team02-yourName-dev
   ```

Any time you need to redeploy, you can do so by repeating steps 3 and 4.

