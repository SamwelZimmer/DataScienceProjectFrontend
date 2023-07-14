import { useEffect, useState } from "react";

type TimeIndicatorProps = {
    time: number[];
    numberOfTicks: number;
    windowSize: number;
};

export default function TimeIndicator({ time, numberOfTicks, windowSize }: TimeIndicatorProps) {
    const [leftOffset, setLeftOffset] = useState("0%");

    useEffect(() => {

        if (!numberOfTicks) {
            return;
        };

        if (numberOfTicks >= time.length - windowSize) {

            // calculate progress as the ratio of numberOfTicks to the total number of data points
            const progress = (numberOfTicks - (time.length - windowSize)) / windowSize;

            // convert progress to a percentage string for CSS
            const offset = (progress * 100).toFixed(2) + '%';

            // update state
            setLeftOffset(offset);
        } else {
            setLeftOffset("0%");
        }

    }, [numberOfTicks])

    return (
        <div style={{ left: leftOffset }} className="absolute top-0 w-[1px] h-full border-l border-dashed border-red-900" />
    );
};