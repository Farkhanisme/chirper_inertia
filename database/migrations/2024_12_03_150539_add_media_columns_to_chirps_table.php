<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('chirps', function (Blueprint $table) {
            $table->string('media_path')->nullable()->after('message');
            $table->string('media_type')->nullable()->after('media_path');
        });
    }

    public function down()
    {
        Schema::table('chirps', function (Blueprint $table) {
            $table->dropColumn('media_path');
            $table->dropColumn('media_type');
        });
    }
};
