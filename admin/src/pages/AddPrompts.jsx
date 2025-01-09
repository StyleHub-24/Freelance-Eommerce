import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const AddPrompts = ({ token }) => {
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([{ question: "", answer: "" }]);
  const [loading, setLoading] = useState(true);

  // Fetch existing questions and answers on load
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/chatbot/get-prompt`, {
          headers: { token },
        });
        if (response.data.success) {
          const data = response.data.questionsAndAnswers;
          setQuestionsAndAnswers(data.length ? data : [{ question: "", answer: "" }]);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching chatbot data.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [token]);

  const handleInputChange = (e, index, type) => {
    const newQuestionsAndAnswers = [...questionsAndAnswers];
    newQuestionsAndAnswers[index][type] = e.target.value;
    setQuestionsAndAnswers(newQuestionsAndAnswers);
  };

  const handleAddQuestionAnswer = () => {
    setQuestionsAndAnswers([...questionsAndAnswers, { question: "", answer: "" }]);
  };

  const handleRemoveQnA = (index) => {
    const updatedQnA = questionsAndAnswers.filter((_, i) => i !== index);
    setQuestionsAndAnswers(updatedQnA.length ? updatedQnA : [{ question: "", answer: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (questionsAndAnswers.some((qna) => !qna.question.trim() || !qna.answer.trim())) {
      toast.error("All fields must be filled.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/chatbot/add-prompt`,
        { questionsAndAnswers },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Prompts added successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding chatbot data.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 border rounded-md bg-white shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-center">
        Add Chatbot Questions and Answers
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {questionsAndAnswers.map((qna, index) => (
          <div key={index} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question {index + 1}
              </label>
              <input
                type="text"
                value={qna.question}
                onChange={(e) => handleInputChange(e, index, "question")}
                placeholder="Enter question"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer {index + 1}
              </label>
              <input
                type="text"
                value={qna.answer}
                onChange={(e) => handleInputChange(e, index, "answer")}
                placeholder="Enter answer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => handleRemoveQnA(index)}
                className="text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={handleAddQuestionAnswer}
            className="rounded-md bg-gray-800 py-2 px-4 text-sm text-white"
          >
            Add More
          </button>
        </div>

        <div>
          <button
            type="submit"
            className="rounded-md bg-blue-600 py-2 px-4 text-sm text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPrompts;
