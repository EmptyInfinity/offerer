import swaggerJsDoc from 'swagger-jsdoc';
// const swaggerDocs = require('./swagger.json');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Offerer API',
      description: 'Offerer API Information',
      contact: {
        name: 'Illya Soroka',
      },
      servers: ['http://localhost:3333'],
    },
  },
  apis: ['src/swagger-api.js'],
};

export default swaggerJsDoc(swaggerOptions);
