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

    apis: ['./**/app/**/*.ts', './**/shared/**/*.ts', './**/swagger/**/*.ts', './**/server/**/*.ts', './**/app/**/*.js', './**/shared/**/*.js', './**/swagger/**/*.js', './**/server/**/*.js'],
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
 *   VrData:
 *     required:
 *       - application_identifier
 *       - log_version
 *       - start
 *       - end
 *       - log_rate
 *       - records
 *     properties:
 *       application_identifier:
 *         type: string
 *       log_version:
 *         type: string
 *       start:
 *         type: string
 *       end:
 *         type: string
 *       log_rate:
 *         type: number
 *       records:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Record'
 *       custom_data:
 *         type: object
 *   Record:
 *     required:
 *       - timestamp
 *       - tick
 *       - environment
 *     properties:
 *       timestamp:
 *         type: string
 *       tick:
 *         type: number
 *       environment:
 *         type: string
 *       head:
 *         $ref: '#/definitions/PositionAndRotation'
 *       left_hand:
 *         $ref: '#/definitions/PositionAndRotation'
 *       right_hand:
 *         $ref: '#/definitions/PositionAndRotation'
 *       custom_data:
 *         type: object
 *       events:
 *         type: array
 *         items:
 *           type: string
 *   PositionAndRotation:
 *     required:
 *       - position
 *       - rotation
 *     properties:
 *       position:
 *         $ref: '#/definitions/Axis'
 *       rotation:
 *         $ref: '#/definitions/Axis'
 *   Axis:
 *     required:
 *       - x
 *       - y
 *       - z
 *     properties:
 *       x:
 *         type: number
 *       y:
 *         type: number
 *       z:
 *         type: number
 *
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
 *   applicationId:
 *     name: applicationId
 *     in: path
 *     description: ID od application
 *     required: true
 *   moduleVersion:
 *     name: moduleVersion
 *     in: path
 *     description: Version of WebGL module
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
 *   sendActivityBody:
 *     name: activity
 *     in: body
 *     required: true
 *     description: New Activity
 *     schema:
 *       type: object
 *       required:
 *         - data
 *         - anonymous
 *         - organisation_code
 *       properties:
 *         data:
 *           $ref: '#/definitions/VrData'
 *         anonymous:
 *           type: boolean
 *         organisation_code:
 *           type: string
 *         participantId:
 *           type: string
 */