import React, { useState } from 'react';
import { Container, Grid, Paper, Box, Tab, Tabs } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import BrowserForm from './components/BrowserForm';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setGeneratedUrl('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <h1>MetaMask Deeplink Generator</h1>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={currentTab} onChange={handleTabChange}>
                <Tab label="Open Browser" />
              </Tabs>
            </Box>
            
            <BrowserForm setGeneratedUrl={setGeneratedUrl} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <h3>Generated Deeplink</h3>
              {generatedUrl && (
                <>
                  <QRCodeSVG value={generatedUrl} size={200} />
                  <Box 
                    component="a" 
                    href={generatedUrl}
                    sx={{ 
                      wordBreak: 'break-all',
                      textAlign: 'center',
                      color: 'primary.main'
                    }}
                  >
                    {generatedUrl}
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App; 