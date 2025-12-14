// app/components/QuizForm.js
'use client';
import { useState } from 'react';
import { Stack, TextField, Button, Typography, Paper, IconButton, Radio, FormControlLabel, Checkbox, Box, Divider, Chip } from '@mui/material'; // <--- Added Chip here
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export default function QuizForm({ initialData, onSubmit, buttonLabel = "Save Quiz" }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [timeLimit, setTimeLimit] = useState(initialData?.timeLimit || 60);
    const [randomize, setRandomize] = useState(initialData?.randomize || false);
    const [questions, setQuestions] = useState(initialData?.questions || [
        { text: '', options: ['', ''], correctOptionIndex: 0 }
    ]);

    const handleQuestionChange = (index, field, value) => {
        const newQ = [...questions];
        newQ[index][field] = value;
        setQuestions(newQ);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQ = [...questions];
        newQ[qIndex].options[oIndex] = value;
        setQuestions(newQ);
    };

    const addOption = (qIndex) => {
        const newQ = [...questions];
        newQ[qIndex].options.push('');
        setQuestions(newQ);
    };

    const handleSubmit = () => {
        if (!title) return alert("Title is required");
        onSubmit({ title, timeLimit, randomize, questions });
    };

    return (
        <Stack spacing={4} sx={{ maxWidth: '800px', mx: 'auto', pb: 10 }}>

            {/* 1. Configuration Card */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography variant="h6" fontWeight="800" gutterBottom>Quiz Configuration</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>Set the basic rules for your quiz challenge.</Typography>

                <Stack spacing={3}>
                    <TextField
                        label="Quiz Title"
                        variant="filled"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        InputProps={{ disableUnderline: true, style: { borderRadius: 12 } }}
                        sx={{ '& .MuiFilledInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                        <TextField
                            label="Timer (seconds)"
                            type="number"
                            variant="filled"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                            InputProps={{ disableUnderline: true }}
                            sx={{ flex: 1, '& .MuiFilledInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                        />
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', bgcolor: '#f8fafc', borderRadius: 3, px: 2 }}>
                            <FormControlLabel
                                control={<Checkbox checked={randomize} onChange={(e) => setRandomize(e.target.checked)} color="primary" />}
                                label={<Typography fontWeight="500" fontSize="0.95rem">Randomize Question Order</Typography>}
                            />
                        </Box>
                    </Stack>
                </Stack>
            </Paper>

            <Divider>
                <Chip label="QUESTIONS" size="small" sx={{ fontWeight: 700, letterSpacing: 1 }} />
            </Divider>

            {/* 2. Questions List */}
            <Stack spacing={3}>
                {questions.map((q, qIndex) => (
                    <Paper key={qIndex} elevation={0} sx={{ p: 0, borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>

                        {/* Question Header */}
                        <Box sx={{ bgcolor: '#f8fafc', px: 3, py: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <DragIndicatorIcon sx={{ color: '#cbd5e1', fontSize: 20 }} />
                                <Typography fontWeight="700" color="text.secondary">Question {qIndex + 1}</Typography>
                            </Stack>
                            {questions.length > 1 && (
                                <IconButton size="small" onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))} sx={{ color: '#ef4444' }}>
                                    <DeleteOutlineRoundedIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>

                        <Box sx={{ p: 3 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Type your question here..."
                                value={q.text}
                                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                variant="outlined"
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                            />

                            <Stack spacing={2}>
                                {q.options.map((opt, oIndex) => (
                                    <Stack direction="row" alignItems="center" key={oIndex} spacing={1}>
                                        <Radio
                                            checked={q.correctOptionIndex === oIndex}
                                            onChange={() => handleQuestionChange(qIndex, 'correctOptionIndex', oIndex)}
                                            sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#10b981' } }}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder={`Option ${oIndex + 1}`}
                                            value={opt}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: q.correctOptionIndex === oIndex ? '#f0fdf4' : 'white' } }}
                                        />
                                    </Stack>
                                ))}
                                <Button
                                    startIcon={<AddRoundedIcon />}
                                    onClick={() => addOption(qIndex)}
                                    sx={{ alignSelf: 'flex-start', ml: 4, color: 'primary.main', fontWeight: 600 }}
                                >
                                    Add Option
                                </Button>
                            </Stack>
                        </Box>
                    </Paper>
                ))}
            </Stack>

            {/* Floating Action Bar */}
            <Stack direction="row" spacing={2} sx={{ position: 'sticky', bottom: 20, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', p: 2, borderRadius: 4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setQuestions([...questions, { text: '', options: ['', ''], correctOptionIndex: 0 }])}
                    startIcon={<AddRoundedIcon />}
                    sx={{ borderRadius: 3, border: '2px dashed #cbd5e1', color: 'text.secondary', '&:hover': { border: '2px dashed #94a3b8', bgcolor: '#f8fafc' } }}
                >
                    Add Question
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    startIcon={<SaveRoundedIcon />}
                    sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}
                >
                    {buttonLabel}
                </Button>
            </Stack>
        </Stack>
    );
}