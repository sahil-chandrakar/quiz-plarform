// utils/storage.js

// --- QUIZ MANAGEMENT ---
export const getQuizzes = () => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('my_quizzes');
    return stored ? JSON.parse(stored) : [];
};

export const getQuizById = (id) => {
    const quizzes = getQuizzes();
    return quizzes.find((q) => q.id === id);
};

export const saveQuiz = (quiz) => {
    const quizzes = getQuizzes();
    const newQuiz = {
        ...quiz,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    localStorage.setItem('my_quizzes', JSON.stringify([...quizzes, newQuiz]));
};

export const updateQuiz = (id, updatedData) => {
    const quizzes = getQuizzes();
    const index = quizzes.findIndex((q) => q.id === id);
    if (index !== -1) {
        quizzes[index] = { ...quizzes[index], ...updatedData };
        localStorage.setItem('my_quizzes', JSON.stringify(quizzes));
    }
};

export const deleteQuiz = (id) => {
    const quizzes = getQuizzes().filter((q) => q.id !== id);
    localStorage.setItem('my_quizzes', JSON.stringify(quizzes));
};

// --- STATISTICS / RESULTS ---
export const saveQuizResult = (result) => {
    if (typeof window === 'undefined') return;
    const currentHistory = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    // Add new result to history
    const newHistory = [...currentHistory, { ...result, timestamp: new Date().toISOString() }];
    localStorage.setItem('quiz_history', JSON.stringify(newHistory));

    // Also save "latest_result" for immediate redirection to results page
    localStorage.setItem('latest_result', JSON.stringify(result));
};

export const getLatestResult = () => {
    if (typeof window === 'undefined') return null;
    return JSON.parse(localStorage.getItem('latest_result'));
};