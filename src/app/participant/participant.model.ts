/**
 * Model of new Participant
 */
export class NewParticipant{
    /** Nickname */
    nickname: string;
    /** Name */
    name?: string;
    /** Surname */
    surname?: string;
    /** Description */
    description?: string;
    /** Birthday */
    birthday?: string;
    /** Sex */
    sex?: string;
    /** Profile image */
    img?: string;
}

/**
 * Participant
 */
export class Participant extends NewParticipant{
    /** ID */
    id: string;
    /** Organisation ID */
    organisationId: string;
}

/**
 * Participant Metadata
 */
export class ParticipantMetadata {
    /** Identifier */
    id: string;
    /** Nickname */
    nickname: string;
}

/**
 * List of participants
 */
export class ParticipantsMetadataList{
    /** Array of Participant metadata */
    participants: ParticipantMetadata[];
}