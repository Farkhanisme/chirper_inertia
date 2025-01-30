<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Chirp;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        // Query dasar
        $baseQueryChirps = Chirp::query();
        $baseQueryReports = Report::query();

        // Filter berdasarkan tanggal jika diberikan
        if ($from && $to) {
            $baseQueryChirps->whereBetween('created_at', [$from, $to]);
            $baseQueryReports->whereBetween('created_at', [$from, $to]);
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => User::where('is_active', true)
                ->whereDoesntHave('roles', function ($query) {
                    $query->where('name', 'admin');
                })->count(),

            'chirps' => [
                'daily' => (clone $baseQueryChirps)->whereDate('created_at', now()->toDateString())->count(),
                'weekly' => (clone $baseQueryChirps)->whereBetween('created_at', [now()->subDays(7)->startOfDay(), now()->endOfDay()])->count(),
                'monthly' => (clone $baseQueryChirps)->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->endOfDay()])->count(),
            ],

            'reports' => $baseQueryReports->count(),
        ]);
    }


    public function users(): Response
    {

        $users = User::with(['roles', 'permissions'])
            ->whereDoesntHave('roles', function ($query) {
                $query->where('name', 'admin');
            })
            ->withCount('chirps')
            ->paginate(10);

        $roles = Role::where('name', '!=', 'admin')->get();

        return Inertia::render('Admin/Users/Users', [
            'users' => $users,
            'roles' => $roles
        ]);
    }

    public function userChirp(Request $request): Response
    {

        $userId = $request->input('user_id');

        $chirps = Chirp::where('user_id', $userId)
            ->with(['user:id,name', 'hashtags'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Users/Chirps', [
            'chirp' => $chirps
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name|not_in:admin'
        ]);

        // Cek apakah user yang akan diupdate memiliki role admin
        if ($user->hasRole('admin')) {
            return redirect()->back()->with('error', 'Tidak dapat mengubah role admin');
        }

        $user->syncRoles([$request->role]);
        return redirect()->back()->with('message', 'Role pengguna berhasil diperbarui');
    }

    public function toggleStatus(User $user)
    {
        // Cek apakah user yang akan diupdate memiliki role admin
        if ($user->hasRole('admin')) {
            return redirect()->back()->with('error', 'Tidak dapat menonaktifkan akun admin');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return redirect()->back()->with('message', 'Status pengguna berhasil diperbarui');
    }

    public function destroy(User $user)
    {
        // Cek apakah user yang akan dihapus memiliki role admin
        if ($user->hasRole('admin')) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus akun admin');
        }

        $user->delete();
        return redirect()->route('users.index')->with('message', 'Pengguna berhasil dihapus');
    }

    public function destroyChirp(Chirp $chirp)
    {
        if ($chirp->media_path) {
            Storage::disk('public')->delete($chirp->media_path);
        }
        $chirp->delete();
        return redirect()->route('users.index')->with('success', 'Chirp deleted successfully.');
    }

    public function markForReview(Chirp $chirp)
    {
        $chirp->update(['status' => 'under_review']);
    }

    public function doneReview(Chirp $chirp)
    {
        $chirp->update(['status' => 'active']);
        // return inertia('Admin/Users/ChirpUnderReview');
    }

    public function review()
    {
        $chirps = Chirp::with(['user:id,name', 'hashtags'])
            ->where('status', 'under_review')
            ->latest()
            ->paginate(10);

        return inertia('Admin/Users/ChirpUnderReview', [
            'chirps' => $chirps,
        ]);
    }

    public function reports()
    {
        $reports = Report::with([
            'reporter',
            'reported',
            'chirp'
        ])
            ->where('reviewed', false)
            ->latest()
            ->get();

        return Inertia::render('Admin/Users/Reports', [
            'reports' => $reports,
            'pendingCount' => Report::where('reviewed', false)->count()
        ]);
    }

    public function update(Report $report, Request $request)
    {

        $report->reviewed = !$report->reviewed;
        $report->save();

        return redirect()->back()->with('success', 'Report updated successfully');
    }
}
