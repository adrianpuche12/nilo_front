// src/Components/MainComponents/index.js
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, useTheme } from '@mui/material';

export const MainTitle = ({ text, align = 'left', variant = 'h4', gutterBottom = true }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant={variant}
      component="h1"
      gutterBottom={gutterBottom}
      sx={{
        fontSize: {
          xs: '1.75rem',
          sm: '2rem',
          md: '2.25rem'
        },
        fontWeight: 700,
        color: theme.palette.text.primary,
        textAlign: align,
        mb: 3,
        letterSpacing: '-0.01em',
        lineHeight: 1.2
      }}
    >
      {text}
    </Typography>
  );
};

export const MainSubtitle = ({ text, align = 'left', color = 'primary', gutterBottom = true }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="h5"
      component="h2"
      gutterBottom={gutterBottom}
      sx={{
        fontSize: {
          xs: '1.25rem',
          sm: '1.5rem',
          md: '1.75rem'
        },
        fontWeight: 600,
        color: color === 'text' ? theme.palette.text.primary : theme.palette[color]?.main || theme.palette.primary.main,
        textAlign: align,
        mb: 2,
        letterSpacing: '0.01em',
        lineHeight: 1.3
      }}
    >
      {text}
    </Typography>
  );
};

export const MainDescription1 = ({ text, align = 'left', gutterBottom = true }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="body1"
      gutterBottom={gutterBottom}
      sx={{
        fontSize: {
          xs: '1rem',
          sm: '1.1rem',
          md: '1.25rem'
        },
        color: theme.palette.text.primary,
        textAlign: align,
        mb: 2,
        lineHeight: 1.6,
        maxWidth: '800px',
        margin: align === 'center' ? 'auto' : undefined
      }}
    >
      {text}
    </Typography>
  );
};

export const MainDescription2 = ({ text, align = 'left', gutterBottom = true }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="body2"
      gutterBottom={gutterBottom}
      sx={{
        fontSize: {
          xs: '0.875rem',
          sm: '1rem',
          md: '1.1rem'
        },
        color: theme.palette.text.secondary,
        textAlign: align,
        mb: 1.5,
        lineHeight: 1.5,
        maxWidth: '700px',
        margin: align === 'center' ? 'auto' : undefined
      }}
    >
      {text}
    </Typography>
  );
};

export const MainSection = ({ children, spacing = 3, align = 'left' }) => {
  return (
    <Box
      component="section"
      sx={{
        marginTop: spacing * 2,
        marginBottom: spacing * 3,
        textAlign: align,
        '& > *:not(:last-child)': {
          marginBottom: spacing * 2
        }
      }}
    >
      {children}
    </Box>
  );
};

// PropTypes
const textPropTypes = {
  text: PropTypes.string.isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  gutterBottom: PropTypes.bool
};

MainTitle.propTypes = {
  ...textPropTypes,
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
};

MainSubtitle.propTypes = {
  ...textPropTypes,
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success', 'text'])
};

MainDescription1.propTypes = textPropTypes;
MainDescription2.propTypes = textPropTypes;

MainSection.propTypes = {
  children: PropTypes.node.isRequired,
  spacing: PropTypes.number,
  align: PropTypes.oneOf(['left', 'center', 'right'])
};

export default {
  MainTitle,
  MainSubtitle,
  MainDescription1,
  MainDescription2,
  MainSection
};