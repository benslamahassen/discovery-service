# About
The instances cleanup feature is a useful feature in the application that deletes instances that have exceeded a certain age. This feature can be enabled by setting the CLEANUP environment variable to true.

# Design
The cleanup script runs as a cron job based on the `CLEANUP_INTERVAL_CRON` environment variable. When the job runs, it checks the instances with a last heartbeat timestamp that is less than `Date.now() - CLEANUP_INSTANCE_AGE_IN_HOURS`, which is another environment variable. The instances that meet this criteria are deleted by the Cleanup class using the InstanceRepository. Information about the cleanup process is logged using a Logger.

# Methods:
- start(): adds the cleanup task to the scheduler and logs information about the cleanup process
- cleanup(): retrieves instances that have exceeded the specified age, deletes them using the instance repository, and logs information about the cleanup process

# Fields:
- CLEANUP_INSTANCE_AGE_IN_HOURS: a configuration field that specifies the maximum age of instances to be cleaned up
- CLEANUP_INTERVAL_CRON: a configuration field that specifies the interval at which the cleanup task should be run
- instanceRepository: an instance of the InstanceRepository class used to retrieve and delete instances
- scheduler: an instance of the Scheduler class used to schedule the cleanup task
- logger: an instance of the Logger class used to log information about the cleanup process