import { AiOutlinePullRequest, AiOutlineFieldTime } from 'react-icons/ai';
import { LuBrainCircuit } from 'react-icons/lu'; 
import { TbSchool } from 'react-icons/tb'; 

const features = [
  {
    name: "It's fast. Real fast",
    description:
      "A modular and extensible Python module enabling fast initiation and iteration of spike sorting pipelines.",
    icon: <AiOutlineFieldTime size={20} />,
  },
  {
    name: 'Build together',
    description:
      'Use pre-built traditional spike sorting methods, borrow from other researchers, or create your own with seamless integration.',
    icon: <AiOutlinePullRequest size={20} />,
  },
  {
    name: 'Real or not - no matter',
    description:
      "Plug in and analyse data from real neural recordings or simulate the brain's activity with a novel grid-like approach.",
    icon: <LuBrainCircuit size={20} />,
  },
  {
    name: 'Removing barriers to entry',
    description:
      "New to spike sorting or don't know how to code? Learn and experiment with several spike sorting processes using the web-based visual demonstration.",
    icon: <TbSchool size={20} />,
  },
]

export default function Features() {
  return (
    <section id='features' className='w-screen overflow-hidden'>  


        {/* content */}
        <div className="py-24 sm:py-32 -z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-red-800">Fixing fundemental flaws</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Simplifying the spike sorting process one step and a time
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
                Spike sorting is a slow and complex procedure. Or at least, it was. <br /> These tools have the potential to fix this. Here{"'"}s how...
            </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700">
                        <div className="h-6 w-6 flex items-center justify-center text-white" aria-hidden="true">
                            {feature.icon}
                        </div>
                    </div>
                    {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
                ))}
            </dl>
            </div>
        </div>
        
        </div>
        
    </section>
  )
}
