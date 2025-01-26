// components/GlobalSuspense.tsx
"use client";

import { Suspense, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface GlobalSuspenseProps {
    children: ReactNode;
}

export default function GlobalSuspense({ children }: GlobalSuspenseProps) {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen bg-background">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Chargement en cours...</p>
                    </div>
                </div>
            }
        >
            {children}
        </Suspense>
    );
}