import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TextField from "@material-ui/core/TextField";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Link from "@material-ui/core/Link";
import Events from "../jsonData"; // scraped data from web scraper. Imported this way until I can get the scraper to work as a server.
import './EventsTable.css';

const columns = [
  { id: "eventTitle", label: "Event", minWidth: 170 },
  { id: "eventPage", label: "Event Page", minWidth: 170 },
  { id: "eventLocation", label: "Location", minWidth: 170 },
  { id: "eventAddress", label: "Address", minWidth: 170 },
  { id: "eventDate", label: "Date", minWidth: 170 },
];

const useStyles = makeStyles({
  root: {
    width: "90%",
  },
  container: {
    maxHeight: 520,
  },
});

const searchTable = (event, searchTerm) => { // function to allow the table to be searchable later used in useEffect
  const cleanedTerm = searchTerm.toLowerCase();
  return (
    event.eventTitle.toLowerCase().includes(cleanedTerm) ||
    event.eventLocation.toLowerCase().includes(cleanedTerm) ||
    event.eventAddress.toLowerCase().includes(cleanedTerm) ||
    event.eventDate.toLowerCase().includes(cleanedTerm)
  );
};

const EventsTable = (props) => {
  const classes = useStyles();
  const {searchResults, setSearchResults} = props
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = Events.filter(e => e.eventAddress); // filtering out the events without an address listed on event page

  useEffect(() => { // setting the the list of events based on the searched term
    if(!searchTerm) setSearchResults(filteredEvents);
    setSearchResults(filteredEvents.filter(e => searchTable(e, searchTerm)));
  }, []);

  const handleChangePage = (event, newPage) => { // pagination page change
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => { // function to change visible table rows from 5 to 10 or 15
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TextField id="tableSearch" label="Search Events" variant="outlined" onChange={(e) => setSearchTerm(e.target.value)} /> 
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => ( // mapping through columns array to place table head cells
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {searchResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => { // maps through events to place on table and creates pagination numbers
              return (
                <TableRow hover tabIndex={-1} key={event.eventTitle}>
                  {columns.map((column) => {
                    const value = event[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'eventPage' ? <Link href={value} target='blank'>Visit Indy Event Page</Link> : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={searchResults.length} // gives count of events e.g. (1-5 of 48)
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </Paper>
  );
};

export default EventsTable;