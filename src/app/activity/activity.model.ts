export class Activity{
    id: string;
    time: string;
    data: any;
    notes: string;
    anonymous: boolean;

    participantId: string;
    applicationId: string;
}

export class NewActivity{
    time: string;
    data: any;
    anonymous: boolean;
    notes: string;

    applicationId: string;
    participantId?: string
}