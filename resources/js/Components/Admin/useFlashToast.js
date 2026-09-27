import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { useToast } from "@/Contexts/ToastContext";

/**
 * Menampilkan flash message dari server (session success/error) sebagai toast.
 */
export default function useFlashToast() {
    const { flash = {} } = usePage().props;
    const toast = useToast();

    useEffect(() => {
        const decode = (s) => {
            const el = document.createElement("textarea");
            el.innerHTML = s;
            return el.value;
        };
        if (flash.success) toast.success(decode(flash.success));
        if (flash.error) toast.error(decode(flash.error));
        if (flash.warning) toast.warning(decode(flash.warning));
        if (flash.info) toast.info(decode(flash.info));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash]);
}
