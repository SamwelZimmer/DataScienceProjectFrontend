import path from "path";
import fs from "fs";

async function getSignal() {

    const filePath = path.join(process.cwd(), 'public', 'demo_simulation.json');
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData.toString());

    return data
}

export default async function ExampleSimulation() {

    const data = await getSignal();
    console.log(data);

    return (
        <div>
            hello
        </div>
    );

}