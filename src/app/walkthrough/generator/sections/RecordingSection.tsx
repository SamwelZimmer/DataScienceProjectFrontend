"use client"

import SingleStaticSignalPlot from "../components/SingleStaticSignalPlot";
import StackedStaticSignalPlot from "../components/StackedStaticSignalPlot";

export default function RecordingSection() {

    let recordedSignals = JSON.parse(sessionStorage.getItem('recordedSignals') || "[]");

    return (
        <>
                <p className="px-12 sm:px-0">The signals recorded by each of the electrodes</p>

                <section className="w-full h-full px-12 sm:px-0 py-24">
                    <div className="flex flex-col gap-12 w-full h-full overflow-y-auto border rounded-md p-3">
                        {
                            recordedSignals["signals"].map((signal: number[], i: number) => (
                                <div key={i} className="flex flex-col w-full h-full sm:px-6 md:px-12">
                                    <span className="text-center font-thin">Electrode {i + 1}</span>
                                    <div className="w-full">
                                        <SingleStaticSignalPlot signal={signal} time={recordedSignals["time"]} windowSize={signal.length} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </section>

        </>
    );
}
