<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
use App\Models\Report;
use Illuminate\Http\RedirectResponse; // tambahkan ini
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage; // Tambahkan ini

// use Illuminate\Http\Response; // hapus ini
use Illuminate\Support\Facades\Gate; // tambahkan ini
use Inertia\Inertia;
use Inertia\Response;

class ChirpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index() // ubah dari ini
    public function index(): Response // ke ini
    {

        // return response('Hello, World!'); // hapus ini
        // danti dengan ini

        // tambahkan baris dibawah ini
        $chirps = Chirp::with(['user:id,name', 'hashtags'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Chirps/Index', [
            //
            'chirps' => $chirps
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request) // ubah ini
    public function store(Request $request) // : RedirectResponse // hapus : RedirectResponse
    {
        // dd($request->all());
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,mp4,wav|max:20480',
            'hashtags' => 'nullable|string'
        ]);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $mediaPath = $file->store('media', 'public');
            $mediaType = $file->getMimeType();
        }

        $chirp = $request->user()->chirps()->create([
            'message' => $validated['message'],
            'media_path' => $mediaPath,
            'media_type' => $mediaType
        ]);

        $hashtags = json_decode($request->input('hashtags', '[]'), true);
        foreach ($hashtags as $tag) {
            $chirp->hashtags()->create(['name' => $tag]);
        }

        return redirect(route('chirps.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Chirp $chirp)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chirp $chirp)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, Chirp $chirp) // ubah ini
    public function update(Request $request, Chirp $chirp) // : RedirectResponse
    {
        dd($request->all());

        Gate::authorize('update', $chirp);

        try {
            $validated = $request->validate([
                'message' => 'required|string|max:2000',
                'media' => 'nullable|file|mimes:jpg,jpeg,png,mp4,wav|max:20480',
                'hashtags' => 'nullable|string'
            ]);

            $updateData = ['message' => $validated['message']];

            if ($request->hasFile('media')) {
                // Delete old media if exists
                if ($chirp->media_path) {
                    Storage::disk('public')->delete($chirp->media_path);
                }

                // Store new media
                $file = $request->file('media');
                $mediaPath = $file->store('chirps', 'public');

                $updateData['media_path'] = $mediaPath;
                $updateData['media_type'] = $file->getMimeType();
            }

            $chirp->update($updateData);

            return redirect(route('chirps.index'));
        } catch (\Exception $e) {
            report($e);

            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update the chirp. ' . $e->getMessage()]);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    // menjadi ini
    public function destroy(Chirp $chirp): RedirectResponse
    {
        //
        Gate::authorize('delete', $chirp);

        // dd($chirp->media_path);

        if ($chirp->media_path) {
            Storage::disk('public')->delete($chirp->media_path);
        }

        $chirp->delete();

        return redirect(route('chirps.index'));
    }

    public function report(Request $request)
    {
        // dd($request);
        $validated = $request->validate([
            'chirp_id' => 'nullable|exists:chirps,id',
            'reported_id' => 'nullable|exists:users,id',
            'reason' => 'required|string',
        ]);

        Report::create([
            'reporter_id' => $request->user()->id,
            'chirp_id' => $validated['chirp_id'] ?? null,
            'reported_id' => $validated['reported_id'] ?? null,
            'reason' => $validated['reason'],
        ]);

        return redirect(route('chirps.index'));
    }
}
