var Hapi = require('hapi')
var Knex =require('./configs/knex')
var jwt = require('jsonwebtoken')

var server = new Hapi.Server()
const SECRET = 'thisisasupersecretkey'

server.connection({port: 3000})

server.register(require('hapi-auth-jwt2'), function(err) {
    if (err) console.log(err)
    
    server.auth.strategy('donkeystrategy', 'jwt', {
        // secret key
        key: SECRET,
        validateFunc: function(decoded, request, callback) {
            if (!decoded.id) {
                return callback(null, false)
            } else {
                return callback(null, true)
            }
        },
        verifyOptions: {algorithm: ['HS256']}
    })    
    
    server.route({
        method: 'POST',
        path: '/api/users',
        handler: function(request, reply) {
            var insertOperation = Knex('user')
            .insert({
                username: request.payload.username,
                email: request.payload.email,
                password: request.payload.password    
            })
            .then(function() {
                reply({
                    status: 'ok'
                })
            })
            .catch(function(err) {
                reply(err)
            })
        }
    })

    server.route({
        method: 'POST',
        path: '/api/auth',
        handler: function(request, reply) {
            var getOperation = Knex('user')
            .where({
                email: request.payload.email
            })
            .select('id', 'password')
            .then(function(userArr) {
                user = userArr[0]
                if (!user) {
                    return reply({
                        error: true,
                        errMessage: 'Please register for an account'
                    })
                }
                if (user.password === request.payload.password) {
                    var token = jwt.sign({
                        // we can add anything we want
                        id: user.id,
                        jowin: 'ispretty'
                    },
                    SECRET,
                    {
                        algorithm: 'HS256',
                        expiresIn: '1h'
                    })
                    return reply({
                        token: token
                    })    
                } else {
                    return reply({
                        error: true,
                        errMessage: 'Incorrect Password'
                    })
                }
            })
            .catch(function(err) {
                reply(err)
            })
        }
    })
    
    server.route({
        method: 'POST',
        path: '/api/notes',
        config: {
            auth: {
                strategy: 'donkeystrategy'
            }
        },
        handler: function(request, reply) {
            var id = request.auth.credentials.id
            
            var insertOperation = Knex('note')
            .insert({
                title: request.payload.title,
                description: request.payload.description,
                owner: id
            })
            .then(function() {
                reply({
                    status: 'ok'
                })    
            })
            .catch(function(err) {
                reply(err)
            })
        }
    })
    
    server.route({
        method: 'GET',
        path: '/api/notes',
        config: {
            auth: {
                strategy: 'donkeystrategy'
            }
        },
        handler: function(request, reply) {
            var id = request.auth.credentials.id
            
            const getOperation = Knex('note')
            .where({
                owner: request.auth.credentials.id
            })
            .select('id', 'title', 'description', 'created_at')
            .then(function(noteArr) {
                reply(noteArr)
            })
            .catch(function(err) {
                reply(err)
            })
        }
    })

    server.start(function(err) {
        if (err) throw err
        
        console.log('Server listening at: ', server.info.uri)
    })
})

