import { ArrowRight, Info, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SiteService } from "@/data/siteServices";

type ServiceInfoDialogProps = {
  service?: SiteService;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (serviceId?: string) => void;
};

export function ServiceInfoDialog({
  service,
  open,
  onOpenChange,
  onBook,
}: ServiceInfoDialogProps) {
  if (!service) return null;

  const handleBook = () => {
    onOpenChange(false);
    window.setTimeout(() => onBook(service.id), 150);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl border-white/20 bg-white p-0 shadow-2xl sm:max-w-2xl">
        <div className="relative min-h-56 overflow-hidden rounded-t-3xl">
          <img src={service.image} alt={service.alt} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
          <DialogHeader className="relative z-10 justify-end p-6 text-left text-white sm:p-8">
            <DialogDescription className="text-sm font-medium uppercase tracking-[0.24em] text-white/75">
              Servicio DentalOperix
            </DialogDescription>
            <DialogTitle className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {service.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <p className="text-base leading-7 text-muted-foreground">{service.modalDescription}</p>

          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-primary shadow-sm">
                <Tag className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Precio sugerido
                </h3>
                <p className="mt-1 text-2xl font-bold text-deep">{service.suggestedPrice}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.priceNote}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl bg-secondary/60 p-4 text-sm leading-6 text-muted-foreground">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p>
              Precio referencial. El valor final depende de la evaluación clínica, diagnóstico,
              materiales, estudios requeridos y plan indicado por el especialista.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-3 border-t border-border px-6 py-5 sm:px-8">
          <Button type="button" variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button type="button" className="rounded-full bg-deep px-7 text-white hover:bg-primary" onClick={handleBook}>
            Agendar consulta <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
