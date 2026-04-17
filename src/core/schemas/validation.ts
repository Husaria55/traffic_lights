import { z } from 'zod';

export const roadSchema = z.enum(['north', 'south', 'east', 'west']);

export const addVehicleCommandSchema = z.object({
    type: z.literal('addVehicle'),
    vehicleId: z.string().min(1, "ID pojazdu nie może być puste"),
    startRoad: roadSchema,
    endRoad: roadSchema,
}).refine(data => data.startRoad !== data.endRoad, {
    message: "Droga startowa i docelowa nie mogą być takie same",
    path: ['endRoad'],
});

export const stepCommandSchema = z.object({
    type: z.literal('step'),
});

export const commandSchema = z.discriminatedUnion('type', [addVehicleCommandSchema, stepCommandSchema]);

export const inputDataSchema = z.object({
    commands: z.array(commandSchema),
});

export type ValiddatedInputData = z.infer<typeof inputDataSchema>;
