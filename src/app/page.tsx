import Image from 'next/image';

import Search from '../../components/Search/Search';
import Navbar from '../../components/Navbar';

async function getMoney() {
  // const response = await fetch("https://samwelzimmer.pythonanywhere.com/money")
  const response = await fetch("http://localhost:5001/money")
  return response.json()
}

export default async function Home() {

  const money = await getMoney();

  console.log(money.Money)

  return (

    <>
      <Navbar showBackButton={false} />

      <main className="flex min-h-screen flex-col items-center justify-between py-24 px-6">
        <div className='w-full sm:w-[400px]'>
          <Search />
        </div>
      </main>
    </>


  )
}


