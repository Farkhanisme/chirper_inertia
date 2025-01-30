import React from "react";
import { router } from "@inertiajs/react";
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

const Reports = ({ reports, pendingCount }) => {
    const handleReview = (reportId) => {
        if (confirm("Apakah Chirp ini selesai Di Review?")) {
            router.patch(route("admin.reports.update", reportId));
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
                                    <BreadcrumbPage>
                                        Report Review
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h2 className="text-2xl font-bold mb-6">
                                    Report Baru {pendingCount}
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="p-6 hover:bg-gray-50"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-3 flex-1">
                                                <div>
                                                    <span className="font-medium">
                                                        Reporter:{" "}
                                                    </span>
                                                    <span className="text-gray-800">
                                                        {report.reporter.name}
                                                    </span>
                                                </div>

                                                <div>
                                                    {report.chirp_id ? (
                                                        <div className="space-y-2">
                                                            <span className="font-medium">
                                                                Reported Chirp:{" "}
                                                            </span>
                                                            <div className="bg-gray-50 p-3 rounded-md">
                                                                <div
                                                                    className="text-gray-800"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: report
                                                                            .chirp
                                                                            .message,
                                                                    }}
                                                                />
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    by{" "}
                                                                    {
                                                                        report
                                                                            .reported
                                                                            .name
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span className="font-medium">
                                                                Reported User:{" "}
                                                            </span>
                                                            <span className="text-gray-800">
                                                                {
                                                                    report
                                                                        .reported_user
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <span className="font-medium">
                                                        Reason:{" "}
                                                    </span>
                                                    <p className="mt-1 text-gray-600">
                                                        {report.reason}
                                                    </p>
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                    Reported:{" "}
                                                    {new Date(
                                                        report.created_at
                                                    ).toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="ml-4 space-x-5">
                                                <button
                                                    onClick={() =>
                                                        handleReview(report.id)
                                                    }
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Mark as Reviewed
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(chirp.id)
                                                    }
                                                    className="text-red-500 hover:underline"
                                                >
                                                    Delete Chirp
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {reports.length === 0 && (
                                    <div className="p-6 text-center text-gray-500">
                                        No unreviewed reports found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Reports;
