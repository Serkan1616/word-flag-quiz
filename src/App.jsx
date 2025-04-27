import "./App.css";
import { useState, useEffect } from "react";
import Question from "./Question";
import congrats from "./assets/congrats.png";

function App() {
  const questionNumber = 10;
  const [countries, setCountries] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const settingQuestions = () => {
    const newQuestions = [];

    for (let i = 0; i < questionNumber; i++) {
      const correctCountry =
        countries[Math.floor(Math.random() * countries.length)];

      let otherCountries = countries.filter(
        (c) => c.name.common !== correctCountry.name.common
      );
      let wrongOptions = [];

      while (wrongOptions.length < 3) {
        const random =
          otherCountries[Math.floor(Math.random() * otherCountries.length)];
        if (!wrongOptions.find((o) => o.name.common === random.name.common)) {
          wrongOptions.push(random);
        }
      }

      const options = [
        ...wrongOptions.map((c) => c.name.common),
        correctCountry.name.common,
      ].sort(() => Math.random() - 0.5);

      const question = {
        name: correctCountry.name.common,
        flag: correctCountry.flags.png,
        options: options,
      };

      newQuestions.push(question);
    }

    setQuestions(newQuestions);
  };

  useEffect(() => {
    if (countries.length > 0) {
      settingQuestions();
    }
  }, [countries]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
    } else {
      setIsQuizFinished(true);
    }
  };
  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsAnswered(false);
    setIsQuizFinished(false);
    settingQuestions();
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-[url('/bg.jpg')] bg-cover bg-no-repeat text-[#E2E4F3] font-vietnam px-4 py-8">
      <div className="flex flex-col gap-10 w-full max-w-3xl">
        {isQuizFinished ? (
          <div className="flex flex-col bg-[#343964] rounded-2xl py-10 px-6 sm:px-20 items-center justify-center text-white text-center gap-6">
            <img src={congrats} alt="congrats" className="w-40 sm:w-60" />
            <h2 className="text-2xl sm:text-3xl font-bold">🎉 Congrats!</h2>
            <p className="text-lg sm:text-xl">
              You answered{" "}
              <span className="text-green-400 font-bold">{score}</span> out of{" "}
              <span className="font-bold">{questionNumber}</span> correctly.
            </p>
            <button
              onClick={restartQuiz}
              className="px-10 py-3 sm:px-20 sm:py-4 rounded-2xl cursor-pointer bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 sm:gap-0">
              <h1 className="text-2xl sm:text-4xl font-bold">Country Quiz</h1>
              <span
                style={{ background: "#E65895" }}
                className="px-4 py-2 rounded-2xl text-lg sm:text-xl"
              >
                {score}/{questionNumber} Points
              </span>
            </div>

            <div className="flex flex-col gap-10 bg-[#343964] rounded-2xl px-6 sm:px-10 py-10 w-full">
              <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap">
                {questions.map((_, index) => (
                  <span
                    key={index}
                    style={{
                      background:
                        index === currentQuestionIndex ? "#E65895" : "#444B7F",
                    }}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm"
                  >
                    {index + 1}
                  </span>
                ))}
              </div>

              {questions.length > 0 && (
                <Question
                  key={currentQuestionIndex}
                  name={questions[currentQuestionIndex].name}
                  flag={questions[currentQuestionIndex].flag}
                  options={questions[currentQuestionIndex].options}
                  onAnswer={handleAnswer}
                />
              )}

              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`self-end px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-white font-bold transition-all ${
                  isAnswered
                    ? "bg-[#E65895] cursor-pointer hover:bg-[#BC6BE8]"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
