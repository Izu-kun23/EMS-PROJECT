/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link, Outlet } from "react-router-dom";
import { Layout, Menu, Button, Input, Avatar } from "antd";
import MenuFoldOutlined from "@mui/icons-material/MenuOpen";
import MenuUnfoldOutlined from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddTaskIcon from "@mui/icons-material/AddTask";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { UserOutlined } from "@ant-design/icons";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const { Header, Sider, Content, Footer } = Layout;

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/employee/detail/${id}`);
        if (response.data.length > 0) {
          setEmployee(response.data[0]);
        } else {
          console.error("No employee found with the provided id");
        }
      } catch (error) {
        console.error("Error fetching employee detail:", error);
      }
    };

    fetchEmployeeDetail();
  }, [id]);

  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  const [collapsed, setCollapsed] = useState(false);

  const DashboardFooter = () => (
    <Footer style={{ textAlign: 'center', background: '#001529', color: 'white' }}>

      <div>
        © 2024 Calaya Engineering Services Limited. All rights reserved.
      </div>
    </Footer>
  );
  

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo-container">
          <img
            className={collapsed ? "logo-collapsed" : "logo"}
            src="/Images/logopic.png"
            alt="Logo"
          />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<DashboardIcon />}>
            <Link to={`/employee_detail/${id}`}>Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu key="sub2" icon={<ListAltIcon />} title="Tasks">
            <Menu.Item key="2" icon={<ListAltIcon />}>
              <Link to={`/employee_detail/${id}/employee_tasks/${id}`}>
                View Tasks
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="sub3" icon={<EventIcon />} title="Timesheets">
            <Menu.Item key="3" icon={<AddTaskIcon />}>
              <Link to={`/employee_detail/${id}/employee_add_timesheet/${id}`}>Submit Timesheet</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<AddTaskIcon />}>
              <Link to={`/employee_detail/${id}/employee_timesheet/${id}`}>View Timesheets</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="sub4" icon={<AttachMoneyIcon />} title="Income">
            <Menu.Item key="5" icon={<AttachMoneyIcon />}>
              <Link to={`/employee_detail/${id}/employee_pay/${id}`}>View Payslip</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="6" icon={<DashboardIcon />}>
            <Link to={`/employee_detail/${id}/profile_page/${id}`}>Profile</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fff",
            padding: "0 20px",
          }}
        >
          <Button
            type="primary"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
          <Input
            prefix={<SearchIcon />}
            placeholder="Search for..."
            style={{ maxWidth: "500px" }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Badge badgeContent={10} color="primary">
              <MailIcon color="action" />
            </Badge>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#87d068", marginLeft: "8px" }}
            />
            <Button
              type="primary"
              icon={<ExitToAppIcon />}
              onClick={handleLogout}
              style={{ marginLeft: "auto" }}
            >
              Sign out
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>

        <DashboardFooter />
      </Layout>
    </Layout>
  );
};

export default EmployeeDetail;
