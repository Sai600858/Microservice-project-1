# 🎯 Quiz Generator Microservices

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2025.1.2-blue.svg)](https://spring.io/projects/spring-cloud)
[![React Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blueviolet.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1.svg)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A robust, enterprise-grade **Quiz Generator Microservices System** built with **Java 21**, **Spring Boot**, **Spring Cloud (Eureka Service Discovery, API Gateway, OpenFeign)**, **MySQL**, and a modern **React + Vite Dark Mode UI**. 

This system breaks down quiz creation and question management into scalable, decoupled microservices connected via Netflix Eureka Service Registry and unified under a Spring Cloud API Gateway.

---

## 📐 Architecture Overview

```
                      +-------------------+
                      |   React Web UI    |  (Port: 5173)
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

- **Frontend:** React 19, Vite, Lucide Icons, Canvas Confetti, Custom Glassmorphism Dark Mode CSS
- **Backend Language:** Java 21
- **Framework:** Spring Boot 4.1.0 / 3.5.4
- **Microservice Ecosystem (Spring Cloud 2025):**
  - **Service Discovery:** Spring Cloud Netflix Eureka Server / Client
  - **API Gateway:** Spring Cloud Gateway
  - **Inter-Service Communication:** Declarative REST Client with Spring Cloud OpenFeign
- **Persistence & Database:** Spring Data JPA (Hibernate), MySQL 8.0+
- **Build Tools:** Apache Maven & Node / npm

---

## 📂 Microservices & Frontend Summary

| Component | Port / Location | Description | Tech / Database |
| :--- | :---: | :--- | :--- |
| **Frontend UI** | `http://localhost:5173` | Interactive Quiz Dashboard, Quiz Player, Question Bank, & Microservices Status inspector. | React 19, Vite |
| **Service-Registry** | `8761` | Eureka Service Discovery Server where all microservices register dynamically. | Spring Cloud Eureka |
| **Api-Gateway** | `8787` | Central routing gateway handling incoming HTTP traffic to downstream services. | Spring Cloud Gateway |
| **QuestionService** | Dynamic / `8082` | Manages the Question Bank (CRUD), categorization, difficulty levels, and score calculation. | MySQL `microservices_questiondb` |
| **QuizService** | `8090` | Handles quiz generation, aggregates questions via OpenFeign from QuestionService, and evaluates scores. | MySQL `microservices_quizdb` |

---

## 💻 Frontend Features

- **📊 Interactive Dashboard:** Overview of total questions, categories, and microservice status.
- **⚡ Quick Quiz Generator:** Create & launch quizzes dynamically by specifying category and question counts.
- **📝 Interactive Quiz Player:** Smooth stepper interface, progress bars, selectable options, and automated scoring.
- **🎉 Animated Scorecard:** Performance gauge with score breakdown and victory confetti animations.
- **📚 Question Bank Management:** Search, category filters (Java, Python, etc.), difficulty filters (Easy, Medium, Hard), and Add Question modal.
- **⚙️ Microservices Topology Inspector:** Real-time health monitoring of Gateway, Eureka, QuestionService, and QuizService with a built-in Demo Mode toggle.

---

## 🗄️ Database Setup

Before running the application, ensure MySQL server is running and execute the following SQL commands to create the required databases:

```sql
CREATE DATABASE IF NOT EXISTS microservices_questiondb;
CREATE DATABASE IF NOT EXISTS microservices_quizdb;
```

---

## 🚀 How to Run locally

### 1. Run the Frontend Web Application

```bash
cd frontend
npm install
npm run dev
```
> Open your browser at `http://localhost:5173`

### 2. Build & Start Backend Microservices

Start services in this order:

#### Step 1: Start Service Registry (Eureka Server)
```bash
cd Service-Registry
mvn spring-boot:run
```
> Eureka Dashboard: `http://localhost:8761`

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

All requests are routed through the **API Gateway** (`http://localhost:8787`).

### 1. Question Service Endpoints (`http://localhost:8787/question`)

- **GET** `/question/allQuestions` - Fetch all questions
- **GET** `/question/category/{category}` - Fetch questions by category
- **POST** `/question/add` - Add new question
- **POST** `/question/adds` - Bulk add questions
- **GET** `/question/generate?categoryName=Java&numQuestions=5` - Generate question IDs
- **POST** `/question/getQuestions` - Fetch question wrappers by IDs
- **POST** `/question/getScore` - Calculate quiz score

### 2. Quiz Service Endpoints (`http://localhost:8787/quiz`)

- **POST** `/quiz/create` - Create new quiz
- **POST** `/quiz/get/{id}` - Get quiz question wrappers for user
- **POST** `/quiz/submit/{id}` - Submit quiz responses & return score

---

## 🐙 Pushing to GitHub

```bash
git add .
git commit -m "Add React Vite microservices frontend and complete platform UI"
git push -u origin main
```

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
