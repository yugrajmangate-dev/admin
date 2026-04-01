export function RestaurantSplitView({ 
  restaurants, 
  userLocation, 
  locationStatus, 
  locationError, 
  onRequestLocation 
}: any) {
  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <h2 className="text-xl font-bold mb-4">Restaurants (Mock Split View)</h2>
      <div className="grid gap-4">
        {restaurants?.map((r: any) => (
          <div key={r.id} className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold">{r.name}</h3>
            <p className="text-sm text-gray-500">{r.neighborhood}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
