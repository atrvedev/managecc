import { Layout, Menu, Breadcrumb } from "antd";
import React, { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  SnippetsOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  BankOutlined
} from "@ant-design/icons";
import BQLInfo from "./BQLInfo";
import ListChat from "./ListChat";
import ListComplain from "./ListComplain";
import ListNotification from "./ListNotification";
import ListAccountRegister from "./ListAccountRegister";
import ListCustomer from "./ListCustomer";
import ListMember from "./ListMember";
import ListNews from "./ListNews";
import ListServiceAgent from "./ListServiceAgent";
import ListRegisUse from "./ListRegisUse";
import ListShopping from "./ListShopping";
import ListBranchMarket from "./ListBranchMarket";
import ListCategoryMarket from "./ListCategoryMarket";
import ListBranchService from "./ListBranchService";
import ListCategoryService from "./ListCategoryService";
import ListAgent from "./ListAgent";
import ListBill from "./ListBill";
import ListBillCode from "./ListBillCode";
import ListBillSetting from "./ListBillSetting";
import ListBillImportExcel from "./ListBillImportExcel";
const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("BQL", "sub1", <UserOutlined />, [
    getItem("Thông tin", "1", <Link to="BQL/info"></Link>),
    getItem("Chat", "2", <Link to="BQL/chat"></Link>),
    getItem("Khiếu nại", "3", <Link to="BQL/complain"></Link>),
    getItem("Thông báo", "4", <Link to="BQL/notification"></Link>),
  ]),
  getItem("Căn hộ", "sub2", <HomeOutlined />, [
    getItem(
      "DS Đăng ký mới",
      "5",
      <Link to="apartment/accountregister"></Link>
    ),
    getItem("DS Dùng app", "6", <Link to="apartment/customer"></Link>),
    getItem("Nhân khẩu và tạm trú", "7", <Link to="apartment/member"></Link>),
  ]),
  getItem("Tin tức", "sub3", <SnippetsOutlined />, [
    getItem("DS Tin tức", "8", <Link to="news"></Link>),
  ]),
  getItem("Mua bán", "sub4", <ShoppingCartOutlined />, [
    getItem("DS Ngành", "9", <Link to="shop/listbranchmarket"></Link>),
    getItem("DS Danh mục", "10", <Link to="shop/listcategorymarket"></Link>),
    getItem("DS Mua bán", "11", <Link to="shop/listshopping"></Link>),
  ]),
  getItem("Tiện ích và dịch vụ", "sub5", <AppstoreOutlined />, [
    getItem("DS Tiện ích/Dịch vụ", "12", <Link to="service/listbranchservice"></Link>),
    getItem(
      "DS Danh mục",
      "13",
      <Link to="service/listcategoryservice"></Link>
    ),
    getItem("DS Đại lý", "14", <Link to="service/agent"></Link>),
    getItem("DS Sản phẩm", "15", <Link to="dichvu-tienich/cuadaily"></Link>),
    getItem(
      "Đăng ký sử dụng",
      "16",
      <Link to="dichvu-tienich/dangkysudung"></Link>
    ),
  ]),
  getItem("Thanh toán", "sub6", <BankOutlined />, [
    getItem("DS Thanh toán", "17", <Link to="bill/listbill"></Link>),
    getItem("DS Mã hóa đơn", "18", <Link to="bill/listbillcode"></Link>),
    getItem("DS Cài đặt thanh toán", "19", <Link to="bill/listbillsetting"></Link>),
    getItem("Tạo thanh toán Excel ", "20", <Link to="bill/importexcel"></Link>),
  ]),
];

const ItemBreadcrumb = (props) => {
  return (
    <Breadcrumb
      style={{
        margin: "16px 0",
      }}
    >
      {props.arr.map((item) => (
        <Breadcrumb.Item>
          {item.icon ? item.icon : null}
          <span> {item.name}</span>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

const nameUser = window.localStorage.getItem('name')

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
      }}
      className="site-layout-background"
    >
      <Sider
        className="site-layout-background"
        width={250}
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="logo" />
        <Menu
          // defaultSelectedKeys={["1"]}
          // defaultOpenKeys={["sub1", "sub2", "sub3", "sub4"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background flex flex-row justify-between items-center"
          style={{ padding: 0 }}
        >
          <div style={{ marginLeft: 20 }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </div>
          <div className="flex flex-row" style={{ marginRight: 20 }}>
            <div className="flex flex-col justify-around mr-3 ">
              <p className="font-bold  leading-3	text-[#ff3301]">Chào {nameUser}</p>
              <Link to="/" onClick={() => {
                  window.localStorage.setItem('token', '')
                  window.localStorage.setItem('name', '')
              }}>
              <p className="font-light leading-3 text-end ">Đăng xuất</p>
              </Link>
   
            </div>
            <div>
              <img alt="logo" src={require("./../Boy.png")} width={50} height={50} />
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "0px 16px",
          }}
        >
          <Routes>
            <Route
              path="BQL/info"
              element={
                <ItemBreadcrumb
                  arr={[
                    { name: "BQL", icon: <UserOutlined />, path: "/" },
                    { name: "Thông tin", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="BQL/chat"
              element={
                <ItemBreadcrumb
                  arr={[
                    { name: "BQL", icon: <UserOutlined />, path: "/" },
                    { name: "Chat", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="BQL/complain"
              element={
                <ItemBreadcrumb
                  arr={[
                    { name: "BQL", icon: <UserOutlined />, path: "/" },
                    { name: "Khiếu nại", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="BQL/notification"
              element={
                <ItemBreadcrumb
                  arr={[
                    { name: "BQL", icon: <UserOutlined />, path: "/" },
                    { name: "Thông báo", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="apartment/accountregister"
              element={
                <ItemBreadcrumb
                  arr={[
                    { name: "Căn hộ", icon: <HomeOutlined />, path: "/" },
                    { name: "Danh sách đăng ký mới", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="apartment/customer"
              element={
                <ItemBreadcrumb
                  arr={[
                    { name: "Căn hộ", icon: <HomeOutlined />, path: "/" },
                    { name: "Danh sách Đăng ký dùng App", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="apartment/member"
              element={
                <ItemBreadcrumb
                  arr={[
                    { name: "Căn hộ", icon: <HomeOutlined />, path: "/" },
                    { name: "Nhân khẩu và tạm trú", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="news"
              element={
                <ItemBreadcrumb
                  arr={[
                    { name: "Tin tức", icon: <SnippetsOutlined />, path: "/" },
                    { name: "Danh sách Tin tức", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="dichvu-tienich/cuadaily"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Tiện ích và dịch vụ",
                      icon: <AppstoreOutlined />,
                      path: "/",
                    },
                    { name: "DS Sản phẩm", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="dichvu-tienich/dangkysudung"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Tiện ích và dịch vụ",
                      icon: <AppstoreOutlined />,
                      path: "/",
                    },
                    { name: "Đăng ký sử dụng", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="shop/listshopping"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Mua bán",
                      icon: <ShoppingCartOutlined />,
                      path: "/",
                    },
                    { name: "Danh sách mua bán", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="shop/listbranchmarket"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Mua bán",
                      icon: <ShoppingCartOutlined />,
                      path: "/",
                    },
                    { name: "Danh sách Ngành", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="shop/listcategorymarket"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Mua bán",
                      icon: <ShoppingCartOutlined />,
                      path: "/",
                    },
                    { name: "Danh sách Danh mục", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="service/listbranchservice"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Tiện ích và dịch vụ",
                      icon: <AppstoreOutlined />,
                      path: "/",
                    },
                    { name: "Danh sách Tiện ích/Dịch vụ", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="service/listcategoryservice"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Tiện ích và dịch vụ",
                      icon: <AppstoreOutlined />,
                      path: "/",
                    },
                    { name: "Danh sách Danh mục", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="service/agent"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Tiện ích và dịch vụ",
                      icon: <AppstoreOutlined />,
                      path: "/",
                    },
                    { name: "Danh sách Đại lý", path: "/" },
                  ]}
                />
              }
            />
             <Route
              path="bill/listbill"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Thanh toán",
                      icon: <BankOutlined />,
                      path: "/",
                    },
                    { name: "Danh sách Thanh toán", path: "/" },
                  ]}
                />
              }
            />
             <Route
              path="bill/listbillcode"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Thanh toán",
                      icon: <BankOutlined />,
                      path: "/",
                    },
                    { name: "Danh sách Mã hóa đơn", path: "/" },
                  ]}
                />
              }
            />
             <Route
              path="bill/listbillsetting"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Thanh toán",
                      icon: <BankOutlined />,
                      path: "/",
                    },
                    { name: "Danh sách Cài đặt thanh toán", path: "/" },
                  ]}
                />
              }
            />
            <Route
              path="bill/importexcel"
              element={
                <ItemBreadcrumb
                  arr={[
                    {
                      name: "Thanh toán",
                      icon: <BankOutlined />,
                      path: "/",
                    },
                    { name: "Tạo thanh toán Excel", path: "/" },
                  ]}
                />
              }
            />
          </Routes>

          <Routes>
            <Route path="BQL/info" element={<BQLInfo />} />
            <Route path="BQL/chat" element={<ListChat />} />
            <Route path="BQL/notification" element={<ListNotification />} />
            <Route path="BQL/complain" element={<ListComplain />} />
            <Route
              path="apartment/accountregister"
              element={<ListAccountRegister />}
            />
            <Route path="apartment/customer" element={<ListCustomer />} />
            <Route path="apartment/member" element={<ListMember />} />
            <Route path="news" element={<ListNews />} />
            <Route
              path="dichvu-tienich/cuadaily"
              element={<ListServiceAgent />}
            />
            <Route
              path="dichvu-tienich/dangkysudung"
              element={<ListRegisUse />}
            />
            <Route path="shop/listshopping" element={<ListShopping />} />
            <Route
              path="shop/listbranchmarket"
              element={<ListBranchMarket />}
            />
            <Route
              path="shop/listcategorymarket"
              element={<ListCategoryMarket />}
            />
            <Route
              path="service/listbranchservice"
              element={<ListBranchService />}
            />
            <Route
              path="service/listcategoryservice"
              element={<ListCategoryService />}
            />
             <Route
              path="service/agent"
              element={<ListAgent />}
            />
             <Route
              path="bill/listbill"
              element={<ListBill />}
            />
             <Route
              path="bill/listbillcode"
              element={<ListBillCode />}
            />
                  <Route
              path="bill/listbillsetting"
              element={<ListBillSetting />}
            />
            <Route
              path="bill/importexcel"
              element={<ListBillImportExcel />}
            />
            <Route path="/" element={<Navigate replace to="BQL/info" />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
