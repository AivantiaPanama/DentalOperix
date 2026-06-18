import { useEffect, useState, type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BookingDialog, type BookingDialogInitialData } from "./BookingDialog";
import { FloatingDentalAIChat } from "./FloatingDentalAIChat";
import { ServiceInfoDialog } from "./ServiceInfoDialog";
import { getSiteServiceBySlug, siteServices, type SiteService } from "@/data/siteServices";

type Props = {
  children?:
    | ReactNode
    | ((
        openBooking: (id?: string) => void,
        openServiceInfo: (serviceIdOrSlug: string) => void,
      ) => ReactNode);
};

export function SiteLayout({ children }: Props) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingInitialData, setBookingInitialData] = useState<
    BookingDialogInitialData | undefined
  >(undefined);
  const [selectedService, setSelectedService] = useState<SiteService | undefined>(undefined);
  const [serviceInfoOpen, setServiceInfoOpen] = useState(false);

  const openBooking = (serviceId?: string) => {
    setBookingInitialData(serviceId ? { serviceId } : undefined);
    setBookingOpen(true);
  };

  const openBookingWithData = (data: BookingDialogInitialData) => {
    setBookingInitialData(data);
    setBookingOpen(true);
  };

  const openServiceInfo = (serviceIdOrSlug: string) => {
    const service =
      siteServices.find((item) => item.id === serviceIdOrSlug) ??
      getSiteServiceBySlug(serviceIdOrSlug);

    if (!service) return;

    setSelectedService(service);
    setServiceInfoOpen(true);
  };

  useEffect(() => {
    if (!bookingOpen) {
      setBookingInitialData(undefined);
    }
  }, [bookingOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar onBook={() => openBooking()} />
      <main className="flex-1">
        {typeof children === "function" ? children(openBooking, openServiceInfo) : children}
      </main>
      <Footer onServiceInfo={openServiceInfo} />
      <FloatingDentalAIChat onBook={openBookingWithData} />
      <ServiceInfoDialog
        service={selectedService}
        open={serviceInfoOpen}
        onOpenChange={setServiceInfoOpen}
        onBook={openBooking}
      />
      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialData={bookingInitialData}
      />
    </div>
  );
}
