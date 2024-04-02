/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    borderBottom: '1px solid #333',
    paddingBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

const EmployeePDF = ({ e }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Employee Information</Text>
          <Text style={styles.text}>Name: {e.name}</Text>
          <Text style={styles.text}>Email: {e.email}</Text>
          <Text style={styles.text}>Address: {e.address}</Text>
          <Text style={styles.text}>Salary: ${e.salary}</Text>
          <Text style={styles.text}>Password: {e.password}</Text>
          {/* Include other employee details as needed */}
        </View>
      </Page>
    </Document>
  );
};

export default EmployeePDF;
