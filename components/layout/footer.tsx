export function Footer() {
    return (
        <footer className="w-full border-t bg-background px-4">
            <div className="container py-10">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="text-lg font-semibold">À propos</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Qui sommes-nous</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Carrières</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Presse</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Support</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Centre d&apos;aide</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Sécurité</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Légal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Conditions d&apos;utilisation</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Politique de confidentialité</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Télécharger l&apos;application</h3>
                        <p className="mt-4 text-sm text-muted-foreground">Bientôt disponible sur iOS et Android</p>
                    </div>
                </div>
                <div className="mt-10 border-t pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        © 2024 Suuq Djibouti. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    )
}