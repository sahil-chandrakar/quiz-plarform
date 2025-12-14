// app/create/page.js
'use client';
import QuizForm from '../components/QuizForm';
import { saveQuiz } from '../../utils/storage';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
    const router = useRouter();
    const handleCreate = (quizData) => {
        saveQuiz(quizData);
        router.push('/');
    };
    return <QuizForm onSubmit={handleCreate} buttonLabel="Create Quiz" />;
}