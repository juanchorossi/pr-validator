import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-[#333333]">
          Welcome to PR Validator
        </h1>
        <SearchInput />
        <Button />
      </div>
    </main>
  );
}
