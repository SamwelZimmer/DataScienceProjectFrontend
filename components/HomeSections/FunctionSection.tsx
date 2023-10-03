import { TbNumber0, TbNumber1, TbNumber2, TbNumber3, TbNumber4, TbNumber5 } from "react-icons/tb";

export default function FunctionSection() {
    return (
        <section className="py-24 sm:py-32 flex flex-col w-full px-8 gap-12">

            <div className="mx-auto text-center">
                <span className="text-3xl font-medium">My Process</span>
                <p className="w-full sm:w-[500px]">Just in case you don{"'"}t want to read the report {"(don't worry, I don't blame you)"}, let me breakdown how I tackled this project in greatly oversimplified chunks.</p>
            </div>

            <div className="flex flex-col mx-auto gap-20">

                { functions.map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center w-full sm:w-[400px]">
                        <div className="text-indigo-600">
                            {item.icon}
                        </div>
                        <span>{item.title}</span>
                        <p className="font-light">{item.description}</p>
                    </div>
                ))}

            </div>
        </section>
    );
};

const functions = [
    { icon: <TbNumber0 size={30} />, title: "Background", description: "Learning as much as possible about spike sorting as quickly as possible." },
    { icon: <TbNumber1 size={30} />, title: "Time to Code", description: "Writing lots of code to satisfy each step in the spike sorting process." },
    { icon: <TbNumber2 size={30} />, title: "Tool 1", description: "Refactoring the code into a modular OOP form with standard inputs/outputs, allowing for extension and adaptation." },
    { icon: <TbNumber3 size={30} />, title: "APIify", description: "Converting this codebase into an API which can be accessed by the web." },
    { icon: <TbNumber4 size={30} />, title: "Tool 2", description: "Developing a frontend application capable of interacting with the API to produce a visual demonstration." },
    { icon: <TbNumber5 size={30} />, title: "The Report", description: "Write. Write. Write." },
];