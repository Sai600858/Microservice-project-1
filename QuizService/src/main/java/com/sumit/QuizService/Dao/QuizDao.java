package com.sumit.QuizService.Dao;

import com.sumit.QuizService.Model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizDao extends JpaRepository<Quiz,Integer> {
}
