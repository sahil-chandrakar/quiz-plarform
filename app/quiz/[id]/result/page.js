// app/quiz/[id]/result/page.js
'use client';
import { useEffect, useState } from 'react';
import { Stack, Typography, Card, CardContent, Button, Divider, Chip } from '@mui/material';
import { getLatestResult } from '../../../../utils/storage';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ResultPage() {
    const [result, setResult] = useState(null);

    useEffect(() => {
        setResult(getLatestResult());
    }, []);

    if (!result) return <div>Loading Results...</div>;

    const percentage = Math.round((result.score / result.totalQuestions) * 100);

    return (
        <Stack spacing={4} sx={{ padding: 4, maxWidth: 'md', margin: '0 auto' }}>

            {/* Score Summary */}
            <Card sx={{ bgcolor: percentage >= 50 ? '#e8f5e9' : '#ffebee', textAlign: 'center', p: 3 }}>
                <Typography variant="h4">Quiz Completed!</Typography>
                <Typography variant="h2" fontWeight="bold" color={percentage >= 50 ? 'green' : 'error'} sx={{ my: 2 }}>
                    {percentage}%
                </Typography>
                <Typography variant="h6">You scored {result.score} out of {result.totalQuestions}</Typography>
            </Card>

            <Typography variant="h5" fontWeight="bold">Detailed Analysis</Typography>

            {/* Detailed Question Breakdown */}
            <Stack spacing={2}>
                {result.details.map((item, index) => (
                    <Card key={index} sx={{ borderLeft: item.isCorrect ? '5px solid green' : '5px solid red' }}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                {item.isCorrect ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                                <Stack spacing={1} width="100%">
                                    <Typography variant="subtitle1" fontWeight="bold">{item.question}</Typography>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
                                        <Chip
                                            label={`Your Answer: ${item.selectedOption}`}
                                            color={item.isCorrect ? "success" : "error"}
                                            variant="outlined"
                                        />
                                        {!item.isCorrect && (
                                            <Chip
                                                label={`Correct Answer: ${item.correctOption}`}
                                                color="success"
                                                variant="filled"
                                            />
                                        )}
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Button variant="contained" size="large" component={Link} href="/" sx={{ bgcolor: '#0f8a44' }}>
                Back to Dashboard
            </Button>
        </Stack>
    );
}