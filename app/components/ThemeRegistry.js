// app/components/ThemeRegistry.js
'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

const theme = createTheme({
    typography: {
        fontFamily: 'inherit',
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    palette: {
        primary: { main: '#10b981', dark: '#059669', contrastText: '#fff' },
        secondary: { main: '#3b82f6' },
        background: { default: '#f8fafc', paper: '#ffffff' },
        text: { primary: '#1e293b', secondary: '#64748b' },
    },
    shape: {
        borderRadius: 8, // <--- CHANGED: Reduced from 16 to 8 for a sharper look
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // <--- CHANGED: Matching buttons
                    boxShadow: 'none',
                    '&:hover': { boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // Cards can be slightly rounder than buttons
                }
            }
        }
    },
});

export default function ThemeRegistry({ children }) {
    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}