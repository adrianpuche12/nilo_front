import React, { useState, useEffect } from "react";
import {
  Container, Button, MenuItem, Select, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Grid
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import apiService from "../Services/apiService";
import { useAuth } from '../Auth/AuthContext';
import Navbar from "../NavBar";
import AdminNavbar from "../Admin/AdminNavbar";
import Footer from "../Footer";
import CRUDForm from "./CRUDForm";
import Title from "../Utiles/Title";
import { EditButton, DeleteButton } from '../Utiles/ActionButtons';

const ENTITY_OPTIONS = [
  { name: "Cities", endpoint: "/cities", defaultSchema: { name: "", description: "", province: "" } },
  { name: "Provinces", endpoint: "/provinces", defaultSchema: { name: "", description: "", country: "" } },
  { name: "Countries", endpoint: "/countries", defaultSchema: { name: "", description: "" } },
];

const CRUDManager = () => {
  const [currentEntity, setCurrentEntity] = useState(ENTITY_OPTIONS[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { roles } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(currentEntity.endpoint);
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${currentEntity.name}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentEntity]);

  const handleDelete = async (id) => {
    try {
      await apiService.remove(currentEntity.endpoint, id);
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${currentEntity.name}:`, error);
    }
  };

  return (
    <div>
      {roles.includes('admin') ? <AdminNavbar /> : <Navbar />}

      <Container maxWidth="lg" sx={{ paddingY: 2 }}>
        <Title text="CRUD Manager" variant="h4" />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Select
            value={currentEntity.name}
            onChange={(e) =>
              setCurrentEntity(
                ENTITY_OPTIONS.find((item) => item.name === e.target.value)
              )
            }
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              padding: { xs: '6px 8px', sm: '8px 12px' },
              borderRadius: 2,
              minWidth: 150,
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "#fff",
              '& .MuiSelect-icon': {
                color: "#fff",
              },
            }}
          >
            {ENTITY_OPTIONS.map((entity) => (
              <MenuItem key={entity.name} value={entity.name}>
                {entity.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            color="primary"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              padding: { xs: '6px 8px', sm: '8px 12px' },
              borderRadius: 2,
              minWidth: 150,
            }}
            onClick={() => {
              setEditingItem(null); // Asegúrar de que no haya un elemento en edición
              setIsFormOpen(true); // Abrir el formulario
            }}
          >
            Add New {currentEntity.name}
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {Object.keys(row).map((key) => (
                    <TableCell key={key}>
                      {typeof row[key] === "object" && row[key]?.name
                        ? row[key].name
                        : typeof row[key] === "object"
                        ? JSON.stringify(row[key])
                        : row[key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Grid container spacing={1}>
                      <Grid item>
                        <EditButton
                          onClick={() => {
                            setEditingItem(row);
                            setIsFormOpen(true);
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={() => handleDelete(row.id)}
                          color="error"
                          startIcon={<DeleteIcon />}
                        />
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {isFormOpen && (
          <CRUDForm
            entityName={currentEntity.name}
            endpoint={currentEntity.endpoint}
            item={editingItem}
            onClose={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
            refreshData={fetchData}
            defaultSchema={currentEntity.defaultSchema} 
          />
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default CRUDManager;
