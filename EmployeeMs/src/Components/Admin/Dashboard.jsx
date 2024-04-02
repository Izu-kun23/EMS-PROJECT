
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Input, Avatar } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import CategoryIcon from "@mui/icons-material/Category";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddTaskIcon from "@mui/icons-material/AddTask";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { UserOutlined } from "@ant-design/icons";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import axios from "axios";
import "./style.css";

const { Header, Sider, Content, Footer } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/auth/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const DashboardFooter = () => (
    <Footer style={{ textAlign: 'center', background: '#001529', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px' }}>
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
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="sub1"
            icon={<GroupIcon />}
            title="Manage Employees"
          >
            <Menu.Item key="2" icon={<AddTaskIcon />}>
              <Link to="/dashboard/add_employee">Add Employee</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ListAltIcon />}>
              <Link to="/dashboard/employee">View Employees</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<ListAltIcon />}>
              <Link to="/dashboard/add_attendance">Attendance</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<ListAltIcon />}>
              <Link to="/dashboard/timesheet">Timesheet</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="6" icon={<CategoryIcon />}>
            <Link to="/dashboard/category">Category</Link>
          </Menu.Item>
          <Menu.SubMenu key="sub2" icon={<ListAltIcon />} title="Tasks">
            <Menu.Item key="7" icon={<AddTaskIcon />}>
              <Link to="/dashboard/add_task">Add Task</Link>
            </Menu.Item>
            <Menu.Item key="8" icon={<ListAltIcon />}>
              <Link to="/dashboard/tasks">View Tasks</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="sub3" icon={<EventIcon />} title="Appointments">
            <Menu.Item key="9" icon={<AddTaskIcon />}>
              <Link to="/dashboard/add_appointments">Schedule Employee</Link>
            </Menu.Item>
            <Menu.Item key="10" icon={<ListAltIcon />}>
              <Link to="/dashboard/appointments">View Appointments</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="11" icon={<GroupIcon />}>
            <Link to="/dashboard/users">Manage Users</Link>
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

            <span style={{ marginLeft: "8px", marginRight: "24px" }}></span>
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

export default Dashboard;
