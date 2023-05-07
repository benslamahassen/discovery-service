# About

This is a RESTful Discovery Service that keeps track of different client applications by receiving periodic heartbeats. The service registers the applications and periodically removes those that did not send any heartbeats within a specified time frame ( configuarbale with env variables ). This service can be used to discover applications and get information about them, such as their group, instance ID, creation time, and metadata.

Checkout [structure docs](./docs/structure.md) for more information about the project structure.



# Running the service
Make sure Docker is up and runnning. Then run the following commands:
```bash
cp .env.example .env.local
docker-compose up
```



# Endpoints

## `GET /` - Get all registered instances
This endpoint returns a JSON array containing a summary of all currently registered groups, which includes the group name, the number of registered instances in the group, the first heartbeat registered in the group, and the last heartbeat registered in the group. Groups containing zero instances are not returned.

```json
{
	"type": "array",
	"count": 1,
	"data": [
		{
			"instances": 3,
			"createdAt": "2023-05-07T19:31:02.847Z",
			"lastUpdatedAt": "2023-05-07T19:32:12.845Z",
			"group": "super-group"
		}
	]
}
```
## `POST /:group/:id` - Register an instance
This endpoint registers an application instance in the specified group. The id is a unique identifier of the application instance generated by the client. If the instance is already registered, the updatedAt timestamp will be updated. The request body can specify metadata that will be attached to the instance. The endpoint returns a JSON object with the following structure:

```json
{
	"type": "instance",
	"data": {
		"createdAt": "2023-05-07T19:31:50.345Z",
		"updatedAt": "2023-05-07T19:32:12.845Z",
		"group": "super-group",
		"id": "e335165a-efce-4a74-b99c-c6466b6afadd",
		"meta": {
			"ip": "123.123.123.123",
			"region": "eu-west-1"
		}
	}
}
```
## `DELETE /:group/:id` - Unregister an instance

This endpoint unregisters an application instance.

## `GET /:group` - Get instances by a group
This endpoint returns a JSON array describing instances of the group, which includes the instance ID, the group name, the creation time, the update time, and metadata.

```json
{
	"type": "array",
	"count": 3,
	"data": [
		{
			"createdAt": "2023-05-07T19:31:02.847Z",
			"updatedAt": "2023-05-07T19:31:02.847Z",
			"group": "super-group",
			"id": "e335175a-eace-4a74-b99c-c6466b6afadd",
			"meta": {
				"ip": "123.123.123.123",
				"region": "eu-west-1"
			}
		},
		//...
	]
}
```



# Expiration

The service periodically removes expired instances. The age of the most recent heartbeat of an instance to be considered expired is configurable with an environment variable. The rate the service checks for expired instances is also configurable with an environment variable. The default values are 1 hour for the age and every minute for the rate ( as a cron expression ). The service uses a scheduler to periodically check for expired instances. The scheduler is initialized when the service starts and is stopped when the service stops. The scheduler logic is implemented in the [scheduler](./src/main/scheduler) module. It is used by the [cleanup](./src/main/service/cleanup.ts) module.

Please have a look at [scheduler docs](./docs/scheduler.md) and [cleanup process docs](./docs/cleanup.md) for more information.



# Usefull definitions

### Instance
- An instance is a single running copy of an application. In the context of this service, an instance represents a client application that periodically sends heartbeats to the discovery service.

### Heartbeat
- A heartbeat is a periodic message sent by a client application to the discovery service to indicate that it is still running and available. The heartbeat typically contains information such as the instance ID, group, and an optional associated metadata of ip and region.

### Expired Service
- An expired service is a service instance that has not sent a heartbeat to the discovery service within a configurable time frame. The service considers instances that have not sent a heartbeat in the specified time frame as expired, and periodically removes them from the registry.

### Group
- A group is a logical grouping of instances of a service. For example, a group could represent all instances of a service running in a particular region, environment or business group. The discovery service keeps track of the number of registered instances in each group.

### Metadata
- Metadata refers to additional information about a service instance, such as IP address and region that the client application may want to attach to its heartbeat messages. The discovery service stores this metadata and returns it along with other information about the service instance.