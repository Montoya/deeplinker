import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';

function BrowserForm({ setGeneratedUrl }) {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();

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
      <fieldset>
        <legend>Examples</legend>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            onClick={() => setValue('url', 'portfolio.metamask.io/card')} 
          >
            Card Dashboard
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setValue('url', 'app.aave.com')} 
          >
            Aave App
          </Button>
        </Box>
      </fieldset>

      <Controller
        name="url"
        control={control}
        defaultValue="" // Set default value
        rules={{ required: 'URL is required' }} // Validation rules
        render={({ field }) => (
          <TextField
            //inputRef={urlInputRef} // Attach the ref to the TextField
            label="URL"
            fullWidth
            {...field} // Spread the field props
            error={!!errors.url}
            helperText={errors.url?.message || 'e.g., linea.build or revoke.cash'}
          />
        )}
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