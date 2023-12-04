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
      handleClickOpen();
    }
  };

  const [oQueClicou, setOQueClicou] = useState(0);

  const arrayToObjects = (data) => {
    const headers = data[0];
    let temp_arr = [];
    headers.forEach((header, index) => {
      if (index < 2) {
        temp_arr.push({ field: header, headerName: header, flex: 1 });
      }
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

  const [obj, setObj] = useState({});

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
        let temp_arr = [];

        Object.keys(data[0]).forEach((key) => {
          temp_arr.push({
            label: key,
            value: '5',
            name: key.trim(),
            handleChange: myHandleChange(),
          });
        });

        setInputs_dialog(temp_arr);
      })
      .catch(function (error) {
        console.error('Error during fetch operation:', error);
      });
  }, []);

  const myHandleChange = () => {
    console.log('Aqui');
  };

  const [inputs_dialog, setInputs_dialog] = useState([]);

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
              <Grid container spacing={2}>
                {inputs_dialog.map((item, index) => (
                  <Grid item key={index} xs={12}>
                    <TextField
                      label={item.label}
                      value={item.value}
                      type='text'
                      fullWidth
                      disabled
                      onChange={item.handleChange}
                      variant='outlined'
                    />
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Fechar</Button>
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
