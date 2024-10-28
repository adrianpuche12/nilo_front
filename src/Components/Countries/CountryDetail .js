import React from 'react';
import { useParams } from 'react-router-dom';
import countries from '../../jsons/countries';

const CountryDetail = () => {
    const { id } = useParams();
    const country = countries.find((country) => country.id === parseInt(id));

    if (!country) {
        return <p>País no encontrado</p>;
    }

    return (
        <div>
            <h2>{country.name}</h2>
            <p>{country.description}</p>
        </div>
    );
};

export default CountryDetail;
