import { router } from "@inertiajs/react";
import React, { useState } from "react";

const Report = ({ chirpId }) => {
    const [reason, setReason] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(
            route("reports.store"),
            {
                chirp_id: chirpId.id,
                reported_id: chirpId.user_id,
                reason: reason,
            },
            {
                onSuccess: () => {
                    setReason("");
                },
            }
        );
    };
    return (
        <div className="w-full overflow-y-auto">
            <div className="flex h-fit items-center justify-center p-4">
                <div className="w-full px-3">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Laporkan Chirp
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="reason"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Kenapa anda melaporkan Chirp ini?
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                rows={4}
                                placeholder="Tulis alasan anda disini"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="submit"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                            >
                                submit report
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Report;
