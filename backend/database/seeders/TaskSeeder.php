<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Task::count() > 0) {
            return;
        }

        $now = Carbon::now();

        Task::create([
            'title' => 'Közüzemi számla befizetése',
            'description' => 'Áram és gáz számla határidőre befizetve.',
            'due_date' => $now->copy()->addDay()->format('Y-m-d H:i:00'),
            'priority' => 'high',
            'category' => 'Pénzügy',
            'remind_minutes' => 60,
        ]);

        Task::create([
            'title' => 'Aranytölcsér Instagram poszt',
            'description' => 'Heti tartalom közzététele a céges Instagram oldalon.',
            'due_date' => $now->copy()->addDays(2)->format('Y-m-d H:i:00'),
            'priority' => 'medium',
            'category' => 'Üzlet',
            'remind_minutes' => 60,
        ]);

        Task::create([
            'title' => 'Slotly onboarding flow tesztelése',
            'description' => 'Végigfuttatni az új felhasználói onboarding folyamatot és hibákat jegyzőkönyvezni.',
            'due_date' => $now->copy()->addHours(2)->format('Y-m-d H:i:00'),
            'priority' => 'high',
            'category' => 'Munka',
            'remind_minutes' => 60,
        ]);
    }
}
