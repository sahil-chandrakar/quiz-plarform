// app/page.js
'use client';
import { useState, useEffect } from 'react';
import { Stack, Typography, Card, Button, IconButton, Box, Menu, MenuItem, Chip, TextField, InputAdornment, Avatar, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { getQuizzes, deleteQuiz } from '../utils/storage';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BoltIcon from '@mui/icons-material/Bolt';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { keyframes } from '@emotion/react'; // <--- IMPORT FOR ANIMATION

// --- 1. DEFINE ANIMATION ---
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Helper for Card Gradients
const getGradient = (str) => {
  const gradients = [
    'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)',
    'linear-gradient(135deg, #F9A8D4 0%, #A78BFA 100%)',
    'linear-gradient(135deg, #FCD34D 0%, #F87171 100%)',
    'linear-gradient(135deg, #93C5FD 0%, #6366F1 100%)',
    'linear-gradient(135deg, #C4B5FD 0%, #EC4899 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return gradients[Math.abs(hash) % gradients.length];
};

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // Stats State
  const [statsOpen, setStatsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalPlayed: 0, totalQuestions: 0, avgAccuracy: 0 });

  const router = useRouter();

  useEffect(() => {
    setQuizzes(getQuizzes());

    // Load History
    const storedHistory = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    setHistory(storedHistory);

    if (storedHistory.length > 0) {
      const totalPlayed = storedHistory.length;
      const totalQuestions = storedHistory.reduce((acc, curr) => acc + curr.totalQuestions, 0);
      const totalScore = storedHistory.reduce((acc, curr) => acc + curr.score, 0);
      const avgAccuracy = Math.round((totalScore / totalQuestions) * 100);
      setStats({ totalPlayed, totalQuestions, avgAccuracy });
    }
  }, []);

  const handleMenuOpen = (event, id) => {
    event.preventDefault();
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

  const filteredQuizzes = quizzes.filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Stack spacing={4}>

      {/* Header, Search & Stats */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1} alignSelf="flex-start">
          <BoltIcon sx={{ color: '#10b981' }} />
          <Typography variant="h6" fontWeight="bold" color="text.secondary">MY LIBRARY ({filteredQuizzes.length})</Typography>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchRoundedIcon sx={{ color: '#94a3b8' }} /></InputAdornment>),
              style: { borderRadius: 12, backgroundColor: 'white' }
            }}
            sx={{ flexGrow: 1, minWidth: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#e2e8f0' } } }}
          />

          <Button
            variant="outlined"
            startIcon={<AssessmentRoundedIcon />}
            onClick={() => setStatsOpen(true)}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, borderColor: '#cbd5e1', color: '#475569' }}
          >
            Stats
          </Button>
        </Stack>
      </Stack>

      {/* Grid of Quizzes */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(260px, 1fr))' }, gap: 3 }}>

        {/* Create New Card */}
        <Card
          elevation={0}
          component={Link}
          href="/create"
          sx={{
            borderRadius: 4, border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textDecoration: 'none',
            minHeight: '260px', transition: '0.2s', bgcolor: 'transparent',
            '&:hover': { borderColor: '#10b981', bgcolor: '#f0fdf4' }
          }}
        >
          <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', mb: 2 }}>
            <AddRoundedIcon sx={{ color: '#10b981', fontSize: 30 }} />
          </Box>
          <Typography fontWeight="700" color="text.secondary">Create New</Typography>
        </Card>

        {/* Existing Quizzes */}
        {filteredQuizzes.map((quiz) => {
          const cardGradient = getGradient(quiz.title);
          const firstLetter = quiz.title.charAt(0).toUpperCase();
          return (
            <Card key={quiz.id} elevation={0} sx={{ borderRadius: 4, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', bgcolor: 'white', position: 'relative', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.15)' } }}>

              {/* --- ANIMATED GRADIENT HEADER --- */}
              <Box sx={{
                height: 80,
                background: cardGradient,
                backgroundSize: '400% 400%', // Increased size to allow movement
                animation: `${gradientAnimation} 8s ease infinite`, // Apply animation
                position: 'relative'
              }}>
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, quiz.id)} sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.1)', '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' } }}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ px: 2, mt: -3, mb: 1 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: 'white', color: '#334155', fontWeight: 900, fontSize: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '4px solid white' }}>{firstLetter}</Avatar>
              </Box>
              <Box sx={{ px: 3, pb: 2, flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 1, height: '2.4em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontSize: '1.1rem' }}>{quiz.title}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  <Chip icon={<FormatListBulletedRoundedIcon sx={{ fontSize: '1rem !important' }} />} label={`${quiz.questions.length} Qs`} size="small" sx={{ borderRadius: 1, bgcolor: '#f1f5f9', fontWeight: 600, color: '#64748b' }} />
                  <Chip icon={<AccessTimeFilledRoundedIcon sx={{ fontSize: '1rem !important' }} />} label={`${quiz.timeLimit}s`} size="small" sx={{ borderRadius: 1, bgcolor: '#f1f5f9', fontWeight: 600, color: '#64748b' }} />
                </Stack>
              </Box>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button variant="contained" fullWidth component={Link} href={`/quiz/${quiz.id}`} endIcon={<PlayArrowRoundedIcon />} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, bgcolor: '#1e293b', boxShadow: 'none', '&:hover': { bgcolor: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}>Start</Button>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', mt: 1, minWidth: 140 } }}>
        <MenuItem onClick={handleEdit} sx={{ fontSize: '0.9rem', py: 1, px: 2, fontWeight: 500 }}>Modify</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ef4444', fontSize: '0.9rem', py: 1, px: 2, fontWeight: 500 }}>Delete</MenuItem>
      </Menu>

      {/* Stats Dialog */}
      <Dialog open={statsOpen} onClose={() => setStatsOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pt: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <EmojiEventsRoundedIcon sx={{ color: '#F59E0B' }} />
            <Typography variant="h5">Your Performance</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={4} mt={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box sx={{ p: 3, bgcolor: '#eff6ff', borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="900" color="primary">{stats.totalPlayed}</Typography>
                <Typography variant="body2" fontWeight="600" color="text.secondary">Quizzes Completed</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: '#f0fdf4', borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="900" sx={{ color: '#16a34a' }}>{stats.avgAccuracy}%</Typography>
                <Typography variant="body2" fontWeight="600" color="text.secondary">Average Accuracy</Typography>
              </Box>
            </Box>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <HistoryRoundedIcon color="action" />
                <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
              </Stack>
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>No quizzes taken yet. Start one!</Typography>
              ) : (
                <Stack spacing={2} sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {history.slice(0, 5).map((h, i) => (
                    <Box key={i} sx={{ p: 2, border: '1px solid #f1f5f9', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography fontWeight="700">{h.quizTitle}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(h.timestamp).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip label={`${Math.round((h.score / h.totalQuestions) * 100)}%`} size="small" sx={{ fontWeight: 800, bgcolor: (h.score / h.totalQuestions) >= 0.5 ? '#dcfce7' : '#fee2e2', color: (h.score / h.totalQuestions) >= 0.5 ? '#166534' : '#991b1b' }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

    </Stack>
  );
}