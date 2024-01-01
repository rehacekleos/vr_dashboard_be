import { DatabaseIndexType, mongoDbIndex } from './strategies/mongoDb.strategy.factory';
import { CollectionName } from "./collectionName.enum";

export const mongoDbIndexes: mongoDbIndex[] = [
    {
        name: "id",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.USERS
    },
    {
        name: "email",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.USERS
    },
    {
        name: "id",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.ORGANISATIONS
    },
    {
        name: "code",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.ORGANISATIONS
    },
    {
        name: "id",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.PARTICIPANTS
    },
    {
        name: "organisationId",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.PARTICIPANTS
    },
    {
        name: "id",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.INVITATIONS
    },
    {
        name: "organisationId",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.INVITATIONS
    },
    {
        names: ["code", "email"],
        type: DatabaseIndexType.COMPOUND,
        collection: CollectionName.INVITATIONS
    },
    {
        names: ["organisationId", "email"],
        type: DatabaseIndexType.COMPOUND,
        collection: CollectionName.INVITATIONS
    },
    {
        name: "id",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.EMPLOYEES
    },
    {
        name: "organisationId",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.EMPLOYEES
    },
    {
        name: "userId",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.EMPLOYEES
    },
    {
        names: ["userId", "organisationId"],
        type: DatabaseIndexType.COMPOUND,
        collection: CollectionName.EMPLOYEES
    },
    {
        name: "organisationId",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.APPLICATION_ASSIGNMENT
    },
    {
        name: "id",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.APPLICATIONS
    },
    {
        name: "id",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.ACTIVITIES
    },
    {
        name: "organisationId",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.ACTIVITIES
    },
    {
        name: "applicationId",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.ACTIVITIES
    },
    {
        name: "participantId",
        type: DatabaseIndexType.STANDARD,
        collection: CollectionName.ACTIVITIES
    },
    {
        names: ["id", "organisationId"],
        type: DatabaseIndexType.COMPOUND,
        collection: CollectionName.ACTIVITIES
    },
]
