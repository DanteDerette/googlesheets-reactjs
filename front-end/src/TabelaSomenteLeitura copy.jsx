import { DataGrid, GridSearchIcon } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';

export default function TabelaSomenteLeitura() {
  const [columns, setColumns] = useState([]);

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [filterText, setFilterText] = useState('');

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const rowReader = () => {
    if (oQueClicou != 0) {
      console.log('Aqui');
    }
  };

  const [oQueClicou, setOQueClicou] = useState(0);

  const arrayToObjects = (data) => {
    const headers = data[0];
    let temp_arr = [];
    headers.forEach((header) => {
      temp_arr.push({ field: header, headerName: header, flex: 1 });
    });
    setColumns(temp_arr);
    const objectsArray = data.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    return objectsArray;
  };

  useEffect(() => {
    let minhaUrl =
      'https://script.google.com/macros/s/AKfycbx7gvxTAmMm-FERLMQoEWwZkietvayV7zhTWnlSlbP5Keg1buZNXtMRTGI-DAcLBLbrYg/exec?';
    let qualFuncao = 'qualFuncao=read';
    let requestURL = minhaUrl + qualFuncao;

    fetch(requestURL)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then(function (data) {
        data = arrayToObjects(JSON.parse(data));
        setRows(data);
      })
      .catch(function (error) {
        console.error('Error during fetch operation:', error);
      });
  }, []);

  const handleRowClick = (params) => {
    setOQueClicou(params.row.id);
  };

  return (
    <Grid container item sx={{ p: 2 }}>
      <Grid item xs={12} sx={{ p: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid
              container
              item
              justify='center'
              flexDirection={'row'}
              alignItems='center'
            >
              <Button
                variant='outlined'
                color='primary'
                sx={{ mr: 1 }}
                startIcon={<AddIcon />}
                onClick={() => handleClickOpen()}
              >
                Novo
              </Button>
              <Button
                variant='outlined'
                startIcon={<EditIcon />}
                sx={{ mr: 1 }}
              >
                Alterar
              </Button>
              <Button
                variant='outlined'
                startIcon={<PreviewIcon />}
                onClick={() => rowReader()}
              >
                Visualizar
              </Button>
            </Grid>
          </Grid>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Formulário</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Email Address'
                type='email'
                fullWidth
                variant='standard'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleClose}>Subscribe</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <TextField
        label=''
        variant='outlined'
        fullWidth
        value={filterText}
        sx={{ p: 1 }}
        onChange={(e) => setFilterText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <GridSearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <DataGrid
        sx={{ p: 1, m: 1 }}
        rows={filterText === '' ? rows : filteredRows}
        columns={columns}
        onRowClick={handleRowClick}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </Grid>
  );
}
