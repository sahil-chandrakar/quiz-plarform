// app/quiz/[id]/page.js
'use client';
import { useState, useEffect, use } from 'react'; // Added 'use'
import { useRouter } from 'next/navigation';
import { Stack, Typography, Button, Paper, LinearProgress } from '@mui/material';
import { getQuizById, saveQuizResult } from '../../../utils/storage';
import TimerIcon from '@mui/icons-material/Timer';

export default function TakeQuiz({ params }) {
    const router = useRouter();
    const { id } = use(params); // Unwrap params here

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const data = getQuizById(id); // Use 'id'
        if (data) {
            setQuiz(data);
            setTimeLeft(data.timeLimit);

            let qList = [...data.questions];
            if (data.randomize) {
                qList = qList.sort(() => Math.random() - 0.5);
            }
            setQuestions(qList);
        }
    }, [id]);

    // Timer
    useEffect(() => {
        if (timeLeft <= 0) {
            if (quiz) submitQuiz();
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, quiz]); // Removed 'submitQuiz' from dependency to avoid loop, it's safe here

    const handleOptionSelect = (optionIndex) => {
        setUserAnswers({ ...userAnswers, [currentQIndex]: optionIndex });
    };

    const nextQuestion = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = () => {
        let score = 0;
        const detailedResults = questions.map((q, index) => {
            const selected = userAnswers[index];
            const isCorrect = selected === q.correctOptionIndex;
            if (isCorrect) score++;
            return {
                question: q.text,
                selectedOption: q.options[selected] || "Skipped",
                correctOption: q.options[q.correctOptionIndex],
                isCorrect
            };
        });

        const resultData = {
            quizId: quiz.id,
            quizTitle: quiz.title,
            score,
            totalQuestions: questions.length,
            details: detailedResults
        };

        saveQuizResult(resultData);
        router.push(`/quiz/${id}/result`); // Use 'id'
    };

    if (!quiz || questions.length === 0) return <div>Loading...</div>;

    const currentQ = questions[currentQIndex];

    return (
        <Stack spacing={3} sx={{ padding: 4, maxWidth: 'md', margin: '0 auto' }}>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold">{quiz.title}</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ color: timeLeft < 10 ? 'red' : 'inherit' }}>
                    <TimerIcon />
                    <Typography variant="h6">{new Date(timeLeft * 1000).toISOString().substr(14, 5)}</Typography>
                </Stack>
            </Stack>

            <LinearProgress variant="determinate" value={((currentQIndex + 1) / questions.length) * 100} color="success" />

            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Q{currentQIndex + 1}: {currentQ.text}
                </Typography>

                <Stack spacing={2} sx={{ mt: 3 }}>
                    {currentQ.options.map((opt, idx) => (
                        <Button
                            key={idx}
                            variant={userAnswers[currentQIndex] === idx ? "contained" : "outlined"}
                            color="success"
                            sx={{
                                justifyContent: 'flex-start',
                                py: 1.5,
                                borderColor: userAnswers[currentQIndex] === idx ? 'transparent' : '#ccc'
                            }}
                            onClick={() => handleOptionSelect(idx)}
                        >
                            {opt}
                        </Button>
                    ))}
                </Stack>
            </Paper>

            <Button variant="contained" size="large" onClick={nextQuestion} sx={{ alignSelf: 'flex-end', bgcolor: '#0f8a44' }}>
                {currentQIndex === questions.length - 1 ? "Submit Quiz" : "Next Question"}
            </Button>
        </Stack>
    );
}