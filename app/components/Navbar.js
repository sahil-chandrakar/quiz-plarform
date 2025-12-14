// app/components/Navbar.js
'use client';
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, Box, IconButton, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger Icon
import AddIcon from '@mui/icons-material/Add';

export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                color: '#1e293b',
                top: 0,
                zIndex: 100
            }}
        >
            <Toolbar sx={{ height: 70, maxWidth: '1200px', width: '100%', mx: 'auto' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">

                    {/* Brand Logo */}
                    <Stack direction="row" alignItems="center" spacing={1.5} component={Link} href="/" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                        <Box sx={{
                            width: 38,
                            height: 38,
                            bgcolor: 'primary.main',
                            borderRadius: '8px', // Sharper border radius
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                        }}>
                            <PsychologyIcon fontSize="small" />
                        </Box>
                        <Typography variant="h6" sx={{ letterSpacing: '-0.5px', background: 'linear-gradient(45deg, #10b981, #3b82f6)', backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
                            Modern Quiz
                        </Typography>
                    </Stack>

                    {/* DESKTOP VIEW: Button is visible */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            href="/create"
                            startIcon={<AddCircleIcon />}
                            sx={{
                                px: 3,
                                py: 1,
                                fontSize: '0.9rem',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            }}
                        >
                            Create New Quiz
                        </Button>
                    </Box>

                    {/* MOBILE VIEW: Hamburger Menu is visible */}
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <IconButton
                            onClick={handleMenuClick}
                            sx={{ color: 'primary.main' }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            PaperProps={{
                                elevation: 4,
                                sx: {
                                    mt: 1.5,
                                    borderRadius: 2,
                                    minWidth: 180,
                                    border: '1px solid #f1f5f9'
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem
                                component={Link}
                                href="/create"
                                onClick={handleMenuClose}
                                sx={{ gap: 1.5, py: 1.5, fontWeight: 600, color: '#059669' }}
                            >
                                <AddIcon fontSize="small" />
                                Create New Quiz
                            </MenuItem>
                        </Menu>
                    </Box>

                </Stack>
            </Toolbar>
        </AppBar>
    );
}