import { createContext, useContext, useState, useEffect } from "react";
import { useGetPdfListQuery } from "../features/pdfUpload/pdfUploadApi";
import toast from "react-hot-toast";

const AdminContext = createContext();

export const useAdmin = () => {
  return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);

  // Mock questions data
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "Name",
      type: "text",
      placeholder: "Type your full name",
    },
    {
      id: 2,
      question: "Age",
      type: "text",
      placeholder: "Type your age",
    },
    {
      id: 3,
      question: "Gender",
      type: "select",
      options: ["Male", "Female", "Other", "Prefer not to say"],
    },
    {
      id: 4,
      question: "Zip Code",
      type: "text",
      placeholder: "Type your zip code",
    },
    {
      id: 5,
      question: "Nicotine Exposure",
      type: "select",
      options: ["Never smoker", "Former smoker", "Current smoker", "Exposed to secondhand smoke"],
    },
    {
      id: 6,
      question: "Physical Activity",
      type: "select",
      options: ["0-1 days per week", "2-3 days per week", "4-5 days per week", "6-7 days per week"],
    },
    {
      id: 7,
      question: "Hours of Sleep on Average",
      type: "select",
      options: ["Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours"],
    },
    {
      id: 8,
      question: "Fruit and Vegetable Intake",
      type: "select",
      options: ["0-1 servings", "2-3 servings", "4-5 servings", "More than 5 servings"],
    },
    {
      id: 9,
      question: "Consumption of Processed Foods",
      type: "select",
      options: ["Daily", "2-3 times a week", "1-2 times a week", "Rarely or never"],
    },
    {
      id: 10,
      question: "Hypertension Screen - When was the last time a healthcare professional checked your blood pressure?",
      type: "select",
      options: ["Less than 6 months ago", "6-12 months ago", "More than 12 months ago", "Never"],
    },
    {
      id: 11,
      question: "Last Blood Pressure Range",
      type: "select",
      options: ["Less than 120/80", "120-139/80-89", "More than 140/90", "Not Sure"],
    },
    {
      id: 12,
      question: "Do you take medications for hypertension?",
      type: "select",
      options: ["Yes", "No"],
    },
    {
      id: 13,
      question: "Do you know what a normal blood pressure is?",
      type: "select",
      options: ["Yes", "No"],
    },
    {
      id: 14,
      question: "When was the last time you had blood work to screen for diabetes or hyperlipidemia?",
      type: "select",
      options: ["Less than 6 months ago", "6-12 months ago", "More than 12 months ago", "Never"],
    },
    {
      id: 15,
      question: "BMI",
      type: "select",
      options: ["Less than 25", "25-30", "30-35", "More than 35", "Not sure"],
    },
  ]);

  // Mock user history
  const [userHistory, setUserHistory] = useState([
    {
      id: 1,
      user: "Kristen Watson",
      question: "What is the current first-line treatment for type 2 diabetes?",
      date: "02/03/2024",
    },
    {
      id: 2,
      user: "Marvin McKinney",
      question: "How do you differentiate between viral and bacterial pneumonia?",
      date: "18/03/2024",
    },
    {
      id: 3,
      user: "Jane Cooper",
      question: "What are the most effective preventive measures against sepsis?",
      date: "05/03/2024",
    },
    {
      id: 4,
      user: "Cody Fisher",
      question: "How should sepsis be diagnosed and treated according to the latest guidelines?",
      date: "08/03/2024",
    },
    {
      id: 5,
      user: "Bessie Cooper",
      question: "What are the common side effects of long-term corticosteroid use?",
      date: "22/03/2024",
    },
    {
      id: 6,
      user: "Leslie Alexander",
      question: "How is Bayes' theorem being used to support clinical decision-making?",
      date: "09/03/2024",
    },
    {
      id: 7,
      user: "Guy Hawkins",
      question: "What are the ethical challenges of using AI in patient care?",
      date: "19/03/2024",
    },
    {
      id: 8,
      user: "Theresa Webb",
      question: "Can AI help predict patient outcomes based on trial data?",
      date: "16/03/2024",
    },
    {
      id: 9,
      user: "Jerome Bell",
      question: "How to reduce language processing transforming medical research?",
      date: "23/03/2024",
    },
    {
      id: 10,
      user: "Savannah Nguyen",
      question: "What are the role of testing in generating responses without physician oversight?",
      date: "30/03/2024",
    },
    {
      id: 11,
      user: "Wade Warren",
      question: "How can patients verify the reliability of online medical advice?",
      date: "01/04/2024",
    },
  ]);

  const login = (email, password) => {
    if (email && password) {
      return true;
    }
    return false;
  };

  const verifyOTP = (otp) => {
    if (otp && otp.length === 6) {
      setIsAuthenticated(true);
      setAdmin({
        name: "Dr.Chuxy",
        email: "dr.chuxy@example.com",
        avatar: "/avatar.png",
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdmin(null);
  };

  const addQuestion = (question) => {
    const newQuestion = {
      id: questions.length + 1,
      ...question,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, updatedQuestion) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q)));
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  

  const value = {
    isAuthenticated,
    admin,
    login,
    verifyOTP,
    logout,
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    userHistory,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};