import Link from "next/link";

export default function ToolsOverview() {
return (
    <section id="choose-your-setup" className="bg-gray-100 border-black border-y-2 w-full">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
        <h2 className="text-2xl font-bold text-gray-900">The Project Outcomes</h2>

        <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {products.map((product) => (
            <Link key={product.name} href={`${product.href}`}>
                <div className="group relative my-6 lg:my-0">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                    <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-full w-full object-cover object-center"
                    />
                </div>
                <h3 className="mt-6 text-sm text-gray-500">
                    <span className="absolute inset-0" />
                    {product.name}
                </h3>
                <p className="text-base font-semibold text-gray-900">{product.description}</p>
                </div>
            </Link>
            ))}
        </div>
        </div>
    </div>
    </section>
)
}

const products = [
    {
      name: 'The Pipeline',
      description: 'Modular and extensible Python module',
      imageSrc: 'https://firebasestorage.googleapis.com/v0/b/personal-site-9c7e7.appspot.com/o/projects%2Fspike_sorting_pipeline_screenshot_2.png?alt=media&token=3c14cda4-b82e-4799-bebb-17702451d9ea&_gl=1*1qco3bz*_ga*MTgzMTM2MTY3OS4xNjc1Mjc5MTEz*_ga_CW55HF8NVT*MTY5NjM0MTEwNC4xMzcuMS4xNjk2MzQxNTcyLjI3LjAuMA..',
      imageAlt: 'Spike sorting pipeline screenshot',
      href: "https://github.com/SamwelZimmer/DataScienceProjectAPI"
    },
    {
      name: "The Demonstration",
      description: 'Learn and experiment visually',
      imageSrc: 'https://firebasestorage.googleapis.com/v0/b/personal-site-9c7e7.appspot.com/o/projects%2Fspike_sorting_demo_screenshot.png?alt=media&token=ac6478d7-ff3d-4bc2-b95a-06ae67cbb594&_gl=1*1uiwfpd*_ga*MTgzMTM2MTY3OS4xNjc1Mjc5MTEz*_ga_CW55HF8NVT*MTY5NjM0MTEwNC4xMzcuMS4xNjk2MzQxNjQ5LjQ0LjAuMA..',
      imageAlt: 'Spike sorting demo screenshot',
      href: "/walkthrough"
    },
    {
      name: "The Thesis",
      description: 'Read up on the development process',
      imageSrc: 'https://firebasestorage.googleapis.com/v0/b/personal-site-9c7e7.appspot.com/o/projects%2Fmaster_thesis_book.png?alt=media&token=d95bd029-fe13-453c-920a-2b5d4d885689&_gl=1*jjx2pe*_ga*MTgzMTM2MTY3OS4xNjc1Mjc5MTEz*_ga_CW55HF8NVT*MTY5NjM0MTEwNC4xMzcuMS4xNjk2MzQxOTc1LjU0LjAuMA..',
      imageAlt: 'Picture of thesis book',
      href: "https://firebasestorage.googleapis.com/v0/b/personal-site-9c7e7.appspot.com/o/projects%2Fmasters_thesis.pdf?alt=media&token=16dcb34a-dbb0-421c-b04c-5f508410aa32&_gl=1*16fj13r*_ga*MTgzMTM2MTY3OS4xNjc1Mjc5MTEz*_ga_CW55HF8NVT*MTY5NjM0MTEwNC4xMzcuMS4xNjk2MzQxMTE0LjUwLjAuMA.."
    },
];