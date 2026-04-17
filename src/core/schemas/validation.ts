import { z } from 'zod';

const roadSchema = z.enum(['north', 'south', 'east', 'west']);

const addVehicleSchema = z.object({
    type: z.literal('addVehicle'),
    vehicleId: z.string(),
    startRoad: roadSchema,
    endRoad: roadSchema,
});

const stepSchema = z.object({
    type: z.literal('step'),
});

const commandSchema = z.discriminatedUnion('type', [addVehicleSchema, stepSchema]);

export const inputDataSchema = z.object({
    commands: z.array(commandSchema),
});