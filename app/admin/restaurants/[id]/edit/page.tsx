import { EditRestaurantForm } from "@/components/admin/edit-restaurant-form";

export default async function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <EditRestaurantForm id={resolvedParams.id} />
    </div>
  );
}
