import { Command, OutputData, StepStatus } from "./models/types";       

export class TrafficController {
    private stepStatuses: StepStatus[] = [];

    // later the queue and logic will be added

    public processCommands(commands: Command[]): OutputData {
        for (const command of commands) {
            if (command.type === "addVehicle") {
                this.handleAddVehicle(command);
            } else if (command.type === "step") {
                this.handleStep();
            }
        }
        return { stepStatuses: this.stepStatuses };
}

private handleAddVehicle(command: Extract<Command, { type: "addVehicle" }>) {
    // TODO: write vehicle to add to the queue
    console.log(`Dodano pojazd ${command.vehicleId} jadący z ${command.startRoad} do ${command.endRoad}`);
  }

  private handleStep() {
    // TODO: lights change
    // TODO: take vehicles from queues and move them
    
    const vehiclesLeaving: string[] = []; 
    
    this.stepStatuses.push({
      leftVehicles: vehiclesLeaving,
    });
  }
}