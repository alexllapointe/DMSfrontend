import { useState } from "react";
import { TextField, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Box from '@mui/material/Box';

export default function SearchWithFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Mock search results
    const mockResults = [
      { id: 1, name: "Result One", category: "A" },
      { id: 2, name: "Result Two", category: "B" },
      { id: 3, name: "Result Three", category: "A" },
    ];

    const filteredResults = mockResults.filter((item) =>
      filter === "all" ? item.name.includes(searchTerm) : item.category === filter && item.name.includes(searchTerm)
    );
    
    setResults(filteredResults);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div className="flex gap-2 mb-4" style={{ padding: "10px" , width: "100%"}}>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',}}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
            sx={{ padding: "10px" }} // Add padding to the TextField
          />
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            variant="outlined"
            className="w-32"
             // Add padding to the Select
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="A">Category A</MenuItem>
            <MenuItem value="B">Category B</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{padding: "15px"}}
             // Add padding to the Button
          >
            Search
          </Button>
          </Box>
        </div>
        
        <TableContainer component={Paper} sx={{ width: '100%', maxWidth: 900 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.length > 0 ? (
                results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.id}</TableCell>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.category}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">No results found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
