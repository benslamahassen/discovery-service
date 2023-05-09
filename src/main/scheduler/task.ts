export class Task {
    private _nextRunTime: Date;

    constructor(
        private _cronExpression: string,
        private _execution: () => void
    ) {
        this._nextRunTime = this._calculateNextRunTime();
    }

    get nextRunTime() {
        return this._nextRunTime;
    }

    run() {
        this._execution();
        this._nextRunTime = this._calculateNextRunTime();
    }

    private _calculateNextRunTime(): Date {
        const fields = this._cronExpression.split(' ');
        if (fields.length !== 5) {
            throw new Error('Invalid cron expression');
        }

        const [minute, hour, dayOfMonth, month, dayOfWeek] = fields.map(Number);
        const now = new Date();

        const nextRun = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes()
            )
        );

        // adjust for day of the month or day of the week
        if (!isNaN(dayOfMonth) && !isNaN(dayOfWeek)) {
            throw new Error('Invalid cron expression');
        } else if (!isNaN(dayOfMonth)) {
            if (dayOfMonth < 1 || dayOfMonth > 31) {
                throw new RangeError('Day of month must be between 1 and 31.');
            }
            if (dayOfMonth < now.getUTCDate()) {
                // if the day of the month has already passed this month, move to next month
                nextRun.setUTCMonth(nextRun.getUTCMonth() + 1);
            }
            nextRun.setUTCDate(dayOfMonth);
        } else if (!isNaN(dayOfWeek)) {
            if (dayOfWeek < 0 || dayOfWeek > 6) {
                throw new RangeError('Day of week must be between 0 and 6.');
            }
            let daysUntilNextDayOfTheWeek = dayOfWeek - nextRun.getUTCDay();

            if (daysUntilNextDayOfTheWeek < 0) {
                // if the specified day of the week has already passed this week, move to next week
                daysUntilNextDayOfTheWeek += 7;
            }
            nextRun.setUTCDate(
                nextRun.getUTCDate() + daysUntilNextDayOfTheWeek
            );
        }

        // adjust for month
        if (!isNaN(month)) {
            if (month < 1 || month > 12) {
                throw new RangeError('Month must be between 1 and 12.');
            }
            if (month !== nextRun.getUTCMonth() + 1) {
                // if the specified month is not this month, move to the specified month of next year
                nextRun.setUTCFullYear(nextRun.getUTCFullYear() + 1);
                nextRun.setUTCMonth(month - 1);
            }
        }

        // adjust for hour
        if (!isNaN(hour)) {
            if (hour < 0 || hour > 23) {
                throw new RangeError('Hour must be between 0 and 23.');
            }
            if (hour !== nextRun.getUTCHours()) {
                // if the specified hour is not this hour, move to the specified hour of today
                nextRun.setUTCHours(hour);
            }
        }

        // adjust for minute
        if (!isNaN(minute)) {
            if (minute < 0 || minute > 59) {
                throw new RangeError('Minute must be between 0 and 59.');
            }
            if (minute !== nextRun.getUTCMinutes()) {
                // if the specified minute is not this minute, move to the specified minute of today
                nextRun.setUTCMinutes(minute);
            } else {
                // if the specified minute is this minute, move to the next minute
                nextRun.setUTCMinutes(nextRun.getUTCMinutes() + 1);
            }
        }

        // set seconds and milliseconds to zero
        nextRun.setUTCSeconds(0);
        nextRun.setUTCMilliseconds(0);

        // if next run time is in the past, add one minute
        if (nextRun.getTime() <= now.getTime()) {
            nextRun.setUTCMinutes(nextRun.getUTCMinutes() + 1);
        }

        return nextRun;
    }
}
