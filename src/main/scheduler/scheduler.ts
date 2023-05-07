import { Task } from './task.js';

export class Scheduler {
    private _tasks: Task[] = [];
    private _timeoutRef: NodeJS.Timeout | null = null;

    add(cronExpression: string, execution: () => void) {
        const task = new Task(cronExpression, execution);
        this._tasks.push(task);
    }

    start() {
        if (!this._timeoutRef) {
            this._timeoutRef = setInterval(() => {
                const currentTime = new Date();
                for (const task of this._tasks) {
                    if (task.nextRunTime <= currentTime) {
                        task.run();
                    }
                }
            }, 1000);
        }
    }

    stop() {
        if (this._timeoutRef) {
            clearInterval(this._timeoutRef);
            this._timeoutRef = null;
            this._tasks = [];
        }
    }
}
