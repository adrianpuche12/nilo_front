import React from 'react';
import { useNavigate } from 'react-router-dom';
import countries from '../../jsons/countries';

function Countries() {
  const navigate = useNavigate();

  const handleCountriesClick = (id) => {
    console.log(`Clicked on country with id: ${id}`);
    navigate(`/country-detail/${id}`);
  };

  return (
    <div>
      {countries.map((country) => (
        <div
          key={country.id}
          onClick={() => handleCountriesClick(country.id)}
          style={{ cursor: 'pointer', margin: '10px', padding: '10px', border: '1px solid #ccc' }}
        >
          <p>name: {country.name}</p>
          <p>description: {country.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Countries;
