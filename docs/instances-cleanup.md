Main functionalities:
The Cleanup class is responsible for cleaning up instances that have exceeded a certain age. It uses a Scheduler to run the cleanup task at a specified interval, and an InstanceRepository to retrieve and delete instances. The class also logs information about the cleanup process using a Logger.

Methods:
- start(): adds the cleanup task to the scheduler and logs information about the cleanup process
- cleanup(): retrieves instances that have exceeded the specified age, deletes them using the instance repository, and logs information about the cleanup process

Fields:
- CLEANUP_INSTANCE_AGE_IN_HOURS: a configuration field that specifies the maximum age of instances to be cleaned up
- CLEANUP_INTERVAL_CRON: a configuration field that specifies the interval at which the cleanup task should be run
- instanceRepository: an instance of the InstanceRepository class used to retrieve and delete instances
- scheduler: an instance of the Scheduler class used to schedule the cleanup task
- logger: an instance of the Logger class used to log information about the cleanup process