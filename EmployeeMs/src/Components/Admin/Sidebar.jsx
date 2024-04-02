import React from "react";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider trigger={null} collapsible collapsed={true}>
      <div className="logo-container">
        <img className="logo-collapsed" src="/Images/logopic.png" alt="Logo" />
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <span>Dashboard</span>
        </Menu.Item>
        <Menu.Item key="2">
          <span>Manage Employees</span>
        </Menu.Item>
        <Menu.Item key="3">
          <span>Category</span>
        </Menu.Item>
        <Menu.Item key="4">
          <span>Tasks</span>
        </Menu.Item>
        <Menu.Item key="5">
          <span>Appointments</span>
        </Menu.Item>
        <Menu.Item key="6">
          <span>Manage Users</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
