package com.sumit.QuestionService.Dao;

import com.sumit.QuestionService.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionDao extends JpaRepository<Question, Integer> {

    List<Question> findByCategory(String category);

    @Query(value = """
        SELECT q.id
        FROM question q
        WHERE (:category IS NULL OR :category = '' OR LOWER(q.category) = LOWER(:category) OR LOWER(q.category) LIKE CONCAT('%', LOWER(:category), '%'))
        ORDER BY RAND()
        LIMIT :numQ
        """, nativeQuery = true)
    List<Integer> findRandomQuestionsByCategory(@Param("category") String category, @Param("numQ") int numQ);

    @Query(value = """
        SELECT q.id
        FROM question q
        ORDER BY RAND()
        LIMIT :numQ
        """, nativeQuery = true)
    List<Integer> findRandomQuestionsAny(@Param("numQ") int numQ);
}
