import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Inertia } from "@inertiajs/inertia";

const ChirpUnderReview = ({ chirps }) => {
    const renderMedia = (chirp) => {
        if (!chirp.media_path) return <p>No Media</p>;

        const mediaType = chirp.media_type.split("/")[0];
        const mediaUrl = `/storage/${chirp.media_path}`;

        return (
            <div className="mt-2 w-1/2 flex justify-center items-center">
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

    const doneReview = (id) => {
        if (confirm("Apakah Chirp ini selesai Di Review?")) {
            Inertia.post(`/admin/chirps/${id}/done-review`);
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this Chirp?")) {
            Inertia.delete(`/admin/chirps/${id}`);
        }
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Chirp Review</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <h1>Chirps Under Review</h1>
                    <div className="space-y-4">
                        {chirps.data.map((chirp, index) => (
                            <div
                                key={chirp.id}
                                className="p-4 bg-white flex flex-col gap-4"
                            >
                                {/* Header: Username & Date */}
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {chirp.user?.name || "Unknown"}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {new Date(
                                            chirp.created_at
                                        ).toLocaleString()}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="text-gray-700 flex">
                                    <div
                                        className="mt-4 text-lg text-gray-900 w-1/2"
                                        dangerouslySetInnerHTML={{
                                            __html: chirp.message,
                                        }}
                                    />
                                    {renderMedia(chirp)}
                                </div>

                                {/* Hashtags */}
                                {chirp.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {chirp.hashtags.map((hashtag) => (
                                            <span
                                                key={hashtag.id}
                                                className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-md"
                                            >
                                                #{hashtag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-3 flex space-x-4">
                                    <button
                                        onClick={() => handleDelete(chirp.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => doneReview(chirp.id)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Done Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default ChirpUnderReview;
