package com.sumit.QuestionService.Service;

import com.sumit.QuestionService.Dao.QuestionDao;
import com.sumit.QuestionService.Model.Question;
import com.sumit.QuestionService.Model.QuestionWrapper;
import com.sumit.QuestionService.Model.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    QuestionDao questionDao;

    public ResponseEntity<List<Question>> getAllQuestions() {
        try {
            return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<List<Question>> getQuestionsByCategory(String category) {
        try {
            return new ResponseEntity<>(questionDao.findByCategory(category), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> addQuestion(Question question) {
        questionDao.save(question);
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

    public ResponseEntity<List<Integer>> getQuestionsForQuiz(String categoryName, Integer numQuestions) {
        List<Integer> questions = questionDao.findRandomQuestionsByCategory(categoryName, numQuestions);
        // Fallback to random questions across all categories if specific category has no match
        if (questions == null || questions.isEmpty()) {
            questions = questionDao.findRandomQuestionsAny(numQuestions != null ? numQuestions : 5);
        }
        return new ResponseEntity<>(questions, HttpStatus.OK);
    }

    public ResponseEntity<List<QuestionWrapper>> getQuestionsFromId(List<Integer> questionIds) {
        List<QuestionWrapper> wrappers = new ArrayList<>();
        if (questionIds == null) return new ResponseEntity<>(wrappers, HttpStatus.OK);

        for (Integer id : questionIds) {
            Optional<Question> questionOpt = questionDao.findById(id);
            if (questionOpt.isPresent()) {
                Question question = questionOpt.get();
                QuestionWrapper wrapper = new QuestionWrapper();
                wrapper.setId(question.getId());
                wrapper.setQuestionTitle(question.getQuestionTitle());
                wrapper.setOption1(question.getOption1());
                wrapper.setOption2(question.getOption2());
                wrapper.setOption3(question.getOption3());
                wrapper.setOption4(question.getOption4());
                wrappers.add(wrapper);
            }
        }

        return new ResponseEntity<>(wrappers, HttpStatus.OK);
    }

    public ResponseEntity<Integer> getScore(List<Response> responses) {
        int right = 0;
        if (responses == null) return new ResponseEntity<>(0, HttpStatus.OK);

        for (Response response : responses) {
            if (response != null && response.getId() != null && response.getResponse() != null) {
                Optional<Question> questionOpt = questionDao.findById(response.getId());
                if (questionOpt.isPresent()) {
                    Question question = questionOpt.get();
                    if (question.getRightAnswer() != null &&
                        question.getRightAnswer().trim().equalsIgnoreCase(response.getResponse().trim())) {
                        right++;
                    }
                }
            }
        }
        return new ResponseEntity<>(right, HttpStatus.OK);
    }

    public ResponseEntity<String> addQuestions(List<Question> questions) {
        if (questions != null) {
            for (Question question : questions) {
                questionDao.save(question);
            }
        }
        return new ResponseEntity<>("success", HttpStatus.OK);
    }
}
