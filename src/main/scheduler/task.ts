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
        const currentTime = new Date();
        const cronParts = this._cronExpression.split(' ');

        // extract cron values
        const minute = cronParts[0];
        const hour = cronParts[1];
        const dayOfMonth = cronParts[2];
        const month = cronParts[3];

        // calculate next run time
        const nextRunTime = new Date();
        nextRunTime.setUTCMinutes(
            minute === '*' ? currentTime.getUTCMinutes() + 1 : parseInt(minute)
        );
        nextRunTime.setUTCHours(
            hour === '*' ? currentTime.getUTCHours() : parseInt(hour)
        );
        nextRunTime.setUTCDate(
            dayOfMonth === '*' ? currentTime.getUTCDate() : parseInt(dayOfMonth)
        );
        nextRunTime.setUTCMonth(
            month === '*' ? currentTime.getUTCMonth() : parseInt(month) - 1
        );

        if (nextRunTime.getTime() <= currentTime.getTime()) {
            nextRunTime.setUTCFullYear(currentTime.getUTCFullYear());
            nextRunTime.setUTCMinutes(nextRunTime.getUTCMinutes() + 1);
        }
        nextRunTime.setUTCSeconds(0);
        nextRunTime.setUTCMilliseconds(0);
        return nextRunTime;
    }
}
