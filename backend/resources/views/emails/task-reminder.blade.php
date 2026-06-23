<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="utf-8">
</head>
<body style="margin:0; padding:0; background:#f5f5f7; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7; padding:32px 0;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden;">
                    <tr>
                        <td style="background:#0071e3; padding:24px 32px;">
                            <span style="color:#ffffff; font-size:20px; font-weight:600;">⏰ Emlékeztető</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 8px; font-size:20px; font-weight:600; color:#1d1d1f;">
                                {{ $task->title }}
                            </p>
                            @if ($task->description)
                                <p style="margin:0 0 20px; font-size:15px; color:#6e6e73; line-height:1.5;">
                                    {{ $task->description }}
                                </p>
                            @endif
                            <table cellpadding="0" cellspacing="0" style="margin-top:8px;">
                                <tr>
                                    <td style="padding:4px 0; font-size:14px; color:#6e6e73;">Határidő:</td>
                                    <td style="padding:4px 0 4px 12px; font-size:14px; color:#1d1d1f; font-weight:500;">
                                        {{ $task->due_date?->format('Y-m-d H:i') }}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:4px 0; font-size:14px; color:#6e6e73;">Kategória:</td>
                                    <td style="padding:4px 0 4px 12px; font-size:14px; color:#1d1d1f; font-weight:500;">
                                        {{ $task->category }}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:4px 0; font-size:14px; color:#6e6e73;">Prioritás:</td>
                                    <td style="padding:4px 0 4px 12px; font-size:14px; color:#1d1d1f; font-weight:500;">
                                        {{ ['high' => 'Magas', 'medium' => 'Közepes', 'low' => 'Alacsony'][$task->priority] ?? $task->priority }}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 32px 28px;">
                            <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}"
                               style="display:inline-block; background:#0071e3; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:10px 20px; border-radius:8px;">
                                Megnyitás
                            </a>
                        </td>
                    </tr>
                </table>
                <p style="font-size:12px; color:#a1a1a6; margin-top:16px;">Ne felejtsd el — személyes teendőlista</p>
            </td>
        </tr>
    </table>
</body>
</html>
