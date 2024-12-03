<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
use Illuminate\Http\RedirectResponse; // tambahkan ini
use Illuminate\Http\Request;

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
        return Inertia::render('Chirps/Index', [
            //
            'chirps' => Chirp::with('user:id,name')->latest()->get(), // tambahkan ini
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
    public function store(Request $request): RedirectResponse // menjadi ini
    {
        // serta tambahkan ini
        $validated = $request->validate([
            'message' => 'required|string|max:255',
        ]);
 
        $request->user()->chirps()->create($validated);
 
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
    public function update(Request $request, Chirp $chirp): RedirectResponse // menjadi ini
    {
        //
        Gate::authorize('update', $chirp);
 
        $validated = $request->validate([
            'message' => 'required|string|max:255',
        ]);
 
        $chirp->update($validated);
 
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
