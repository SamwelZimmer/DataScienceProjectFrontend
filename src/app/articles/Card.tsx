import { Article } from "./page";
import Link from "next/link";

interface CardProps {
    article: Article;
}

export default function Card ({ article }: CardProps) {

    const date = new Date(Number(article.datetime));
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return (
        <Link href={`articles/${article.id}`} className="w-full flex flex-col justify-between p-3 gap-3 border rounded-lg cursor-pointer hover:border-slate-800">
            <span className="font-bold">{article.title}</span>
            <span className="opacity-50">{formattedDate}</span>
        </Link>
    );
}