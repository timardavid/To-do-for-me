<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'due_date',
        'priority',
        'category',
        'remind_minutes',
        'done',
        'done_at',
        'reminded',
        'emailed',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'done_at' => 'datetime',
        'done' => 'boolean',
        'reminded' => 'boolean',
        'emailed' => 'boolean',
        'remind_minutes' => 'integer',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('done', false);
    }

    public function scopeDone(Builder $query): Builder
    {
        return $query->where('done', true);
    }

    public function scopeDueToday(Builder $query): Builder
    {
        return $query->whereDate('due_date', Carbon::today());
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->whereNotNull('due_date')->where('due_date', '<', Carbon::now());
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->whereNotNull('due_date')
            ->whereBetween('due_date', [Carbon::now(), Carbon::now()->addDays(7)]);
    }

    /**
     * Active tasks with a reminder configured and a due date — candidates
     * that still need precise "due_date - remind_minutes <= now" filtering
     * in PHP since that comparison isn't a plain column expression.
     */
    public function scopeReminderCandidates(Builder $query): Builder
    {
        return $query->active()->where('remind_minutes', '>', 0)->whereNotNull('due_date');
    }

    public function isReminderDue(): bool
    {
        return $this->due_date !== null
            && $this->due_date->copy()->subMinutes($this->remind_minutes)->lte(Carbon::now());
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%");
        });
    }
}
