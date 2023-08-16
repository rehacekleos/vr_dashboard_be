import swaggerJSDoc, { OAS3Options } from "swagger-jsdoc";

export const swaggerJSDocOptions: OAS3Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'VR Dashboard',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Localhost',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization",
                    description: "Please insert: \"Bearer <API_KEY>\""
                }
            }
        }
    },

    apis: ['./**/*.ts'],
};


/**
 * @swagger
 * tags:
 *  - name: Default
 *    description:
 *  - name: Auth
 *    description: Login and register
 *  - name: Organisation
 *    description: Organisation
 */

/**
 * @swagger
 * definitions:
 *   LoginUser:
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * parameters:
 *   organisationId:
 *     name: organisationId
 *     in: path
 *     description: ID of organisation
 *     required: true
 */