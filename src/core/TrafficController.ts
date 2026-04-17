import type { 
  Road, 
  LightColor, 
  InterSectionState, 
  Command, 
  SimulationResult, 
  StepStatus, 
  Vehicle 
} from "./models/types";       

export type TrafficPhase = "NS_GREEN" | "NS_YELLOW" | "EW_GREEN" | "EW_YELLOW";

export class TrafficController {
    private state: InterSectionState;
    private currentPhase: TrafficPhase;
    private phaseTimer: number;

    private readonly greenDuration: number = 5;
    private readonly yellowDuration: number = 1;

    constructor() {
        this.currentPhase = "NS_GREEN";
        this.phaseTimer = 0;
        this.state = {
            queues: {
                north: [],
                south: [],
                east: [],
                west: []
            },
            lights: this.getLightsForPhase('NS_GREEN'),
        };
    }

    private getLightsForPhase(phase: TrafficPhase): Record<Road, LightColor> {
        switch (phase) {
            case "NS_GREEN":
                return { north: "green", south: "green", east: "red", west: "red" };
            case "NS_YELLOW":
                return { north: "yellow", south: "yellow", east: "red", west: "red" };
            case "EW_GREEN":
                return { north: "red", south: "red", east: "green", west: "green" };
            case "EW_YELLOW":
                return { north: "red", south: "red", east: "yellow", west: "yellow" };
        }
    }

    public getState(): InterSectionState {
        return this.state;
    }

    public processCommand(commands: Command[]): SimulationResult {
        const result: SimulationResult = { stepStatuses: [] };

        for (const command of commands) {
            if (command.type === "addVehicle") {
                this.handleAddVehicle(command);
            } else if (command.type === "step") {
                result.stepStatuses.push(stepStatus);
            }
        }

        return result;
    }

    private handleAddVehicle(command: Extract<Command, { type: "addVehicle" }>): void {
      // TODO: Implementacja dodawania pojazdu do kolejki
    }

    private handleStep(): StepStatus {
      // TODO: Implementacja logiki przejścia symulacji o jeden krok
      return { leftVehicles: [] };
    }
}