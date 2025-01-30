import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Chirp from "@/Components/Chirp";
import Editor from "@/Components/Editor";

// export default function Index({ auth }) { // ubah ini
export default function Index({ auth, chirps }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chirps" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Form Chirp */}
                <Editor />
                {/* Daftar Chirps */}
                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {chirps.data.map((chirp) => (
                        <Chirp key={chirp.id} chirp={chirp} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
