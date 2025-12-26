import { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [isClicked, setClicked] = useState(false);
  const [quesNo, setQuesNo] = useState(1);
  const [question, setQues] = useState("");
  const [userAns, setUserAns] = useState('');
  const [correctAns, setCorrectAns] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [marks, setMarks] = useState(0);

  useEffect(() => {
    async function fetchValues() {
      try {
        setLoading(true);
        setUserAns(null); // reset answer
        const res = await fetch(
          `https://opentdb.com/api.php?amount=1&category=21&difficulty=easy&type=multiple`
        );

        const data = await res.json();
        if (!data.results || data.results.length === 0) {
          setLoading(false);
          return;
        }

        const result = data.results[0];
        const correct = result.correct_answer;
        const incorrect = result.incorrect_answers;
        const allAnswers = [...incorrect, correct];
        // Shuffle properly
        const shuffledAns = allAnswers.sort(() => Math.random() - 0.5);

        setOptions(shuffledAns);
        setCorrectAns(correct);
        setQues(result.question);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching quiz:", error);
        setLoading(false);
      }
    }

    fetchValues();
  }, [isClicked]);
  
  function handleNext() {
    if (quesNo >= 10) return;
    if(userAns===null) return;
    setQuesNo((prev) => prev + 1);
    setClicked((prev) => !prev);
  }

  function handlePrevious() {
    if (quesNo <= 1) return;
     if(userAns===null) return;
    setQuesNo((prev) => prev - 1);
    setClicked((prev) => !prev);
  }
  function handleSelectedAns(ans) {
if (userAns !== null) return
      setUserAns(ans);
      if(ans===correctAns){
        setMarks(prev=>prev+1)
      }
    console.log("userAns:", userAns, "correctAns:", correctAns, "ans:", ans);
    
  }
  return (
    <div className="quiz-cont">
      <h2>QUIZ APP</h2>
      <p className="cate-name">SPORTS CATEGORY</p>
      <div className="App-cont">
        <div className="ques-count-cont">
          <p className="quesno">Question {quesNo} out of 10</p>
          <p className="mark">Mark: {marks}/10</p>
        </div>

        <div className="Q-A-cont">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h4
                className="question"
                dangerouslySetInnerHTML={{ __html: question }}
              />
              {options.map((ans, index) => (
                <button
                  key={index}
                  className={`answer-btn ${
                    userAns === ans
                      ? ans === correctAns
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  onClick={() => handleSelectedAns(ans)}
                >
                  <span dangerouslySetInnerHTML={{ __html: ans }} />
                </button>
              ))}

              <div className="btn-cont">
                <button
                  className="previous"
                  onClick={handlePrevious}
                  disabled={quesNo <= 1}
                >
                  Previous
                </button>
                <button
                  className="next"
                  onClick={handleNext}
                  disabled={quesNo >= 10}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        <div className="footer"></div>
      </div>
    </div>
  );
}
