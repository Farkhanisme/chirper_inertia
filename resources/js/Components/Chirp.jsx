import React, { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useForm, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import EditChirp from "./EditChirp";
import Report from "./Report";

dayjs.extend(relativeTime);

export default function Chirp({ chirp }) {
    const { reset, clearErrors } = useForm();
    const { auth } = usePage().props;
    
    const [editing, setEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const renderMedia = (chirp) => {
        if (!chirp.media_path) return null;

        const mediaType = chirp.media_type.split("/")[0];
        const mediaUrl = `/storage/${chirp.media_path}`;

        return (
            <div className="mt-2 flex justify-center items-center">
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
                    <div className="w-full justify-between flex">
                        <div>
                            <span className="text-gray-800">
                                {chirp.user.name}
                            </span>
                            <small className="ml-2 text-sm text-gray-600">
                                {dayjs(chirp.created_at).fromNow()}
                            </small>
                            {/* tambahkan ini */}
                            {chirp.created_at !== chirp.updated_at && (
                                <small className="text-sm text-gray-600">
                                    edited
                                </small>
                            )}
                        </div>
                        {chirp.user.id != auth.user.id && (
                            <button
                                className="ml-2 text-sm text-red-600"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Report
                            </button>
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
                {editing ? (
                    <div>
                        <EditChirp chirp={chirp} />
                        <button
                            className="relative float-end -top-7"
                            onClick={() => {
                                setEditing(false);
                                reset();
                                clearErrors();
                            }}
                        >
                            Cancel
                        </button>
                        <div>{renderMedia(chirp)}</div>
                    </div>
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

                {isModalOpen && (
                    <div className="border border-gray-300 rounded-md py-3 my-5">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="float-end px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50"
                        >
                            X
                        </button>
                        <Report chirpId={chirp} />
                    </div>
                )}
            </div>
        </div>
    );
}
