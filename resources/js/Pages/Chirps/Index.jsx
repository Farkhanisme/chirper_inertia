import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Head } from "@inertiajs/react";
import InputError from '@/Components/InputError';
import PrimaryButton from "@/Components/PrimaryButton";
import Chirp from "@/Components/Chirp";

// export default function Index({ auth }) { // ubah ini
export default function Index({ auth, chirps }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
    });
    // menjadi ini
    const [message, setMessage] = useState("");
    const [media, setMedia] = useState(null);
    const [hashtags, setHashtags] = useState([]);

    const extractHashtags = (text) => {
        const hashtagRegex = /#(\w+)/g;
        const foundHashtags = text.match(hashtagRegex) || [];
        return foundHashtags.map((tag) => tag.slice(1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("message", message);
        formData.append("hashtags", JSON.stringify(hashtags));

        if (media) {
            formData.append("media", media);
        }

        Inertia.post(route("chirps.store"), formData, {
            forceFormData: true,
            preserveState: true,
        });

        // Reset form
        setMessage("");
        setMedia(null);
    };

    const renderMedia = (chirp) => {
        if (!chirp.media_path) return null;

        const mediaType = chirp.media_type.split("/")[0];
        const mediaUrl = `/storage/${chirp.media_path}`;

        return (
            <div className="mt-2">
                {mediaType === "image" && (
                    <img
                        src={mediaUrl}
                        alt="Chirp Media"
                        className="max-w-full rounded-lg"
                    />
                )}
                {mediaType === "video" && (
                    <video
                        src={mediaUrl}
                        controls
                        className="max-w-full rounded-lg"
                    />
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chirps" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Form Chirp */}
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 bg-white shadow rounded-lg p-4"
                >
                    <CKEditor
                        editor={ClassicEditor}
                        data={message}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setMessage(data);
                            setHashtags(extractHashtags(data));
                        }}
                        config={{
                            placeholder: `What's on your mind?`,
                            licenseKey:
                                "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzQ0Nzk5OTksImp0aSI6IjE5NzNhZThhLTk2NWQtNDlmMS1iNzlhLTQwZTk4ZTc2MjA1ZiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjUzZTc0MjJiIn0.j1g8QVvRH5TXgSwq9VOlzh1ZV0E86dWxcIMsIK69SMO1QiUZJQBv85XJUOpdVh0ipURjT6kXXlsRbkaz-8HgyQ",
                            toolbar: [
                                "bold",
                                "italic",
                                "link",
                                "|",
                                "bulletedList",
                                "numberedList",
                                "|",
                                "undo",
                                "redo",
                            ],
                        }}
                    />

                    {hashtags.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                            Hashtags:{" "}
                            {hashtags.map((tag) => `#${tag}`).join(", ")}
                        </div>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setMedia(e.target.files[0])}
                            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />

                        <InputError message={errors.media} className="mt-2" />
                        <PrimaryButton className="mt-4" disabled={processing}>
                            Chirp
                        </PrimaryButton>
                    </div>
                </form>

                {/* Daftar Chirps */}
                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {chirps.data.map(chirp =>
                        <Chirp key={chirp.id} chirp={chirp} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
