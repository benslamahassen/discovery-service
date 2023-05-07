# Structure

The project follows a typical node-framework application structure. Here's an overview of each directory and its contents.


```scss
src/
|── test/
│   ├── spec/
│   │   ├── cleanup.test.ts
│   │   └── scheduler.test.ts
│   ├── integration
│   │   ├── scheduler/
│   │   │   ├── add.test.ts
│   │   │   └── start.test.ts
│   │   └── services/
│   │       └── cleanup.test.ts
│   └── dotenv.ts
|── bin/
│   └── serve.ts
├── routes/
│   ├── health.ts
│   └── instance.ts
├── scheduler/
│   ├── task.ts
│   └── scheduler.ts
├── repositories/
│   └── instance.ts
├── routes/
│   ├── health.ts
│   └── instance.ts
├── services/
│   └── cleanup.ts
└── app.ts
```

- routes/: Contains routers that handle requests for different resources and define the API endpoints.
- schema/: Contains schemas that define the format of data stored in the database and returned used through the app.
- repositories/: Contains repository classes that handle data access and manipulation for the resources.
- services/: Contains service classes that handle business logic such us deleting old instances without a heartbeat.
- test/: Contains unit and integration tests. Not all tests are covered but some are to showcase how would someone test the application.
- app.ts: Initializes the application and sets up golabl scope dependencies as well as requests scoped dependencies.
- serve.ts: Starts the application.
