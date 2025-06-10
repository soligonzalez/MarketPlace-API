import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de AgroMarket',
    version: '1.0.0',
    description: 'Documentación de la API del trabajo integrador',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Cambialo por tu URL de Render cuando lo subas
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./swaggerDoc.js'], // este archivo lo creamos en el paso siguiente
};

const swaggerSpec = swaggerJSDoc(options);

function configurarSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export default configurarSwagger;
