import { OAS3Options } from "swagger-jsdoc";

/**
 * Basic definition of Swagger
 */
export const swaggerJSDocOptions: OAS3Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'VR Dashboard',
            description: 'VR Dashboard is used to record and retrieve Vr data from various Virtual Reality applications.',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'https://api.vr-dashboard.leosrehacek.com',
                description: 'Production',
            },
            {
                url: 'http://localhost:8080',
                description: 'Localhost',
            },
        ]
    },

    apis: ['./**/app/**/*.ts', './**/shared/**/*.ts', './**/swagger/**/*.ts', './**/server/**/*.ts', './**/app/**/*.js', './**/shared/**/*.js', './**/swagger/**/*.js', './**/server/**/*.js'],
};


/**
 * @swagger
 * tags:
 *  - name: Default
 *    description: Default controller
 *  - name: Public
 *    description: Public controller which is used for communication with VRLogger library. All endpoints are secured with <b>Application Identifier</b> and <b>Organisation Code</b>.
 *  - name: Webgl
 *    description: Webgl controller which is used to retrieve the webgl application stored on the server.
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
 *   Activity:
 *     required:
 *       - id
 *       - time
 *       - data
 *       - notes
 *       - anonymous
 *       - participantId
 *       - applicationId
 *       - organisationId
 *     properties:
 *       id:
 *         type: string
 *       time:
 *         type: string
 *       data:
 *         $ref: '#/definitions/VrDataWithoutRecords'
 *       anonymous:
 *         type: boolean
 *       notes:
 *         type: string
 *       participantId:
 *         type: string
 *       applicationId:
 *         type: string
 *       organisationId:
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
 *   VrDataWithoutRecords:
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
 *   ParticipantMetadata:
 *     required:
 *       - id
 *       - nickname
 *     properties:
 *       id:
 *         type: string
 *       nickname:
 *         type: string
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
 *     description: ID of application
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
 *   participantId:
 *     name: participantId
 *     in: path
 *     description: ID of participant
 *     required: true
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