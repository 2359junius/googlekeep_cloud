Git Repo: https://github.com/2359junius/googlekeep_cloud

- mkdir googlekeep && cd $_
- git init, npm init, touch .gitignore
- npm install --save mysql knex
- npm install -g knex
- touch knexfile.js
- This will be used to run the migration files
    - knex migrate:make migration_name
    - knex migrate:make create_user.js
    - Knex migrate:make create_note.js
    - knex migrate:latest 
    - knex migrate:rollback
- View DB with Sequel Pro to see that Tables are created
