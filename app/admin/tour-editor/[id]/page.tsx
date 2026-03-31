import { notFound } from "next/navigation";
import { getPlatformRestaurantById } from "@/lib/platform-db";
import { AdminTourEditor } from "@/components/admin/tour-editor";

interface PageProps {
  params: { id: string };
}

export const metadata = {
  title: "Virtual Tour Editor | DineUp",
  description: "DineUp Administrative Tour Management",
};

export default async function TourEditorPage({ params }: PageProps) {
  const restaurant = await getPlatformRestaurantById(params.id);

  if (!restaurant) {
    notFound();
  }

  return <AdminTourEditor restaurant={restaurant} />;
}
