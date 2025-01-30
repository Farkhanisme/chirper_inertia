import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";

const Dashboard = ({ users, chirps, reports }) => {
    const [dateRange, setDateRange] = useState({ from: "", to: "" });

    const handleFilter = () => {
        Inertia.get(route("admin.index"), dateRange);
    };

    const clearFilter = () => {
        setDateRange({ from: "", to: "" });
        Inertia.get(route("admin.index"));
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
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">
                                Pengguna Aktif
                            </h3>
                            <p className="text-3xl font-bold">{users}</p>
                        </div>
                        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">
                                Chirps Hari Ini
                            </h3>
                            <p className="text-3xl font-bold">{chirps.daily}</p>
                        </div>
                        <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">
                                Laporan Pelanggaran
                            </h3>
                            <p className="text-3xl font-bold">{reports}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">
                                Chirps Mingguan
                            </h3>
                            <p className="text-3xl font-bold">
                                {chirps.weekly}
                            </p>
                        </div>
                        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">
                                Chirps Bulanan
                            </h3>
                            <p className="text-3xl font-bold">
                                {chirps.monthly}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Filter Berdasarkan Waktu
                        </h2>
                        <div className="flex items-center space-x-4">
                            <input
                                type="date"
                                className="border p-2 rounded-md"
                                onChange={(e) =>
                                    setDateRange({
                                        ...dateRange,
                                        from: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="date"
                                className="border p-2 rounded-md"
                                onChange={(e) =>
                                    setDateRange({
                                        ...dateRange,
                                        to: e.target.value,
                                    })
                                }
                            />
                            <button
                                onClick={clearFilter}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Filter
                            </button>
                            <button
                                onClick={handleFilter}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Clear Filter
                            </button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Dashboard;
