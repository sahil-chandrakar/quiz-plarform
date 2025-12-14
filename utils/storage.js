// utils/storage.js

// --- DUMMY DATA FOR FIRST-TIME USERS ---
const DUMMY_QUIZZES = [
    {
        id: 'quiz_web_dev_advanced',
        title: 'Web Development (Advanced)',
        timeLimit: 120,
        randomize: true,
        createdAt: new Date().toISOString(),
        questions: [
            {
                text: 'In React, what causes a component re-render?',
                options: [
                    'Change in props or state',
                    'Calling a normal function',
                    'Using useRef',
                    'Reading a variable'
                ],
                correctOptionIndex: 0
            },
            {
                text: 'Which React hook is used to handle side effects?',
                options: ['useState', 'useMemo', 'useEffect', 'useCallback'],
                correctOptionIndex: 2
            },
            {
                text: 'What is the purpose of dependency array in useEffect?',
                options: [
                    'To control when effect runs',
                    'To store state',
                    'To memoize JSX',
                    'To prevent API calls'
                ],
                correctOptionIndex: 0
            },
            {
                text: 'HTTP status code 401 means:',
                options: [
                    'Forbidden',
                    'Unauthorized',
                    'Not Found',
                    'Bad Request'
                ],
                correctOptionIndex: 1
            },
            {
                text: 'Which lifecycle phase does useEffect(run once) resemble?',
                options: [
                    'componentDidUpdate',
                    'componentWillUnmount',
                    'componentDidMount',
                    'shouldComponentUpdate'
                ],
                correctOptionIndex: 2
            },
            {
                text: 'What is CORS mainly used for?',
                options: [
                    'Improving performance',
                    'Securing cross-origin requests',
                    'Caching API responses',
                    'Encrypting data'
                ],
                correctOptionIndex: 1
            },
            {
                text: 'Which technique reduces unnecessary re-renders?',
                options: [
                    'useMemo / useCallback',
                    'useEffect',
                    'useRef',
                    'useLayoutEffect'
                ],
                correctOptionIndex: 0
            }
        ]
    },

    {
        id: 'quiz_cs_maths_ai',
        title: 'CS Mathematics (AI / ML)',
        timeLimit: 180,
        randomize: true,
        createdAt: new Date().toISOString(),
        questions: [
            {
                text: 'Which matrix operation is required in Linear Regression?',
                options: [
                    'Matrix multiplication',
                    'Matrix determinant',
                    'Matrix transpose only',
                    'Eigen decomposition'
                ],
                correctOptionIndex: 0
            },
            {
                text: 'Gradient Descent is used to:',
                options: [
                    'Maximize loss',
                    'Minimize cost function',
                    'Increase accuracy directly',
                    'Normalize data'
                ],
                correctOptionIndex: 1
            },
            {
                text: 'If features are highly correlated, which problem occurs?',
                options: [
                    'Overfitting',
                    'Underfitting',
                    'Multicollinearity',
                    'Vanishing gradient'
                ],
                correctOptionIndex: 2
            },
            {
                text: 'Which probability distribution is commonly used for classification?',
                options: [
                    'Uniform',
                    'Poisson',
                    'Bernoulli',
                    'Exponential'
                ],
                correctOptionIndex: 2
            },
            {
                text: 'Eigenvectors are mainly used in:',
                options: [
                    'Linear Search',
                    'PCA',
                    'KNN',
                    'Backpropagation'
                ],
                correctOptionIndex: 1
            },
            {
                text: 'What does regularization reduce?',
                options: [
                    'Bias',
                    'Variance',
                    'Learning rate',
                    'Data size'
                ],
                correctOptionIndex: 1
            },
            {
                text: 'Time complexity of matrix multiplication (naive)?',
                options: ['O(n²)', 'O(n log n)', 'O(n³)', 'O(2ⁿ)'],
                correctOptionIndex: 2
            }
        ]
    },

    {
        id: 'quiz_ml_advanced',
        title: 'Machine Learning (Advanced)',
        timeLimit: 150,
        randomize: true,
        createdAt: new Date().toISOString(),
        questions: [
            {
                text: 'Which loss function is used in binary classification?',
                options: [
                    'MSE',
                    'Hinge loss',
                    'Binary Cross Entropy',
                    'Huber loss'
                ],
                correctOptionIndex: 2
            },
            {
                text: 'Overfitting happens when:',
                options: [
                    'Model generalizes well',
                    'Model memorizes training data',
                    'Dataset is large',
                    'Learning rate is small'
                ],
                correctOptionIndex: 1
            },
            {
                text: 'Which algorithm is NOT distance-based?',
                options: ['KNN', 'K-Means', 'SVM (linear)', 'Decision Tree'],
                correctOptionIndex: 3
            },
            {
                text: 'Backpropagation is used to:',
                options: [
                    'Update weights',
                    'Split data',
                    'Reduce features',
                    'Increase epochs'
                ],
                correctOptionIndex: 0
            },
            {
                text: 'Which technique helps prevent overfitting?',
                options: [
                    'Dropout',
                    'More epochs',
                    'Higher learning rate',
                    'Removing validation set'
                ],
                correctOptionIndex: 0
            },
            {
                text: 'Confusion matrix is used for:',
                options: [
                    'Regression evaluation',
                    'Clustering',
                    'Classification evaluation',
                    'Dimensionality reduction'
                ],
                correctOptionIndex: 2
            }
        ]
    },

    {
        id: 'quiz_cs_fundamentals',
        title: 'Computer Science Fundamentals',
        timeLimit: 120,
        randomize: true,
        createdAt: new Date().toISOString(),
        questions: [
            {
                text: 'Which data structure is used in BFS?',
                options: ['Stack', 'Queue', 'Tree', 'Set'],
                correctOptionIndex: 1
            },
            {
                text: 'Time complexity of binary search?',
                options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
                correctOptionIndex: 1
            },
            {
                text: 'Which is NOT a characteristic of OOP?',
                options: ['Encapsulation', 'Inheritance', 'Compilation', 'Polymorphism'],
                correctOptionIndex: 2
            },
            {
                text: 'Deadlock occurs due to:',
                options: [
                    'Mutual exclusion',
                    'Circular wait',
                    'Hold and wait',
                    'All of the above'
                ],
                correctOptionIndex: 3
            },
            {
                text: 'Which layer handles routing?',
                options: ['Application', 'Transport', 'Network', 'Data Link'],
                correctOptionIndex: 2
            }
        ]
    }
];



// --- QUIZ MANAGEMENT ---

export const getQuizzes = () => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem('my_quizzes');

    // REQUIREMENT 1: If empty, load dummy data immediately
    if (!stored) {
        localStorage.setItem('my_quizzes', JSON.stringify(DUMMY_QUIZZES));
        return DUMMY_QUIZZES;
    }

    return JSON.parse(stored);
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

    // REQUIREMENT 2: Add new quiz at the BEGINNING (First)
    // [newQuiz, ...oldQuizzes]
    const updatedQuizzes = [newQuiz, ...quizzes];

    localStorage.setItem('my_quizzes', JSON.stringify(updatedQuizzes));
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
    // Add new result to history (Newest first here too is usually better)
    const newHistory = [{ ...result, timestamp: new Date().toISOString() }, ...currentHistory];
    localStorage.setItem('quiz_history', JSON.stringify(newHistory));

    // Also save "latest_result" for immediate redirection
    localStorage.setItem('latest_result', JSON.stringify(result));
};

export const getLatestResult = () => {
    if (typeof window === 'undefined') return null;
    return JSON.parse(localStorage.getItem('latest_result'));
};