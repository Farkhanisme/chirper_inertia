<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
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
    public function update(Request $request, Chirp $chirp)// menjadi ini
    {

        Gate::authorize('update', $chirp);

        $validated = $request->validate([
            'message' => 'required|string|max:255',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,mp4,wav|max:20480',
            'hashtags' => 'nullable|string'
        ]);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            if ($chirp->media_path && Storage::exists($chirp->media_path)) {
                Storage::delete($chirp->media_path);
            }

            $file = $request->file('media');
            $mediaType = $file->getMimeType();
            $mediaPath = $file->store('media', 'public');

            $chirp->update([
                'message' => $validated['message'],
                'media_path' => $mediaPath,
                'media_type' => $mediaType
            ]);
        } else {
            $chirp->update([
                'message' => $validated['message']
            ]);
        }

        $hashtags = json_decode($request->input('hashtags', '[]'), true);
        foreach ($hashtags as $tag) {
            $chirp->update(['name' => $tag]);
        }

        // $chirp->update($validated);
        
        return redirect(route('chirps.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    // menjadi ini
    public function destroy(Chirp $chirp): RedirectResponse
    {
        //
        Gate::authorize('delete', $chirp);

        $chirp->delete();

        return redirect(route('chirps.index'));
    }
}
