import { getAllArticles } from "../../../lib/firebase";
import Card from "./Card";
import Navbar from "../../../components/Navbar";

export interface Article {
    id?: string,
    title?: string,
    content?: string,
    readingTime?: number,
    type?: string,
    writingStyle?: string,
    datetime?: {
        seconds: number,
        nanoseconds: number,
    },
}

// e.g. url -> http://localhost:3000/trending?page=4&show=10&categories=art,education,business
// results -> { page: '4', show: '10', categories: 'art,education,business' }

export default async function ArticlesPage() {

    const articles = await getAllArticles();

    return (
        <> 
            <Navbar />

            <main className="py-32 px-3 w-full sm:w-[400px] md:w-[500px] mx-auto flex flex-col gap-6">

                <h1 className="text-3xl font-semibold">Articles</h1>
                <section className="w-full flex flex-col gap-3 mx-auto">
                    {articles.map((article, i) => (
                        <Card key={i} article={article} />
                    ))}
                </section>

            </main>
        </>
    )
}

