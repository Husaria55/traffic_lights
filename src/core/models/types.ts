export type Road = "north" | "south" | "east" | "west";

export type LightColor = "green" | "yellow" | "red";

export interface Vehicle {
    id: string;
    startRoad: Road;
    endRoad: Road;
    waitTime: number;
}

export interface AddVehicleCommand {
    type: "addVehicle";
    vehicleId: string;
    startRoad: Road;
    endRoad: Road;
}

export interface StepCommand {
    type: "step";
}

export type Command = AddVehicleCommand | StepCommand;

export interface InputData {
    commands: Command[];
}

export interface StepStatus {
    leftVehicles: string[];
}

export interface SimulationResult {
    stepStatuses: StepStatus[];
}

export interface InterSectionState {
    queues: Record<Road, Vehicle[]>;
    lights: Record<Road, LightColor>;
}
