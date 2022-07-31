
import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Offerer API',
      description: 'Offerer API Information',
      contact: {
        name: 'Illia Soroka',
      },
      servers: ['http://localhost:3333'],
    },
  },
  apis: ['src/routes/**/*.ts'],
};

export default swaggerJsDoc(swaggerOptions);
