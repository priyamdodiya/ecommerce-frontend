"use client";

import { useRouter } from "next/navigation";
import EditBlogPage from "@/components/EditBlogPage";

interface Props {
  params: { slug: string };
}

const Page = ({ params }: Props) => {
  const { slug } = params;
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <EditBlogPage slug={slug} onClose={handleClose} />;
};

export default Page;


