package com.sumit.QuizService.Service;

import com.sumit.QuizService.Dao.QuizDao;
import com.sumit.QuizService.Model.QuestionWrapper;
import com.sumit.QuizService.Model.Quiz;
import com.sumit.QuizService.Model.Response;
import com.sumit.QuizService.feign.QuizInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    QuizDao quizDao;

    @Autowired
    QuizInterface quizInterface;

    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {
        ResponseEntity<List<Integer>> responseEntity = quizInterface.getQuestionsForQuiz(category, numQ);
        List<Integer> questions = (responseEntity != null && responseEntity.getBody() != null) 
            ? responseEntity.getBody() 
            : new ArrayList<>();

        Quiz quiz = new Quiz();
        quiz.setTitle(title != null ? title : "Generated Quiz");
        quiz.setQuestionIds(questions);
        Quiz savedQuiz = quizDao.save(quiz);

        return new ResponseEntity<>("Quiz Created Successfully with ID: " + savedQuiz.getId(), HttpStatus.CREATED);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        Optional<Quiz> quizOpt = quizDao.findById(id);
        if (quizOpt.isEmpty()) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
        }
        Quiz quiz = quizOpt.get();
        List<Integer> questionIds = quiz.getQuestionIds();
        if (questionIds == null || questionIds.isEmpty()) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
        return quizInterface.getQuestionsFromId(questionIds);
    }

    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {
        if (responses == null) {
            return new ResponseEntity<>(0, HttpStatus.OK);
        }
        return quizInterface.getScore(responses);
    }
}