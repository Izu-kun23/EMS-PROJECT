/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col } from "antd";

const EmployeeHome = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Link to="/employee_detail/${id}/employee_tasks/${id}">
            <Card title="Tasks" hoverable>
              View your tasks
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link to="/timesheets">
            <Card title="Timesheets" hoverable>
              View your timesheets
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Link to="/payslips">
            <Card title="Payslips" hoverable>
              View your payslips
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeHome;
