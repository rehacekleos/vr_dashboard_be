export class NewParticipant{
    nickname: string;
    name?: string;
    surname?: string;
    description?: string;
    birthday?: string;
    sex?: string;
    img?: string;
}

export class Participant extends NewParticipant{
    id: string;
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


export class ParticipantsMetadataList{
    participants: ParticipantMetadata[];
}