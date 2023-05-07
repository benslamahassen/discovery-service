# About 
This is a NodeJS scheduler built in TypeScript without using any third-party libraries. It has three methods: start(), stop(), and add().
It is available as a singleton. It holds all added tasks in memory. When the scheduler is started, it will run the tasks at the time specified in the cron expression. The scheduler will run the tasks in the order they were added. All time calulcation are done in UTC timezone.

## Usage
To use the scheduler, import it, inject it from gloabl scope, and add a task to it. 

```typescript
import { Scheduler } from "./scheduler";

Class MyClass {
    @dep() scheduler: Scheduler;
}
```

## Adding a Task
To add a task to be scheduled through the scheduler, use the add() method. The task should have a cron expression on how often it should run and a function called execution that contains the logic that should run when the time matches.

```typescript
scheduler.add('* * * * *', () => {
    console.log('ran at', new Date().toString());
});
```
When a task is added through the add() method, the scheduler will calculate nextRunTime of type Date(). The calculation is dependent on the cron expression. Every time the task runs, the nextRunTime gets updated. A task can run when the nextRunTime matches the current time.

The schduler checks every second, if the next run time of all tasks matches the current time. If it does, the task will run.

## Starting and Stopping the Scheduler
To start the scheduler, call the start() method:

```typescript
scheduler.start();
```

To stop the scheduler safely and avoid any memory leaks, call the stop() method:

```typescript
scheduler.stop();
```

When the scheduler starts, it creates an internal timer and saves it's reference, everytime the timer ticksthe scheduler will scan in memory jobs and their nex run time. Calling scheduler.stop() will stop the timer and clear the memory.


## Cron Expression Format
The cron expression format used in this scheduler follows the standard Unix cron syntax with a few exceptions ( see Future Improvments). The format is as follows:

```scss
* * * * *
| | | | |
| | | | day of the week (0 - 6) (Sunday to Saturday)
| | | month (1 - 12)
| | day of the month (1 - 31)
| hour (0 - 23)
minute (0 - 59)
```

Each field can contain a wildcard (*) to indicate that the cron expression should match any value for that field. For example, * * * * * would match every second.



## Future Improvements

This scheduler can be improved in a number of ways. First we need to solve the current limitations:

- You can not set the seconds field. It only supports 5 fields as the format above.
- You can not use the step syntax. For example, */2 * * * * would not work.
- You can not use the range syntax. For example, 1-5 * * * * would not work.
- You can not use the list syntax. For example, 1,2,3 * * * * would not work.

Also we can implement a few ideas:

- Add support for multiple tasks with the same cron expression.
- Add support for date ranges and exclusion dates.
- Add support for one time run Taks.
