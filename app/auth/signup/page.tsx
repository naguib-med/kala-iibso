import { SignUpForm } from "@/components/auth/sign-up-form"

export default function SignUpPage() {
    return (
        <div className="container flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center mt-[4rem]">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Créer un compte
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Inscrivez-vous pour commencer à acheter et vendre
                    </p>
                </div>
                <SignUpForm />
            </div>
        </div>
    )
}