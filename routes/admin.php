<?php

use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'role:Admin')
    ->name('admin.')
    ->prefix('admin')
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index'])->name('index');
        Route::get('/users', [AdminController::class, 'users'])->name('user.index');
        Route::get('/user-chirps', [AdminController::class, 'userChirp'])->name('user.chirp');
        Route::post('/users/{user}/toggle-status', [AdminController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::delete('/users/{user}', [AdminController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/role', [AdminController::class, 'updateRole'])->name('users.update-role');
        Route::delete('/chirps/{chirp}', [AdminController::class, 'destroyChirp'])->name('chirps.destroy');
        Route::post('/chirps/{chirp}/review', [AdminController::class, 'markForReview'])->name('chirps.review');
        Route::post('/chirps/{chirp}/done-review', [AdminController::class, 'doneReview'])->name('chirps.doneReview');
        Route::get('/chirps/review', [AdminController::class, 'review'])->name('chirps.underReview');
        Route::get('/reports', [AdminController::class, 'reports'])->name('reports.index');
        Route::patch('/reports/{report}', [AdminController::class, 'update'])->name('reports.update');
    });
