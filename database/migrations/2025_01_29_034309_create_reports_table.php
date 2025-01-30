<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportsTable extends Migration
{
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade'); // ID pelapor
            $table->foreignId('reported_id')->nullable()->constrained('users')->onDelete('cascade'); // ID pengguna yang dilaporkan
            $table->foreignId('chirp_id')->nullable()->constrained('chirps')->onDelete('cascade'); // ID chirp yang dilaporkan
            $table->text('reason'); // Alasan pelaporan
            $table->boolean('reviewed')->default(false); // Status peninjauan
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reports');
    }
}