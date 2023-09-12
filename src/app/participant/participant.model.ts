export class NewParticipant{
    nickname: string;
    name?: string;
    surname?: string;
    description?: string;
    birthday?: number;
    img?: string;

    organisationId: string;
}

export class Participant extends NewParticipant{
    id: string;
}