import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiSend } from "react-icons/fi";

const input =
    "w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm";

/**
 * Form kontak - pesan disimpan ke menu "Pesan Masuk" di admin.
 */
export default function ContactForm() {
    const { flash } = usePage().props;
    const [sent, setSent] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        website: "", // honeypot
    });

    useEffect(() => {
        if (flash?.success && sent) reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        post(route("contact.store"), {
            preserveScroll: true,
            onSuccess: () => setSent(true),
        });
    };

    if (sent && flash?.success) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <FiCheckCircle className="w-12 h-12 text-green-500" />
                <p className="mt-4 text-lg font-medium">Pesan terkirim!</p>
                <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                    Terima kasih sudah menghubungi. Saya akan membalas secepatnya.
                </p>
                <button onClick={() => setSent(false)} className="mt-6 text-sm text-blue-600 hover:underline">
                    Kirim pesan lain
                </button>
            </div>
        );
    }

    const err = (name) => errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>;

    return (
        <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="c_name" className="block mb-1.5 text-sm font-medium">Nama</label>
                    <input id="c_name" value={data.name} onChange={(e) => setData("name", e.target.value)} className={input} placeholder="Nama Anda" required />
                    {err("name")}
                </div>
                <div>
                    <label htmlFor="c_email" className="block mb-1.5 text-sm font-medium">Email</label>
                    <input id="c_email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} className={input} placeholder="nama@email.com" required />
                    {err("email")}
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="c_phone" className="block mb-1.5 text-sm font-medium">
                        WhatsApp <span className="text-gray-400 font-normal">(opsional)</span>
                    </label>
                    <input id="c_phone" value={data.phone} onChange={(e) => setData("phone", e.target.value)} className={input} placeholder="08xxxxxxxxxx" />
                    {err("phone")}
                </div>
                <div>
                    <label htmlFor="c_subject" className="block mb-1.5 text-sm font-medium">Keperluan</label>
                    <input id="c_subject" value={data.subject} onChange={(e) => setData("subject", e.target.value)} className={input} placeholder="Pembuatan website, kolaborasi, ..." />
                    {err("subject")}
                </div>
            </div>
            <div>
                <label htmlFor="c_message" className="block mb-1.5 text-sm font-medium">Pesan</label>
                <textarea id="c_message" rows={5} value={data.message} onChange={(e) => setData("message", e.target.value)} className={input} placeholder="Ceritakan kebutuhan, target, dan perkiraan waktu proyek Anda..." required />
                {err("message")}
            </div>
            {/* Honeypot: disembunyikan dari manusia */}
            <input type="text" name="website" value={data.website} onChange={(e) => setData("website", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button
                type="submit"
                disabled={processing}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:opacity-90 disabled:opacity-60 transition"
            >
                <FiSend /> {processing ? "Mengirim..." : "Kirim Pesan"}
            </button>
        </form>
    );
}
