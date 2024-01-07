/**
 * Activity
 */
export class Activity{
    /** ID */
    id: string;
    /** Timestamp*/
    time: string;
    /** VR data*/
    data: VRData;
    /** Notes */
    notes: string;
    /** Is anonymous activity? */
    anonymous: boolean;

    /** Participant ID */
    participantId: string;
    /** Application ID */
    applicationId: string;
    /** Organisation ID */
    organisationId: string;
}


export class CompressedActivity extends Activity{
    data: any;
}

/**
 * Model of new activity send from client app
 */
export class NewActivity{
    /** VR data */
    data: VRData;
    /** Is anonymous activity? */
    anonymous: boolean;
    /** Activity notes */
    notes: string;

    /** Application ID */
    applicationId: string;
    /** Participant ID */
    participantId?: string;
}

/**
 * Model of new activity send from VR dashboard logger
 */
export class SendActivity{
    /** VR data */
    data: VRData;
    /** Is anonymous activity? */
    anonymous: boolean;

    /** Organisation code */
    organisation_code: string;
    /** Participant ID */
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
    /** Timestamp */
    timestamp: string;
    /** Number of tick */
    tick: number;
    /** Environment Id */
    environment: string;
    /** Head position and rotation */
    head?: PositionAndRotation;
    /** Left hand position and rotation */
    left_hand?: PositionAndRotation;
    /** Right hand position and rotation */
    right_hand?: PositionAndRotation;
    /** Custom data */
    custom_data?: any;
    /** List of event which happen in this record */
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