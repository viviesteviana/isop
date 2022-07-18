require('dotenv').config();
const Hapi = require('@hapi/hapi');

//
const authentication = require('./api/Authentication');
const Database = require('./conf/Database');
const AuthenticationService = require('./services/mysql/AuthenticationService');
const AuthenticationValidator = require('./validator/authentication');

const init = async () => {
    const database = new Database();
    const authenticationService = new AuthenticationService(database);

    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: () => ({
            name: 'Neng Fia Anggita Zalsabila',
        }),
    });

    //defines internal plugings
    await server.register([
        {
            plugin: authentication,
            options: {
                service: authenticationService,
                validator: AuthenticationValidator,
            },
        },
    ]);

    await server.start();
    console.log(`Server running at ${server.info.uri}`);


};

init();
