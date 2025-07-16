// src/components/ErrorCard.tsx
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export function ErrorCard({ message }: { message: string }) {
  return (
    <Card className="relative border border-red-600 bg-red-50">
      {/* sobrepõe o conteúdo original */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-red-50/90">
        <CardHeader>
          <CardTitle className="text-red-700 text-lg text-center">
            {message}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-red-600">
          Tente novamente mais tarde
        </CardFooter>
      </div>
    </Card>
  );
}
