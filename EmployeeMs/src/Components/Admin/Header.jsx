import React from "react";
import { Layout, Button, Input, Avatar } from "antd";
import { MenuUnfoldOutlined } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { UserOutlined } from '@ant-design/icons';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';

const { Header } = Layout;

const CustomHeader = ({ handleLogout }) => {
  return (
    <Header className="site-layout-background" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#fff",
      padding: '0 20px',
    }}>
      <Button
        type="primary"
        icon={<MenuUnfoldOutlined />}
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
        <span style={{ marginLeft: "8px", marginRight: "24px" }}>
        </span>
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
  );
};

export default CustomHeader;
