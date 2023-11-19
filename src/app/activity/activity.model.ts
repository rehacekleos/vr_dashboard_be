export class Activity{
    id: string;
    time: string;
    data: VRData;
    notes: string;
    anonymous: boolean;

    participantId: string;
    applicationId: string;
    organisationId: string;
}

export class CompressedActivity extends Activity{
    data: any;
}

export class NewActivity{
    data: VRData;
    anonymous: boolean;
    notes: string;

    applicationId: string;
    participantId?: string;
}

export class SendActivity{
    data: VRData;
    anonymous: boolean;

    organisation_code: string;
    participantId?: string
}

/**
 * Vr data
 */
export class VRData{
    /** Application identifier */
    application_identifier: string;
    /** Log version*/
    log_version: string;
    /** Start timestamp*/
    start: string;
    /** End timestamp*/
    end: string;
    /** Log rate in ms*/
    log_rate: number;
    /** Records*/
    records: Record[];
    /** Custom data*/
    custom_data?: any;
}

/**
 * Record
 */
export class Record{
    /** Timestamp*/
    timestamp: string;
    /** Number of tick*/
    tick: number;
    /** Environment Id*/
    environment: string;
    /** Head position and rotation*/
    head?: PositionAndRotation;
    /** Left hand position and rotation*/
    left_hand?: PositionAndRotation;
    /** Right hand position and rotation*/
    right_hand?: PositionAndRotation;
    /** Custom data*/
    custom_data?: any;
    /** List of event which happen in this record*/
    events?: string[]
}

/**
 * Position and Rotation
 */
export class PositionAndRotation {
    /** Position */
    position: Axis;
    /** Rotation */
    rotation: Axis;
}

/**
 * Axis
 */
export class Axis {
    /** Axis x */
    x: number;
    /** Axis y */
    y: number;
    /** Axis z */
    z: number;
}