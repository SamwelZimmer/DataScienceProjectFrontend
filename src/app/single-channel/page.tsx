import path from "path";
import fs from "fs";

import Navbar from "../../../components/Navbar";
import Electrode from "./Components/Electrode";
import PlayButton from "./Components/PlayButton";
import PlayTime from "./Components/PlayTime";
import ElectrodeViewer from "./Components/ElectrodeViewer";

async function getSignal() {

    // getting the example signal from the public directory
    const filePath = path.join(process.cwd(), 'public', 'example_signal.json');
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData.toString());

    return data
}
  
export default async function SingleChannelPage() {

    const data = await getSignal();

    const signal = data.signal;
    const time = data.time;

    const maxAmplitude = data.max_amplitude;
    const minAmplitude = data.min_amplitude;
    const sampleRate = data.sample_rate;
    const sampleLength = data.length
      
    return (
        <>
            <Navbar />

            <main className="py-32 px-3 w-full sm:w-[400px] md:w-[500px] mx-auto flex flex-col gap-6">

                    <section className="w-full flex flex-col items-center">

                                           
                    <ElectrodeViewer 
                            signal={signal}
                            time={time}
                            sampleLength={sampleLength}
                            sampleRate={sampleRate} 
                            minAmplitude={minAmplitude}
                            maxAmplitude={maxAmplitude}
                        />

                    </section>



            </main>
        </>
    );
}