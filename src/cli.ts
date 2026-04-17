import * as fs from 'fs';
import * as path from 'path';
import { inputDataSchema } from './core/schemas/validation';
import { TrafficController } from './core/TrafficController';

function main() {
    const args = process.argv.slice(2);

    if (args.length !== 2) {
        console.error("Nieprawidłowa liczba argumentów. Użycie: npm run simulate <plik_wejściowy.json> <plik_wyjściowy.json");
        process.exit(1);
    }

    const inputFilePath = path.resolve(process.cwd(), args[0]);
    const outputFilePath = path.resolve(process.cwd(), args[1]);

    try {
        if (!fs.existsSync(inputFilePath)) {
            console.error(`Plik wejściowy nie istnieje: ${inputFilePath}`);
            process.exit(1);
        }
        const rawJson = fs.readFileSync(inputFilePath, 'utf-8');
        const parsedData = JSON.parse(rawJson);
        const validationResult = inputDataSchema.safeParse(parsedData);

        if (!validationResult.success) {
            console.error("Błąd walidacji danych wejściowych:");
            console.error(validationResult.error.format());
            process.exit(1);
        }

        console.log("Dane wejściowe zwalidowane pomyślnie.");

        const trafficController = new TrafficController();
        const result = trafficController.processCommand(validationResult.data.commands);

        fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2), 'utf-8');
        console.log(`Symulacja zakończona. Wynik zapisany w: ${outputFilePath}`);
    } catch (error) {
        console.error("Wystąpił błąd podczas przetwarzania:");
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main();
