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

export class VRData{
    start: string;
    end: string;
    log_rate: number;
    head_data: Position[];
    left_hand_data?: Position[];
    right_hand_data?: Position[];
    custom_data?: any;
}

export class Position {
    x: string;
    y: string;
    z: string;
}