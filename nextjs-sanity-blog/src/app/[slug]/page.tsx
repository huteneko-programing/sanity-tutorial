import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  body,
  image,
  estimatedReadingTime,
  categories[]->{ title },
  author->{ name, image }
}`;

const options = { next: { revalidate: 30 } };

const builder = imageUrlBuilder(client);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  // params を await して slug を取得
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options
  );

  if (!post) {
    notFound();
  }

  const postImageUrl = post.image
    ? builder.image(post.image).width(1600).fit("clip").url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-4xl p-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} /> Back to posts
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {postImageUrl ? (
            <img
              src={postImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center center",
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-lg font-medium">No image</p>
            </div>
          )}
        </div>

        <CardContent className="p-8">
          <div className="flex gap-2 mb-6 flex-wrap">
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

          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            {post.estimatedReadingTime && (
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{post.estimatedReadingTime} min read</span>
              </div>
            )}
          </div>

          {post.author && (
            <>
              <div className="flex items-center gap-4 mb-8">
                {post.author.image && (
                  <img
                    src={builder
                      .image(post.author.image)
                      .width(48)
                      .height(48)
                      .url()}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Written by</p>
                  <p className="font-medium">{post.author.name}</p>
                </div>
              </div>
              <Separator className="mb-8" />
            </>
          )}

          <div className="prose prose-lg max-w-none">
            {Array.isArray(post.body) && <PortableText value={post.body} />}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
