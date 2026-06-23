<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    private const PRIORITIES = ['high', 'medium', 'low'];

    private const CATEGORIES = ['Általános', 'Munka', 'Személyes', 'Üzlet', 'Egészség', 'Pénzügy'];

    private const REMINDER_MINUTES = [0, 10, 30, 60, 1440];

    public function index(Request $request)
    {
        $view = $request->query('view', 'all');
        $search = trim((string) $request->query('search', ''));

        $query = match ($view) {
            'today' => Task::query()->active()->dueToday(),
            'upcoming' => Task::query()->active()->upcoming(),
            'overdue' => Task::query()->active()->overdue(),
            'done' => Task::query()->done(),
            default => Task::query()->active(),
        };

        $query->search($search);

        $tasks = $view === 'done'
            ? $query->orderByDesc('done_at')->get()
            : $query->orderByRaw('due_date IS NULL, due_date ASC')->get();

        return response()->json([
            'tasks' => $tasks,
            'counts' => $this->counts(),
        ]);
    }

    public function store(Request $request)
    {
        $task = Task::create($this->validated($request));

        return response()->json(['task' => $task], 201);
    }

    public function update(Request $request, Task $task)
    {
        $data = $this->validated($request);
        $data['reminded'] = false;
        $task->update($data);

        return response()->json(['task' => $task]);
    }

    public function complete(Task $task)
    {
        $task->update(['done' => true, 'done_at' => Carbon::now()]);

        return response()->json(['task' => $task]);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * Tasks whose reminder time has just been reached. Marks them as
     * reminded in the same call so repeated polling does not re-fire them.
     */
    public function dueReminders()
    {
        $tasks = Task::query()
            ->reminderCandidates()
            ->where('reminded', false)
            ->get()
            ->filter(fn (Task $task) => $task->isReminderDue());

        if ($tasks->isNotEmpty()) {
            Task::query()->whereIn('id', $tasks->pluck('id'))->update(['reminded' => true]);
        }

        return response()->json(['tasks' => $tasks->values()]);
    }

    private function counts(): array
    {
        return [
            'all' => Task::query()->active()->count(),
            'today' => Task::query()->active()->dueToday()->count(),
            'upcoming' => Task::query()->active()->upcoming()->count(),
            'overdue' => Task::query()->active()->overdue()->count(),
            'done' => Task::query()->done()->count(),
            'done_today' => Task::query()->done()->whereDate('done_at', Carbon::today())->count(),
        ];
    }

    private function validated(Request $request): array
    {
        $request->merge([
            'due_date' => $request->input('due_date') ?: null,
            'description' => $request->input('description') ?: '',
        ]);

        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date_format:Y-m-d H:i'],
            'priority' => ['required', Rule::in(self::PRIORITIES)],
            'category' => ['required', Rule::in(self::CATEGORIES)],
            'remind_minutes' => ['required', 'integer', Rule::in(self::REMINDER_MINUTES)],
        ]);
    }
}
