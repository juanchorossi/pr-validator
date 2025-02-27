export const SearchInput = () => {
  const apiEndpoint = process.env.NEXT_PUBLIC_SEARCH_API;

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-4 py-2 border border-[#DDDDDD] rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <span className="absolute right-3 top-2.5 text-[#999999]">🔍</span>
    </div>
  );
};
