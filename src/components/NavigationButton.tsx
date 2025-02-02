"use client";
import { useRouter } from "next/dist/client/components/navigation";

const NavigationButton = ({ route }: { route: string }) => {
  const router = useRouter();

  return (
    <span
      className="text-blue-600 cursor-pointer hover:underline"
      onClick={() => router.push("/" + route)}
    >
      {route}
    </span>
  );
};

export default NavigationButton;
