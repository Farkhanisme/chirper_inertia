<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddChirpsCountAndStatusToUsersTable extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('chirps_count')->default(0); // Menambahkan kolom chirps_count
            $table->string('status')->default('user'); // Menambahkan kolom status
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('chirps_count'); // Menghapus kolom chirps_count
            $table->dropColumn('status'); // Menghapus kolom status
        });
    }
}