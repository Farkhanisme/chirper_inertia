<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;

class UpdateUserStatus extends Migration
{
    public function up()
    {
        $user = User::find(1); // Temukan pengguna dengan ID 1
        if ($user) {
            $user->status = 'admin'; // Ubah status menjadi 'admin'
            $user->save(); // Simpan perubahan
        }
    }

    public function down()
    {
        $user = User::find(1); // Temukan pengguna dengan ID 1
        if ($user) {
            $user->status = 'user'; // Kembalikan status menjadi 'user'
            $user->save(); // Simpan perubahan
        }
    }
}