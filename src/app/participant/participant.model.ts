export class NewParticipant{
    nickname: string;
    name?: string;
    surname?: string;
    description?: string;
    age?: number;
}

export class Participant extends NewParticipant{
    id: string;

    organisationId: string;
}