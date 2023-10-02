export class Activity{
    id: string;
    time: string;
    data: VRData;
    notes: string;
    anonymous: boolean;

    participantId: string;
    applicationId: string;
}

export class NewActivity{
    data: VRData;
    anonymous: boolean;
    notes: string;

    applicationId: string;
    participantId?: string
}

export class SendActivity{
    data: VRData;
    anonymous: boolean;
    notes: string;

    organisation_code: string;
    application_identifier: string;
    log_version: number;
    participantId?: string
}

export class VRData{
    application_identifier: string;
    log_version: number;
    start: string;
    end: string;
    log_rate: number;
    records: Record[];
    custom_data?: any;
}

export class Record{
    timestamp: string;
    tick: number;
    environment: string;
    head: PositionAndRotation;
    left_hand?: PositionAndRotation;
    right_hand?: PositionAndRotation;
    custom_data?: any;
}

export class PositionAndRotation {
    position: Axis;
    rotation: Axis;
}

export class Axis {
    x: number;
    y: number;
    z: number;
}