export const info = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            version: '1.0.0',
            description: 'Before starting endpoint executions, run /api/users/loginApi POST on the USER tag to avoid the authorization middleware.'
        },
        servers: [
            {
                url: 'http://localhost:8080'
            }
        ]
    },
    apis: ['./src/docs/*.yml']
};

