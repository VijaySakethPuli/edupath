import { useState } from 'react';

export default function CollegeSearch() {
  const [query, setQuery] = useState({ location: '', radius: 50 });

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Find Government Colleges</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          className="border rounded-md px-3 py-2"
          placeholder="Enter city or state"
          value={query.location}
          onChange={(e) => setQuery({ ...query, location: e.target.value })}
        />
        <select
          className="border rounded-md px-3 py-2"
          value={query.radius}
          onChange={(e) => setQuery({ ...query, radius: Number(e.target.value) })}
        >
          <option value={25}>25 km</option>
          <option value={50}>50 km</option>
          <option value={100}>100 km</option>
        </select>
      </div>
      <button className="mt-4 btn-primary">Search</button>
    </div>
  );
}