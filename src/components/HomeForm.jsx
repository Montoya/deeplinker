import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

function HomeForm({ setGeneratedUrl }) {
  // Generate deeplink on component mount
  useEffect(() => {
    const url = 'https://link.metamask.io/home';
    setGeneratedUrl(url);
  }, [setGeneratedUrl]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body1" color="text.secondary">
        This link opens the mobile app home screen.
      </Typography>
    </Box>
  );
}

export default HomeForm;
