export class NewParticipant{
    nickname: string;
    name?: string;
    surname?: string;
    description?: string;
    birthday?: number;
    img?: string;
}

export class Participant extends NewParticipant{
    id: string;

    organisationId: string;
}