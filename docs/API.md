# service-descovery (0.0.1)
a RESTful discovery service, that keeps track of periodically received heartbeats from clients


## GET /metrics
(internal) Get current process metrics


### Responses
#### Status: 200
Prometheus metrics in text-based format
- contentType: text/plain
- body: {}


## GET /health



### Responses
#### Status: 200
- contentType: application/json
- body: object
  - status: string


## POST /{group}/{id}



### Body Params
- meta: object (optional)
- id: string
  - format: uuid
- group: string


### Responses
#### Status: 200
- contentType: application/json
- body: object
  - id: string
    - format: uuid
  - group: string
  - meta: object(optional)
    - ip: string(optional)
      - optional: true
      - nullable: true
    - region: string(optional)
      - optional: true
      - nullable: true
  - createdAt: string
    - format: date-time
  - updatedAt: string
    - format: date-time


## DELETE /{group}/{id}



### Body Params
- id: string
  - format: uuid
- group: string


### Responses
#### Status: 200
- contentType: application/json
- body: {}


## GET /



### Responses
#### Status: 200
- contentType: application/json
- body: array
  - items: object
    - group: string
    - instances: number
    - createdAt: string
      - format: date-time
    - lastUpdatedAt: string
      - format: date-time


## GET /{group}



### Body Params
- group: string


### Responses
#### Status: 200
- contentType: application/json
- body: array
  - items: object
    - id: string
      - format: uuid
    - group: string
    - meta: object(optional)
      - ip: string(optional)
        - optional: true
        - nullable: true
      - region: string(optional)
        - optional: true
        - nullable: true
    - createdAt: string
      - format: date-time
    - updatedAt: string
      - format: date-time