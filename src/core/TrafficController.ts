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

    private readonly MIN_GREEN_DURATION: number = 3;
    private readonly MAX_GREEN_DURATION: number = 10;
    private readonly YELLOW_DURATION: number = 1;

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
                result.stepStatuses.push(this.handleStep());
            }
        }

        return result;
    }

    private handleAddVehicle(command: Extract<Command, { type: "addVehicle" }>): void {
        const newVehicle: Vehicle = {
            id: command.vehicleId,
            startRoad: command.startRoad,
            endRoad: command.endRoad,
            waitTime: 0
        };

        this.state.queues[command.startRoad].push(newVehicle);
    }

    private handleStep(): StepStatus {
      const leftVehicles: string[] = [];

      if (this.currentPhase === "NS_GREEN") {
        if (this.state.queues.north.length > 0) {
          leftVehicles.push(this.state.queues.north.shift()!.id);
        } 
        if (this.state.queues.south.length > 0) {
          leftVehicles.push(this.state.queues.south.shift()!.id);
        }
      } else if (this.currentPhase === "EW_GREEN") {
        if (this.state.queues.east.length > 0) {
          leftVehicles.push(this.state.queues.east.shift()!.id);
        } 
        if (this.state.queues.west.length > 0) {
          leftVehicles.push(this.state.queues.west.shift()!.id);
        }
      }

      for (const road of Object.keys(this.state.queues) as Road[]) {
        for (const vehicle of this.state.queues[road]) {
          vehicle.waitTime++;
        }
      }

      this.phaseTimer++;
      this.updateTrafficLights();

      return { leftVehicles };
    }

    private updateTrafficLights(): void {
        const queues = this.state.queues;

        const nsWaiting = queues.north.length + queues.south.length;
        const ewWaiting = queues.east.length + queues.west.length;

        switch (this.currentPhase) {
            case "NS_GREEN":
                if ((this.phaseTimer >= this.MIN_GREEN_DURATION && ewWaiting > nsWaiting) || this.phaseTimer >= this.MAX_GREEN_DURATION) {
                  this.transitionTo("NS_YELLOW");
                }
                break;

            case "NS_YELLOW":
                if (this.phaseTimer >= this.YELLOW_DURATION) {
                  this.transitionTo("EW_GREEN");
                }
                break;
            
            case "EW_GREEN":
                if ((this.phaseTimer >= this.MIN_GREEN_DURATION && nsWaiting > ewWaiting) || this.phaseTimer >= this.MAX_GREEN_DURATION) {
                  this.transitionTo("EW_YELLOW");
                }
                break;
            
            case "EW_YELLOW":
                if (this.phaseTimer >= this.YELLOW_DURATION) {
                  this.transitionTo("NS_GREEN");
                }
                break;
        }
    }

    private transitionTo(newPhase: TrafficPhase): void {
        this.currentPhase = newPhase;
        this.phaseTimer = 0;
        this.state.lights = this.getLightsForPhase(newPhase);
    }

}