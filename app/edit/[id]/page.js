// app/edit/[id]/page.js
'use client';
import { useEffect, useState, use } from 'react'; // Added 'use'
import QuizForm from '../../components/QuizForm';
import { getQuizById, updateQuiz } from '../../../utils/storage';
import { useRouter } from 'next/navigation';

export default function EditPage({ params }) {
    const router = useRouter();
    const { id } = use(params); // Unwrap the params Promise here
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        // Use 'id' directly now, not params.id
        const data = getQuizById(id);
        if (data) setQuiz(data);
    }, [id]);

    const handleUpdate = (updatedData) => {
        updateQuiz(id, updatedData); // Use 'id'
        router.push('/');
    };

    if (!quiz) return <div>Loading...</div>;

    return <QuizForm initialData={quiz} onSubmit={handleUpdate} buttonLabel="Update Quiz" />;
}