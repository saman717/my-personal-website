import { useState, useEffect, useRef } from "react";
import { useToast } from "@/context/ToastContext";
import { getAdminBookingsAction, updateBookingStatusAction, deleteBookingAction } from "@/actions/admin-bookings";
import { BookingRequest } from "@/components/admin/booking/BookingTable";

type FilterType = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED" | "CONFIRMED";

function getRelativeTime(dateString: string, locale: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return locale === "fa" ? "لحظاتی پیش" : "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return locale === "fa" ? `${diffInMinutes} دقیقه پیش` : `${diffInMinutes} mins ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return locale === "fa" ? `${diffInHours} ساعت پیش` : `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return locale === "fa" ? "دیروز" : "Yesterday";
    if (diffInDays < 7) return locale === "fa" ? `${diffInDays} روز پیش` : `${diffInDays} days ago`;

    return date.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", { month: "short", day: "numeric" });
}

export function useBookingManager(locale: string, labels: any) {
    const { showToast, updateToast, dismissToast } = useToast();
    
    // استخراج بخش توست‌ها از لیبل‌های ورودی
    const t = labels?.toasts || {}; 

    const loadingToastIdRef = useRef<number | null>(null);
    const hasInitialLoadedRef = useRef<boolean>(false);

    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [panelType, setPanelType] = useState<"RULES" | "DETAILS" | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

    const fetchBookings = async () => {
        setLoading(true);
        if (!hasInitialLoadedRef.current && !loadingToastIdRef.current) {
            loadingToastIdRef.current = showToast(t.loading_fetch || "Loading...", "loading-white");
        }

        try {
            const response = await getAdminBookingsAction();
            if (response.success && response.data) {
                const formattedData: BookingRequest[] = response.data.map((item: any) => {
                    const dateObj = new Date(item.createdAt);
                    return {
                        id: String(item.id),
                        clientName: item.clientName,
                        clientEmail: item.clientEmail,
                        date: item.date,
                        timeSlot: item.timeSlot,
                        meetingType: item.meetingType,
                        status: item.status,
                        clientNote: item.clientNote || "",
                        adminNote: item.adminNote || "",
                        createdAt: dateObj.toISOString(),
                        day: dateObj.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", { weekday: "long" }),
                        createdLabel: getRelativeTime(item.createdAt, locale),
                    };
                });

                setRequests(formattedData);

                if (selectedRequest) {
                    const updatedSelected = formattedData.find(r => r.id === selectedRequest.id);
                    if (updatedSelected) setSelectedRequest(updatedSelected);
                }

                if (loadingToastIdRef.current) {
                    updateToast(loadingToastIdRef.current, t.success_fetch || "Success", "success");
                    loadingToastIdRef.current = null;
                    hasInitialLoadedRef.current = true;
                }
            } else {
                if (loadingToastIdRef.current) {
                    updateToast(loadingToastIdRef.current, response.error ?? (t.error_fetch || "Error"), "error");
                    loadingToastIdRef.current = null;
                }
            }
        } catch (error) {
            if (loadingToastIdRef.current) {
                updateToast(loadingToastIdRef.current, t.error_db || "Network error", "error");
                loadingToastIdRef.current = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: "ACCEPTED" | "REJECTED" | "CONFIRMED") => {
        const target = requests.find(r => r.id === id);
        if (target && (target.status === "CONFIRMED" || target.status === "REJECTED")) {
            showToast(t.locked_session || "Locked", "error");
            return;
        }

        const actionToastId = showToast(t.loading_update || "Updating...", "loading-orange");
        try {
            const response = await updateBookingStatusAction(id, newStatus);
            if (response?.success) {
                await fetchBookings();
                updateToast(actionToastId, t.success_update || "Updated", "success");
            } else {
                updateToast(actionToastId, response?.error ?? (t.error_update || "Error"), "error");
            }
        } catch (error) {
            updateToast(actionToastId, t.error_db || "Server error", "error");
        }
    };

    const handleDeleteBooking = async (id: string) => {
        const isConfirmed = window.confirm(t.confirm_delete || "Are you sure?");
        if (!isConfirmed) return;

        const deleteToastId = showToast(t.loading_delete || "Deleting...", "loading-orange");
        try {
            const response = await deleteBookingAction(id);
            if (response.success) {
                if (selectedRequest?.id === id) {
                    setPanelType(null);
                    setSelectedRequest(null);
                }
                await fetchBookings();
                updateToast(deleteToastId, t.success_delete || "Deleted", "success");
            } else {
                updateToast(deleteToastId, response.error ?? (t.error_delete || "Delete error"), "error");
            }
        } catch (error) {
            updateToast(deleteToastId, t.error_db || "Server error", "error");
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [locale]);

    useEffect(() => {
        return () => {
            if (loadingToastIdRef.current) dismissToast(loadingToastIdRef.current);
        };
    }, [dismissToast]);

    const handleOpenDetails = (req: BookingRequest) => {
        setSelectedRequest(req);
        setPanelType("DETAILS");
    };

    return {
        requests,
        loading,
        panelType,
        setPanelType,
        selectedRequest,
        activeFilter,
        setActiveFilter,
        handleUpdateStatus,
        handleDeleteBooking,
        handleOpenDetails,
        fetchBookings
    };
}