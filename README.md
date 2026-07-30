# 🎯 Quiz Generator Microservices

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2025.1.2-blue.svg)](https://spring.io/projects/spring-cloud)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1.svg)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A robust, enterprise-grade **Quiz Generator Microservices System** built with **Java 21**, **Spring Boot**, **Spring Cloud (Eureka Service Discovery, API Gateway, OpenFeign)**, and **MySQL**. 

This system breaks down quiz creation and question management into scalable, decoupled microservices connected via Netflix Eureka Service Registry and unified under a Spring Cloud API Gateway.

---

## 📐 Architecture Overview

```
                      +-------------------+
                      |   Client / UI     |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |   API Gateway     |  (Port: 8787)
                      +----+---------+----+
                           |         |
          +----------------+         +----------------+
          |                                           |
          v                                           v
+-------------------+                       +-------------------+
|  QuestionService  | <--- (OpenFeign) ---- |    QuizService    |  (Port: 8090)
+---------+---------+ (Port: 8082)          +---------+---------+
          |                                           |
          v                                           v
   [MySQL QuestionDB]                          [MySQL QuizDB]
   
   ============================================================
              | Registers With Service Discovery |
              v                                  v
                   +------------------------+
                   |    Service Registry    |  (Port: 8761)
                   |    (Eureka Server)     |
                   +------------------------+
```

---

## 🛠️ Tech Stack & Technologies

- **Programming Language:** Java 21
- **Framework:** Spring Boot 4.1.0 / 3.5.4
- **Microservice Ecosystem (Spring Cloud 2025):**
  - **Service Discovery:** Spring Cloud Netflix Eureka Server / Client
  - **API Gateway:** Spring Cloud Gateway
  - **Inter-Service Communication:** Declarative REST Client with Spring Cloud OpenFeign
- **Persistence & Database:** Spring Data JPA (Hibernate), MySQL 8.0+
- **Build Tool:** Apache Maven
- **Utilities:** Lombok

---

## 📂 Microservices Summary

| Microservice | Port | Description | Database |
| :--- | :---: | :--- | :--- |
| **Service-Registry** | `8761` | Eureka Service Discovery Server where all microservices register dynamically. | N/A |
| **Api-Gateway** | `8787` | Central routing gateway handling incoming HTTP traffic to downstream services. | N/A |
| **QuestionService** | Dynamic / `8082` | Manages the Question Bank (CRUD), categorization, difficulty levels, and score calculation. | `microservices_questiondb` |
| **QuizService** | `8090` | Handles quiz generation, aggregates questions via OpenFeign from QuestionService, and evaluates scores. | `microservices_quizdb` |

---

## 🗄️ Database Setup

Before running the application, ensure MySQL server is running and execute the following SQL commands to create the required databases:

```sql
CREATE DATABASE IF NOT EXISTS microservices_questiondb;
CREATE DATABASE IF NOT EXISTS microservices_quizdb;
```

> **Note:** Update database credentials (`spring.datasource.username` and `spring.datasource.password`) in `QuestionService/src/main/resources/application.properties` and `QuizService/src/main/resources/application.properties` if your local MySQL configuration differs.

---

## 🚀 How to Run locally

Follow the specific startup order to ensure microservices register properly with the Eureka discovery server.

### 1. Build All Microservices

Run the Maven package command in each service directory (or build via your IDE):

```bash
# Clean and build each service
mvn clean package -DskipTests
```

### 2. Start Services in Order

#### Step 1: Start Service Registry (Eureka Server)
```bash
cd Service-Registry
mvn spring-boot:run
```
> Eureka Dashboard will be accessible at: `http://localhost:8761`

#### Step 2: Start Question Service
```bash
cd QuestionService
mvn spring-boot:run
```

#### Step 3: Start Quiz Service
```bash
cd QuizService
mvn spring-boot:run
```

#### Step 4: Start API Gateway
```bash
cd Api-Gateway
mvn spring-boot:run
```

---

## 🔌 API Endpoint Documentation

All requests can be routed through the **API Gateway** (`http://localhost:8787`) or called directly on individual service ports.

### 1. Question Service Endpoints (`http://localhost:8787/question` or `http://localhost:8082/question`)

#### Get All Questions
- **GET** `/question/allQuestions`
- **Response:** `200 OK` (List of questions)

#### Get Questions by Category
- **GET** `/question/category/{category}`
- **Example:** `/question/category/Java`

#### Add Single Question
- **POST** `/question/add`
- **Body:**
```json
{
  "questionTitle": "What is JVM?",
  "option1": "Java Virtual Machine",
  "option2": "Java Variable Method",
  "option3": "Joint Virtual Memory",
  "option4": "None of the above",
  "rightAnswer": "Java Virtual Machine",
  "difficultylevel": "Easy",
  "category": "Java"
}
```

#### Add Multiple Questions (Bulk Add)
- **POST** `/question/adds`
- **Body:** `[ { ... }, { ... } ]`

#### Generate Question IDs for Quiz (Internal / Feign)
- **GET** `/question/generate?categoryName=Java&numQuestions=5`

#### Fetch Questions by IDs (Internal / Feign)
- **POST** `/question/getQuestions`
- **Body:** `[1, 2, 3]`

#### Calculate Score (Internal / Feign)
- **POST** `/question/getScore`
- **Body:**
```json
[
  { "id": 1, "response": "Java Virtual Machine" }
]
```

---

### 2. Quiz Service Endpoints (`http://localhost:8787/quiz` or `http://localhost:8090/quiz`)

#### Create Quiz
- **POST** `/quiz/create`
- **Body:**
```json
{
  "categoryName": "Java",
  "numQuestions": 5,
  "title": "Java Fundamentals Quiz"
}
```
- **Response:** `201 Created` - `"Success"`

#### Get Quiz Questions for User
- **POST** `/quiz/get/{id}`
- **Example:** `/quiz/get/1`
- **Response:** Returns list of `QuestionWrapper` (without revealing correct answers).

#### Submit Quiz & Get Score
- **POST** `/quiz/submit/{id}`
- **Example:** `/quiz/submit/1`
- **Body:**
```json
[
  { "id": 1, "response": "Java Virtual Machine" },
  { "id": 2, "response": "Object Oriented" }
]
```
- **Response:** `200 OK` (Returns integer score, e.g., `2`)

---

## 🐙 Pushing to GitHub

If you haven't initialized Git yet, follow these commands from the root directory (`QuizGenerator_Microservices`):

```bash
# 1. Initialize Git Repository
git init

# 2. Add files to staging (respecting .gitignore)
git add .

# 3. Commit changes
git commit -m "Initial commit: Quiz Generator Microservices with Spring Boot, Eureka & Gateway"

# 4. Set main branch name
git branch -M main

# 5. Add remote GitHub repository (Replace URL with your repository link)
git remote add origin https://github.com/YOUR_USERNAME/QuizGenerator_Microservices.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
