import React from 'react';
import { Button } from '@mui/material';
import { Add, Close, Edit, ArrowForward, Delete } from '@mui/icons-material';
import PropTypes from 'prop-types';

// Botón Cerrar
export const CloseButton = ({ onClick, fullWidth, disabled, size = 'medium', ...props }) => (
    <Button
      variant="contained"
      color="error"
      onClick={onClick}
      startIcon={<Close />}
      fullWidth={fullWidth}
      disabled={disabled}
      size={size}
      sx={{
        fontWeight: 600,
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
          backgroundColor: 'error.dark',
        },
        ...props.sx
      }}
      {...props}
    >
      Cerrar
    </Button>
  );
  
  CloseButton.defaultProps = {
    fullWidth: false,
    disabled: false,
    size: 'medium'
  };

// Botón Editar
export const EditButton = ({ onClick, fullWidth, disabled, size = 'medium', ...props }) => (
  <Button
    variant="contained"
    color="primary"
    onClick={onClick}
    startIcon={<Edit />}
    fullWidth={fullWidth}
    disabled={disabled}
    size={size}
    {...props}
  >
    Editar
  </Button>
);

// Botón Eliminar
export const DeleteButton = ({ onClick, fullWidth, disabled, size = 'medium', ...props }) => (
  <Button
    variant="contained"
    color="error"
    onClick={onClick}
    startIcon={<Delete />}
    fullWidth={fullWidth}
    disabled={disabled}
    size={size}
    {...props}
  >
    Eliminar
  </Button>
);

// Botón Ver Más
export const ViewMoreButton = ({ onClick, fullWidth, disabled, size = 'medium', ...props }) => (
  <Button
    variant="contained"
    color="info"
    onClick={onClick}
    endIcon={<ArrowForward />}
    fullWidth={fullWidth}
    disabled={disabled}
    size={size}
    {...props}
  >
    Ver más
  </Button>
);

// Botón Crear
export const CreateButton = ({ 
  onClick, 
  fullWidth, 
  disabled, 
  size = 'medium', 
  componentName = '', 
  ...props 
}) => (
  <Button
    variant="contained"
    color="primary"
    onClick={onClick}
    startIcon={<Add />}
    fullWidth={fullWidth}
    disabled={disabled}
    size={size}
    {...props}
  >
    {`Crear${componentName ? ` ${componentName}` : ''}`}
  </Button>
);

// PropTypes para todos los botones
const commonPropTypes = {
  onClick: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

CloseButton.propTypes = commonPropTypes;
EditButton.propTypes = commonPropTypes;
DeleteButton.propTypes = commonPropTypes;
ViewMoreButton.propTypes = commonPropTypes;
CreateButton.propTypes = {
  ...commonPropTypes,
  componentName: PropTypes.string,
};

// Valores por defecto para todos los botones
const commonDefaultProps = {
  fullWidth: false,
  disabled: false,
  size: 'medium',
};

CloseButton.defaultProps = commonDefaultProps;
EditButton.defaultProps = commonDefaultProps;
DeleteButton.defaultProps = commonDefaultProps;
ViewMoreButton.defaultProps = commonDefaultProps;
CreateButton.defaultProps = {
  ...commonDefaultProps,
  componentName: '',
};

export default {
  CloseButton,
  EditButton,
  DeleteButton,
  ViewMoreButton,
  CreateButton,
};