import React from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme } from '@mui/material';

export const CardTitle = ({ text, align = 'left' }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="h6"
      sx={{
        fontSize: {
          xs: '1rem',
          sm: '1.2rem'
        },
        fontWeight: 600,
        color: theme.palette.text.primary,
        textAlign: align,
        mb: 1.5,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '100%'
      }}
    >
      {text}
    </Typography>
  );
};

export const CardSubtitle = ({ text, align = 'left' }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="subtitle2"
      sx={{
        fontSize: {
          xs: '0.875rem',
          sm: '1rem'
        },
        fontWeight: 500,
        color: theme.palette.text.secondary,
        textAlign: align,
        mb: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '100%'
      }}
    >
      {text}
    </Typography>
  );
};

export const CardDescription1 = ({ text, align = 'left' }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="body2"
      sx={{
        fontSize: {
          xs: '0.8rem',
          sm: '1.02rem'
        },
        color: theme.palette.text.primary,
        textAlign: align,
        mb: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        lineHeight: 1.4
      }}
    >
      {text}
    </Typography>
  );
};

export const CardDescription2 = ({ text, align = 'left' }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="body2"
      sx={{
        fontSize: {
          xs: '0.75rem',
          sm: '0.8rem'
        },
        color: theme.palette.text.secondary,
        textAlign: align,
        mb: 0.5,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        lineHeight: 1.3
      }}
    >
      {text}
    </Typography>
  );
};

const textPropTypes = {
  text: PropTypes.string.isRequired,
  align: PropTypes.oneOf(['left', 'center', 'right'])
};

CardTitle.propTypes = textPropTypes;
CardSubtitle.propTypes = textPropTypes;
CardDescription1.propTypes = textPropTypes;
CardDescription2.propTypes = textPropTypes;

