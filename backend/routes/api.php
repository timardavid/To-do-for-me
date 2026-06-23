<?php

use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/tasks/due-reminders', [TaskController::class, 'dueReminders']);
Route::patch('/tasks/{task}/complete', [TaskController::class, 'complete']);
Route::apiResource('tasks', TaskController::class)->except(['show']);
