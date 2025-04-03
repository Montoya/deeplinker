import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';

function BrowserForm({ setGeneratedUrl }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const stripProtocol = (url) => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
  };

  const onSubmit = (data) => {
    const cleanUrl = stripProtocol(data.url);
    setValue('url', cleanUrl);
    const url = `https://metamask.app.link/dapp/${cleanUrl}`;
    setGeneratedUrl(url);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="URL"
        fullWidth
        {...register('url', { 
          required: 'URL is required'
        })}
        error={!!errors.url}
        helperText={errors.url?.message || 'e.g., app.uniswap.org or revoke.cash'}
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        sx={{ mt: 2 }}
      >
        Generate Deeplink
      </Button>
    </Box>
  );
}

export default BrowserForm; 