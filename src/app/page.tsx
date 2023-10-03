import Image from 'next/image';

import Search from '../../components/Search/Search';
import Navbar from '../../components/Navbar';
import Hero from '../../components/HomeSections/Hero';
import Features from '../../components/HomeSections/Features';
import Footer from '../../components/HomeSections/Footer';
import ToolsOverview from '../../components/HomeSections/ToolsOverview';
import FunctionSection from '../../components/HomeSections/FunctionSection';

export default async function Home() {

  return (

    <>
      <Navbar showBackButton={false} />

      <main className="flex w-screen relative overflow-hidden min-h-screen flex-col items-center justify-between py-24">

        <AnimatedBackgroundSplotches />

        <div className='px-6'>
          <Hero />
          <Features />
        </div>

        <ToolsOverview />

        <FunctionSection />


      </main>

      <Footer />
    </>


  )
}

const AnimatedBackgroundSplotches = () => (
  <>
      <div className="absolute coloured-patch inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <svg
          className="relative overflow-hidden left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".3"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#e1a519" />
              <stop offset={1} stopColor="#37a2a5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute coloured-patch w-screen -z-10 inset-x-0 top-[20rem] transform-gpu overflow-hidden blur-3xl">
            <svg
            className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
            >
            <path
                fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
                <linearGradient
                id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
                >
                <stop stopColor="#6a5aa6" />
                <stop offset={1} stopColor="#6a5aa6" />
                </linearGradient>
            </defs>
            </svg>
      </div>
  </>
)
