import React, { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useForm, usePage } from "@inertiajs/react";

dayjs.extend(relativeTime);

export default function Chirp({ chirp }) {
    const { auth } = usePage().props;

    const [editing, setEditing] = useState(false);

    const { data, setData, patch, clearErrors, reset, errors } = useForm({
        message: chirp.message,
        media: null,
    });

    const submit = (e) => {
        e.preventDefault();
        console.log("Data being sent:", data);
        const formData = new FormData();
        formData.append("message", data.message);

        if (data.media) {
            formData.append("media", data.media);
        }

        patch(route("chirps.update", chirp.id), {
            data: formData,
            forceFormData: true,
            onSuccess: () => setEditing(false),
            onError: (errors) => {
                console.error("Errors:", errors);
            },
        });
        
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
        <div className="p-6 flex space-x-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 -scale-x-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
            </svg>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-gray-800">{chirp.user.name}</span>
                        <small className="ml-2 text-sm text-gray-600">
                            {dayjs(chirp.created_at).fromNow()}
                        </small>
                        {/* tambahkan ini */}
                        {chirp.created_at !== chirp.updated_at && (
                            <small className="text-sm text-gray-600">
                                {" "}
                                &middot; edited
                            </small>
                        )}
                    </div>
                    {/* dan juga ini */}
                    {chirp.user.id === auth.user.id && (
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-gray-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <button
                                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </button>
                                {/* tambahkan ini */}
                                <Dropdown.Link
                                    as="button"
                                    href={route("chirps.destroy", chirp.id)}
                                    method="delete"
                                >
                                    Delete
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    )}
                </div>
                {/* menjadi ini */}
                {editing ? (
                    <form onSubmit={submit}>
                        <CKEditor
                            editor={ClassicEditor}
                            data={data.message}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setData("message", data);
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

                        <div className="mt-4 flex justify-between items-center">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const data = e.target.files[0];
                                    setData("media", data);
                                }}
                                className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />

                            <InputError
                                message={errors.media}
                                className="mt-2"
                            />
                            <PrimaryButton className="mt-4">Save</PrimaryButton>
                            <button
                                className="mt-4"
                                onClick={() => {
                                    setEditing(false);
                                    reset();
                                    clearErrors();
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                        <div>
                            {renderMedia(chirp)}
                        </div>
                    </form>
                ) : (
                    <div>
                        <div
                            className="mt-4 text-lg text-gray-900"
                            dangerouslySetInnerHTML={{
                                __html: chirp.message,
                            }}
                        />
                        {renderMedia(chirp)}
                    </div>
                )}
            </div>
        </div>
    );
}
