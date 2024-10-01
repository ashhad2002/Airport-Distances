import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { Airport } from './types';

interface Props {
  onSelect: (airport: Airport) => void;
  label: string;
}

const AirportAutoComplete: React.FC<Props> = ({ onSelect, label }) => {

  const [options, setOptions] = useState<Airport[]>([]);
  const handleSearch = async (query: string) => {
    const searchBy = query.length === 3 ? 'iata' : 'name';

    try {
      const response = await axios.get('https://airports-by-api-ninjas.p.rapidapi.com/v1/airports', {
        params: { [searchBy]: query, country: 'US' },
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
          'X-RapidAPI-Host': 'airports-by-api-ninjas.p.rapidapi.com',
        },
      });
      
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching airports:', error);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => `${option.name} (${option.iata || option.icao}) - ${option.city}`}
      onInputChange={(event, value) => handleSearch(value)}
      onChange={(event, value) => onSelect(value as Airport)}
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
    />
  );
};

export default AirportAutoComplete;
