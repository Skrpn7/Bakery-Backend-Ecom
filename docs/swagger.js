const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Admin API',
            version: '1.0.0',
            description: 'API documentation for the Admin service',
        },
        servers: [
            {
                url: 'http://localhost:5001',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js', './models/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
