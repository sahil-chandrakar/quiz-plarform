// app/page.js
'use client';
import { useState, useEffect } from 'react';
import { Stack, Typography, Card, Button, IconButton, Box, Menu, MenuItem, Chip, TextField, InputAdornment, Avatar } from '@mui/material';
import { getQuizzes, deleteQuiz } from '../utils/storage';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BoltIcon from '@mui/icons-material/Bolt';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Helper to generate a consistent gradient based on the string (title)
const getGradient = (str) => {
  const gradients = [
    'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)', // Green to Blue
    'linear-gradient(135deg, #F9A8D4 0%, #A78BFA 100%)', // Pink to Purple
    'linear-gradient(135deg, #FCD34D 0%, #F87171 100%)', // Yellow to Red
    'linear-gradient(135deg, #93C5FD 0%, #6366F1 100%)', // Light Blue to Indigo
    'linear-gradient(135deg, #C4B5FD 0%, #EC4899 100%)', // Violet to Pink
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Search State
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  useEffect(() => { setQuizzes(getQuizzes()); }, []);

  const handleMenuOpen = (event, id) => {
    event.preventDefault(); // Prevent navigating if clicking menu
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedQuizId(id);
  };

  const handleMenuClose = () => { setAnchorEl(null); setSelectedQuizId(null); };

  const handleDelete = () => {
    if (confirm("Permanently delete this quiz?")) {
      deleteQuiz(selectedQuizId);
      setQuizzes(getQuizzes());
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    router.push(`/edit/${selectedQuizId}`);
    handleMenuClose();
  };

  // Filter Logic
  const filteredQuizzes = quizzes.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- EMPTY STATE ---
  if (quizzes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Box sx={{
          width: 120, height: 120, bgcolor: '#ecfdf5', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mx: 'auto', mb: 3, color: '#10b981'
        }}>
          <BoltIcon sx={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h4" fontWeight="800" gutterBottom>No Quizzes Yet</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
          Create your first interactive quiz in seconds. Challenge your friends or test your own knowledge.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/create"
          startIcon={<AddRoundedIcon />}
          sx={{ py: 1.5, px: 4, borderRadius: 50, fontSize: '1.1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
        >
          Create Quiz
        </Button>
      </Box>
    );
  }

  // --- DASHBOARD GRID ---
  return (
    <Stack spacing={4}>

      {/* Header & Search Bar */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1} alignSelf="flex-start">
          <BoltIcon sx={{ color: '#10b981' }} />
          <Typography variant="h6" fontWeight="bold" color="text.secondary">MY LIBRARY ({filteredQuizzes.length})</Typography>
        </Stack>

        <TextField
          placeholder="Search quizzes..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
            style: { borderRadius: 12, backgroundColor: 'white' }
          }}
          sx={{ width: { xs: '100%', md: '300px' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e2e8f0' } } }}
        />
      </Stack>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(260px, 1fr))' },
        gap: 3
      }}>

        {/* Create New Card (Ghost Style) */}
        <Card
          elevation={0}
          component={Link}
          href="/create"
          sx={{
            borderRadius: 4,
            border: '2px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            textDecoration: 'none',
            minHeight: '260px',
            transition: '0.2s',
            bgcolor: 'transparent',
            '&:hover': { borderColor: '#10b981', bgcolor: '#f0fdf4' }
          }}
        >
          <Box sx={{
            width: 50, height: 50, borderRadius: '50%', bgcolor: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)', mb: 2
          }}>
            <AddRoundedIcon sx={{ color: '#10b981', fontSize: 30 }} />
          </Box>
          <Typography fontWeight="700" color="text.secondary">Create New</Typography>
        </Card>

        {/* Quiz Cards (Visual Cover Style) */}
        {filteredQuizzes.map((quiz) => {
          const cardGradient = getGradient(quiz.title);
          const firstLetter = quiz.title.charAt(0).toUpperCase();

          return (
            <Card
              key={quiz.id}
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                bgcolor: 'white',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.15)' }
              }}
            >

              {/* 1. Colorful Gradient Header */}
              <Box sx={{
                height: 80,
                background: cardGradient,
                position: 'relative'
              }}>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, quiz.id)}
                  sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' } }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* 2. Avatar Icon (Floats between header and body) */}
              <Box sx={{ px: 2, mt: -3, mb: 1 }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'white',
                  color: '#334155',
                  fontWeight: 900,
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '4px solid white'
                }}>
                  {firstLetter}
                </Avatar>
              </Box>

              {/* 3. Card Body */}
              <Box sx={{ px: 3, pb: 2, flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" sx={{
                  lineHeight: 1.2,
                  mb: 1,
                  height: '2.4em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  fontSize: '1.1rem'
                }}>
                  {quiz.title}
                </Typography>

                {/* Metadata Tags */}
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  <Chip
                    icon={<FormatListBulletedRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                    label={`${quiz.questions.length} Qs`}
                    size="small"
                    sx={{ borderRadius: 1, bgcolor: '#f1f5f9', fontWeight: 600, color: '#64748b' }}
                  />
                  <Chip
                    icon={<AccessTimeFilledRoundedIcon sx={{ fontSize: '1rem !important' }} />}
                    label={`${quiz.timeLimit}s`}
                    size="small"
                    sx={{ borderRadius: 1, bgcolor: '#f1f5f9', fontWeight: 600, color: '#64748b' }}
                  />
                  {quiz.randomize && (
                    <Chip label="Random" size="small" sx={{ borderRadius: 1, bgcolor: '#eff6ff', color: '#3b82f6', fontWeight: 600 }} />
                  )}
                </Stack>
              </Box>

              {/* 4. Action Footer */}
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  href={`/quiz/${quiz.id}`}
                  endIcon={<PlayArrowRoundedIcon />}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 700,
                    bgcolor: '#1e293b',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                  }}
                >
                  Start
                </Button>
              </Box>

            </Card>
          );
        })}

      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', mt: 1, minWidth: 140 } }}
      >
        <MenuItem onClick={handleEdit} sx={{ fontSize: '0.9rem', py: 1, px: 2, fontWeight: 500 }}>
          Modify
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ef4444', fontSize: '0.9rem', py: 1, px: 2, fontWeight: 500 }}>
          Delete
        </MenuItem>
      </Menu>

    </Stack>
  );
}