
db.createUser({
    user: 'the_username',
    pwd: 'the_password',
    roles: [
        {
            role: 'dbOwner',
            db: 'the_database'
        }
    ]
})

db.createCollection('jehle_verb_mongo');

db.createCollection('users');
db.createCollection('test_users');

