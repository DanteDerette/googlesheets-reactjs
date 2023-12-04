import TabelaSomenteLeitura from './TabelaSomenteLeitura';
import './App.css';
import { Grid, Paper } from '@mui/material';

function App() {
  return (
    <Grid container spacing={2} sx={{ p: 1 }}>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <TabelaSomenteLeitura />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
