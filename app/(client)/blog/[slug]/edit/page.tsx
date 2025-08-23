import EditBlogPage from "@/components/EditBlogPage";

interface Props {
  params: { slug: string };
}

const Page = ({ params }: Props) => {
  const { slug } = params;
console.log('✌️slug --->', slug);
  return <EditBlogPage slug={slug} />;
};

export default Page;
