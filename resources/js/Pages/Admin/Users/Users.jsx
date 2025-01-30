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
import { useForm } from "@inertiajs/react";

const Page = ({ users, roles }) => {
    let no = 1;
    const { data, setData, post, processing } = useForm({
        role: "",
    });

    const updateRole = (userId) => {
        post(route("admin.users.update-role", userId), {
            preserveScroll: true,
        });
    };

    const handleView = (user_id) => {
        window.location.href = `/admin/user-chirps?user_id=${user_id}`;
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
                                        User Management
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <table className="min-w-full divide-y divide-gray-200 border table-fixed">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Jumlah Chirps</th>
                                <th>Status</th>
                                <th>Role</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id} className="text-center">
                                    <td>{no++}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.chirps_count}</td>
                                    <td>
                                        {user.is_active ? "Aktif" : "Nonaktif"}
                                    </td>
                                    <td>
                                        <select
                                            value={user.roles[0]?.name || ""}
                                            onChange={(e) => {
                                                setData("role", e.target.value);
                                                updateRole(user.id);
                                            }}
                                            className="my-1 text-center w-fit rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            {roles.map((role) => (
                                                <option
                                                    key={role.id}
                                                    value={role.name}
                                                >
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                post(
                                                    route(
                                                        "admin.users.toggle-status",
                                                        user.id
                                                    )
                                                )
                                            }
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            {user.is_active
                                                ? "Nonaktifkan"
                                                : "Aktifkan"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                post(
                                                    route(
                                                        "admin.users.destroy",
                                                        user.id
                                                    ),
                                                    {
                                                        method: "delete",
                                                    }
                                                )
                                            }
                                            className="ml-4 text-red-600 hover:text-red-900"
                                        >
                                            Hapus
                                        </button>
                                        <button
                                            className="ml-4 text-green-600 hover:text-green-900"
                                            onClick={() => handleView(user.id)}
                                        >
                                            View Chirp
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Page;
