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

const Page = ({ chirp }) => {
    const renderMedia = (chirp) => {
        if (!chirp.media_path) return <p>No Media</p>;

        const mediaType = chirp.media_type.split("/")[0];
        const mediaUrl = `/storage/${chirp.media_path}`;

        return (
            <div className="my-2 w-1/2">
                {mediaType === "image" && (
                    <img
                        src={mediaUrl}
                        alt="Chirp Media"
                        className="w-full rounded-lg"
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

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this Chirp?")) {
            Inertia.delete(`/admin/chirps/${id}`);
        }
    };

    const markForReview = (id) => {
        if (confirm("Tandain Chirp ini untuk Di review?")) {
            Inertia.post(`/admin/chirps/${id}/review`);
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
                                    <BreadcrumbPage>User Chirps</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="space-y-4">
                        {chirp.data.map((chirp, index) => (
                            <div
                                key={chirp.id}
                                className="p-4 bg-white flex items-start gap-4"
                            >
                                {/* Chirp Content */}
                                <div className="flex-1">
                                    {/* Username & Timestamp */}
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {chirp.user?.name || "Unknown"}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                            {new Date(
                                                chirp.created_at
                                            ).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="text-gray-700 flex">
                                        <div
                                            className="mt-4 text-lg text-gray-900 w-1/2"
                                            dangerouslySetInnerHTML={{
                                                __html: chirp.message,
                                            }}
                                        />
                                        {renderMedia(chirp)}
                                    </div>

                                    <div className="mt-3 flex space-x-4">
                                        <button
                                            onClick={() =>
                                                handleDelete(chirp.id)
                                            }
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() =>
                                                markForReview(chirp.id)
                                            }
                                            className="text-blue-500 hover:underline"
                                        >
                                            Mark for Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Page;
