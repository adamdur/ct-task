# Cloudtalk Task Documentation

## Overview

The Cloudtalk task is a microservices architecture designed to manage product reviews. It consists of two main services (`api-service` and `rating-service`) and a shared library (`ct-common-lib`), all interacting within a Node.js and TypeScript environment. The system leverages PostgreSQL for data persistence, RabbitMQ for messaging and event-driven updates, and Redis for caching.

## Components

### 1. api-service

The `api-service` is a RESTful service responsible for direct product and review management. It offers a suite of endpoints to create, retrieve, update, and delete products and reviews. It also interacts with RabbitMQ to publish events related to review updates, and subscribes to events for updating ratings.

#### Endpoints

- **Products:**
    - `POST /api/products`: Create a product.
    - `GET /api/products`: Retrieve all products.
    - `GET /api/products/:id`: Retrieve a product by ID.
    - `PUT /api/products/:id`: Update a product.
    - `DELETE /api/products/:id`: Delete a product.
    - `GET /api/products/:id/reviews`: Retrieve all reviews for a specific product.

- **Reviews:**
    - `POST /api/reviews`: Create a review and publish a `review-created` event to RabbitMQ.
    - `PUT /api/reviews/:id`: Update a review and publish a `review-updated` event to RabbitMQ.
    - `DELETE /api/reviews/:id`: Delete a review and publish a `review-deleted` event to RabbitMQ.

#### Messaging
- Consumes the `rating-updated` event from RabbitMQ, updating the internal state accordingly.

### 2. rating-service

The `rating-service` is dedicated to calculating the average rating of products based on review updates. It listens for review-related events from the `api-service` and publishes results after processing.

#### Consumers

- **Review Events:**
    - Listens for `review-created`, `review-updated`, and `review-deleted` events.
    - Calculates the average product rating and publishes a `rating-updated` event to RabbitMQ after each successful calculation.

### 3. ct-common-lib

A shared library utilized by both services, published to npm. It provides common utilities and functionalities to enhance code reusability and maintainability across services.

## Technologies Used

### Node.js and TypeScript
Both services are developed using Node.js and TypeScript, offering a scalable and efficient backend solution with strong typing benefits.

### PostgreSQL with Sequelize ORM
PostgreSQL serves as the primary database, with Sequelize ORM facilitating database interactions. The ORM provides a robust framework for modeling and managing database schemas.

### Redis Caching
Redis is used for caching data, significantly improving response times and reducing database load. The caching logic is encapsulated in the sequelize repositories with `withCache` function, ensuring data consistency and efficiency:

### RabbitMQ for Messaging
RabbitMQ facilitates a publisher-subscriber model between the services, allowing asynchronous processing of review ratings and decoupling service dependencies.

## Why These Technologies?
- **PostgreSQL**: Chosen for its robustness, reliability, and strong support for complex queries.
- **Redis**: Provides an extremely fast, in-memory data store to speed up data retrieval operations.
- **RabbitMQ**: Handles message queuing effectively, ensuring reliable communication between services without direct coupling.

## Conclusion
The Cloudtalk task is designed to efficiently manage product reviews through a scalable microservices architecture. It integrates modern technologies to ensure high performance, reliability, and maintainability.
