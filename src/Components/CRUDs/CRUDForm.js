import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import apiService from "../Services/apiService";
import { useAuth } from "../Auth/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;

const getAxiosConfig = (accessToken) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const fetchProvinces = async (accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/provinces`, getAxiosConfig(accessToken));
    return response.data;
  } catch (err) {
    throw new Error("Error al cargar las provincias: " + err.message);
  }
};

const fetchCountriesByProvince = async (provinceId, accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/countries?provinceId=${provinceId}`, getAxiosConfig(accessToken));
    return response.data;
  } catch (err) {
    throw new Error("Error al cargar los países: " + err.message);
  }
};

const fetchCitiesByCountry = async (countryId, accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/cities?countryId=${countryId}`, getAxiosConfig(accessToken));
    return response.data;
  } catch (err) {
    throw new Error("Error al cargar las ciudades: " + err.message);
  }
};

// Implementación de fetchCountries
const fetchCountries = async (accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/countries`, getAxiosConfig(accessToken));
    return response.data;
  } catch (err) {
    throw new Error("Error al cargar los países: " + err.message);
  }
};

const CRUDForm = ({
  entityName,
  endpoint,
  item,
  onClose,
  refreshData,
  defaultSchema,
}) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (item) {
      setFormData(item);

      if (item.province) {
        setLoading(true);
        fetchCountriesByProvince(item.province.id, accessToken)
          .then((data) => {
            setCountries(data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      }
    } else if (defaultSchema) {
      setFormData({ ...defaultSchema });
    }

    if (entityName === "Cities") {
      setLoading(true);
      fetchProvinces(accessToken)
        .then((data) => {
          setProvinces(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else if (entityName === "Provinces") {
      setLoading(true);
      fetchCountries(accessToken)
        .then((data) => {
          setCountries(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [item, defaultSchema, entityName, accessToken]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "province" && entityName === "Cities") {
      setLoading(true);
      fetchCountriesByProvince(value, accessToken)
        .then((data) => {
          setCountries(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }

    if (name === "country" && entityName === "Provinces") {
      setLoading(true);
      fetchCitiesByCountry(value, accessToken)
        .then((data) => {
          setCities(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  const handleSubmitCities = async (event) => {
    event.preventDefault();
    try {
      const dataToSend = {
        id: formData.id || null,
        name: formData.name,
        description: formData.description,
        province: {
          id: formData.province,
          name: provinces.find((province) => province.id === formData.province)?.name,
          description: provinces.find((province) => province.id === formData.province)?.description,
          country: {
            id: formData.country,
            name: countries.find((country) => country.id === formData.country)?.name,
            description: countries.find((country) => country.id === formData.country)?.description,
            cities: cities.filter(city => city.country.id === formData.country),
          },
        },
      };

      if (item) {
        await apiService.update(endpoint, item.id, dataToSend, accessToken);
      } else {
        await apiService.create(endpoint, dataToSend, accessToken);
      }

      refreshData();
      onClose();
    } catch (error) {
      setError(`Error al guardar ${entityName}: ${error.message}`);
    }
  };

  const handleSubmitProvinces = async (event) => {
    event.preventDefault();
    
    try {
      const dataToSend = {
        id: formData.id || null,
        name: formData.name,
        description: formData.description,
        country: {
          id: formData.country,
          name: countries.find((country) => country.id === formData.country)?.name,
          description: countries.find((country) => country.id === formData.country)?.description,
        },
      };
  
      if (item) {
        await apiService.update(endpoint, item.id, dataToSend, accessToken);
      } else {
        await apiService.create(endpoint, dataToSend, accessToken);
      }
  
      refreshData();
      onClose();
    } catch (error) {
      setError(`Error al guardar la provincia: ${error.message}`);
    }
  };
  

  const excludedFields = ["id", "createdAt", "updatedAt"];

  return (
    <>
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>{item ? `Edit ${entityName}` : `Add New ${entityName}`}</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : Object.keys(formData).length > 0 ? (
            Object.keys(formData)
              .filter((key) => !excludedFields.includes(key))
              .map((key) => {
                const value = formData[key];
                const displayValue =
                  typeof value === "object" && value !== null ? value.name || "" : value;

                if (key === "province" && entityName === "Cities") {
                  return (
                    <FormControl fullWidth margin="normal" key={key}>
                      <InputLabel>Province</InputLabel>
                      <Select name={key} value={formData.province || ""} onChange={handleChange}>
                        {provinces.map((province) => (
                          <MenuItem key={province.id} value={province.id}>
                            {province.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                if (key === "country" && entityName === "Provinces") {
                  return (
                    <FormControl fullWidth margin="normal" key={key}>
                      <InputLabel>Country</InputLabel>
                      <Select name={key} value={formData.country || ""} onChange={handleChange}>
                        {countries.map((country) => (
                          <MenuItem key={country.id} value={country.id}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                return (
                  <TextField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value={displayValue || ""}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                );
              })
          ) : (
            <p>No fields available to display. Please provide a defaultSchema.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={(event) => {
              if (entityName === "Provinces") {
                handleSubmitProvinces(event); 
              } else if (entityName === "Cities") {
                handleSubmitCities(event); 
              } else {
                handleSubmitCities(event); 
              }
            }}
            color="primary"
          >
            {item ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      {error && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default CRUDForm;
