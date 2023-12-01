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
            {
                url: 'https://api.vr-dashboard.leosrehacek.com',
                description: 'production',
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

    apis: ['./**/app/**/*.ts', './**/shared/**/*.ts', './**/swagger/**/*.ts', './**/app/**/*.js', './**/shared/**/*.js', './**/swagger/**/*.js'],
};


/**
 * @swagger
 * tags:
 *  - name: Default
 *    description:
 *  - name: Public
 *    description: Public
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
 *   applicationIdentifier:
 *     name: applicationIdentifier
 *     in: path
 *     description: Identifier of application
 *     required: true
 *   orgCode:
 *     name: orgCode
 *     in: path
 *     description: Code of organisation
 *     required: true
 *   activityId:
 *     name: activityId
 *     in: path
 *     description: ID of activity
 *     required: true
 *   environmentId:
 *     name: environmentId
 *     in: path
 *     description: ID of environment
 *     required: false
 */