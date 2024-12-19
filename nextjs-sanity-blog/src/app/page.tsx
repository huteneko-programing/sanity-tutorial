import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import imageUrlBuilder from "@sanity/image-url";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id, 
  title, 
  slug, 
  publishedAt,
  excerpt,
  image,
  estimatedReadingTime,
  categories[]->{ title },
  author->{ name, image }
}`;

const options = { next: { revalidate: 30 } };

const builder = imageUrlBuilder(client);

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-6xl p-8">
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Latest Posts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post._id}
            className="flex flex-col hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/${post.slug.current}`}>
              <CardHeader className="p-0">
                {post.image && (
                  <div className="w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={builder
                        .image(post.image)
                        .width(400)
                        .height(200)
                        .url()}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {post.categories?.map((category: { title: string }) => (
                    <Badge
                      key={category.title}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800"
                    >
                      {category.title}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-2xl mb-4 line-clamp-2">
                  {post.title}
                </CardTitle>
                {post.excerpt && (
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                )}
              </CardContent>
              <CardFooter className="px-6 flex flex-col gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={16} />
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {post.estimatedReadingTime && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{post.estimatedReadingTime} min read</span>
                    </div>
                  )}
                  {post.author?.image && (
                    <img
                      src={builder
                        .image(post.author.image)
                        .width(32)
                        .height(32)
                        .url()}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
