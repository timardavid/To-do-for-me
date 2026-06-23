<?php

namespace App\Console\Commands;

use App\Mail\TaskReminderMail;
use App\Models\Task;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

#[Signature('app:send-due-reminder-emails')]
#[Description('Sends an email for every task whose reminder time has just been reached')]
class SendDueReminderEmails extends Command
{
    public function handle(): void
    {
        $to = config('mail.reminder_to');

        if (! $to) {
            $this->error('REMINDER_EMAIL nincs beállítva a .env-ben, kihagyva.');

            return;
        }

        $tasks = Task::query()
            ->reminderCandidates()
            ->where('emailed', false)
            ->get()
            ->filter(fn (Task $task) => $task->isReminderDue());

        if ($tasks->isEmpty()) {
            $this->info('Nincs küldendő emlékeztető.');

            return;
        }

        foreach ($tasks as $task) {
            try {
                Mail::to($to)->send(new TaskReminderMail($task));
                $task->update(['emailed' => true]);
                $this->info("Elküldve: {$task->title}");
            } catch (\Throwable $e) {
                $this->error("Sikertelen küldés ({$task->title}): {$e->getMessage()}");
            }
        }
    }
}
