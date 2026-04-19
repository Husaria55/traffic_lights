import { describe, it, expect, beforeEach } from 'vitest';
import { TrafficController } from './TrafficController';

describe('TrafficController', () => {
  let controller: TrafficController;

  beforeEach(() => {
    controller = new TrafficController();
  });

  it('NS_GREEN initialization', () => {
    const state = controller.getState();
    
    expect(state.lights.north).toBe('green');
    expect(state.lights.south).toBe('green');
    expect(state.lights.east).toBe('red');
    expect(state.lights.west).toBe('red');

    expect(state.queues.north.length).toBe(0);
    expect(state.queues.east.length).toBe(0);
  });

  it('adding vehicles to queues and initializing wait times', () => {
    controller.processCommand([
      { type: 'addVehicle', vehicleId: 'V_001', startRoad: 'north', endRoad: 'south' },
      { type: 'addVehicle', vehicleId: 'V_002', startRoad: 'east', endRoad: 'west' }
    ]);

    const state = controller.getState();
    
    expect(state.queues.north.length).toBe(1);
    expect(state.queues.north[0].id).toBe('V_001');
    expect(state.queues.north[0].waitTime).toBe(0);

    expect(state.queues.east.length).toBe(1);
    expect(state.queues.east[0].id).toBe('V_002');
  });

  it('only allows vehicles to pass on green light', () => {
    controller.processCommand([
      { type: 'addVehicle', vehicleId: 'V_N', startRoad: 'north', endRoad: 'south' },
      { type: 'addVehicle', vehicleId: 'V_E', startRoad: 'east', endRoad: 'west' }
    ]);

    const result = controller.processCommand([{ type: 'step' }]);
    const state = controller.getState();

    expect(result.stepStatuses[0].leftVehicles).toContain('V_N');
    expect(result.stepStatuses[0].leftVehicles).not.toContain('V_E');

    expect(state.queues.north.length).toBe(0);
    expect(state.queues.east.length).toBe(1);
    
    expect(state.queues.east[0].waitTime).toBe(1); 
  });

  it('should change phase to yellow after reaching maximum green time (safety against starvation)', () => {
    controller.processCommand([
      { type: 'addVehicle', vehicleId: 'V_E', startRoad: 'east', endRoad: 'west' }
    ]);

    for (let i = 0; i < 10; i++) {
      controller.processCommand([{ type: 'step' }]);
    }

    const state = controller.getState();
    expect(state.lights.north).toBe('yellow');
    expect(state.lights.south).toBe('yellow');
  });
});