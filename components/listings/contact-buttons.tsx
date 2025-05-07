'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Flag } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactButtonsProps {
    sellerName: string;
    listingId: string;
    listingTitle: string;
}

export default function ContactButtons({ sellerName, listingId, listingTitle }: ContactButtonsProps) {
    const [messageText, setMessageText] = useState('');
    const [reportReason, setReportReason] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [messageSent, setMessageSent] = useState(false);
    const [reportSent, setReportSent] = useState(false);

    const handleSendMessage = () => {
        // Simuler l'envoi du message (dans une vraie implémentation, appelez votre API)
        console.log('Message envoyé:', messageText);
        setMessageSent(true);
        // Réinitialiser après 3 secondes
        setTimeout(() => {
            setMessageSent(false);
            setMessageText('');
        }, 3000);
    };

    const handleSendReport = () => {
        // Simuler l'envoi du signalement
        console.log('Signalement envoyé:', { raison: reportReason, description: reportDescription });
        setReportSent(true);
        // Réinitialiser après 3 secondes
        setTimeout(() => {
            setReportSent(false);
            setReportReason('');
            setReportDescription('');
        }, 3000);
    };

    return (
        <div className="grid grid-cols-1 gap-3 mt-6">
            {/* Dialogue de contact vendeur */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Contacter le vendeur
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Contacter {sellerName}</DialogTitle>
                        <DialogDescription>
                            Envoyez un message au vendeur à propos de l'annonce «&nbsp;{listingTitle}&nbsp;»
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Bonjour, je suis intéressé par votre annonce..."
                            className="min-h-[120px]"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button onClick={handleSendMessage} disabled={!messageText.trim() || messageSent}>
                            {messageSent ? "Message envoyé !" : "Envoyer"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Dialogue de signalement */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="w-full">
                        <Flag className="mr-2 h-4 w-4" />
                        Signaler l'annonce
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Signaler cette annonce</DialogTitle>
                        <DialogDescription>
                            Aidez-nous à maintenir un environnement sûr en signalant les problèmes
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="report-reason">Raison du signalement</Label>
                            <select
                                id="report-reason"
                                className="w-full rounded-md border p-2"
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                            >
                                <option value="">Sélectionnez une raison</option>
                                <option value="fake">Annonce frauduleuse</option>
                                <option value="inappropriate">Contenu inapproprié</option>
                                <option value="prohibited">Article interdit</option>
                                <option value="other">Autre problème</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="report-description">Description</Label>
                            <Textarea
                                id="report-description"
                                value={reportDescription}
                                onChange={(e) => setReportDescription(e.target.value)}
                                placeholder="Merci de décrire le problème..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button onClick={handleSendReport} disabled={!reportReason || reportSent}>
                            {reportSent ? "Signalement envoyé !" : "Envoyer"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}