"use client";

import { useRouter } from "next/navigation";
import EditBlogPage from "@/components/EditBlogPage";
import { use } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = ({params}:Props) => {
  const { slug } = use(params);
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <EditBlogPage slug={slug} onClose={handleClose} />;
};

export default Page;


