import { getAllArticles } from "../../../lib/firebase";
import Card from "./Card";

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
            <main className="py-32 px-3 w-full sm:w-[400px] mx-auto flex flex-col gap-6">

                <h1 className="text-3xl font-semibold">Articles</h1>
                <section className="w-full sm:w-[400px] flex flex-col gap-3 mx-auto">
                    {articles.map((article, i) => (
                        <Card key={i} article={article} />
                    ))}
                </section>

            </main>
        </>
    )
}

