import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  message,
  Upload,
  Space,
  Radio,
  Pagination,
} from "antd";
import { dateFormat, priceFormat } from "../utils";
import APIService from "../service/APIService";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const ListBillCode = () => {
  const columns = [
    {
      title: "STT",
      dataIndex: "Stt",
      width: 70,
      dataIndex: "id",
      render: (data, data1, index) => (
        <p>{index + 1 + (currentPage - 1) * 10}</p>
      ),
    },
    {
      title: "Tên hóa đơn",
      dataIndex: "name",
      width: 280,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Loại hóa đơn",
      dataIndex: "billing_type",
      width: 130,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      width: 130,
      render: (name, data1, index) => (
        <p className="line-clamp-2 text-black">{name}</p>
      ),
    },
    {
      title: "Căn hộ",
      dataIndex: "apartment_code",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "bill_code",
      width: 120,
      render: (stringTime) => {
        return <p>{stringTime}</p>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "create_date",
      width: 130,
      render: (create_date, data1, index) => (
        <p className="line-clamp-2 text-black">{dateFormat(create_date)}</p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (status) => {
        let status_string = "";
        switch (status) {
          case 0:
            status_string = "Ẩn";
            break;
          case 1:
            status_string = "Hiện";
            break;
          default:
            status_string = status;
            break;
        }
        return <p>{status_string}</p>;
      },
    },

    {
      title: "Thao tác",
      fixed: "right",
      dataIndex: "id",
      width: 240,
      render: (id, data1) => {
        return (
          <>
            <Button
              style={{
                backgroundColor: "#2fcc61",
                alignItems: "center",
                color: "white",
                fontWeight: "bold",
                marginRight: 10,
              }}
              onClick={() => {
                searchCustomer(data1.phone, true);
                setInfoBillCode(data1);
                setModal(true);
              }}
            >
              Cập nhật
            </Button>
            <Button
              style={{
                fontWeight: "bold",
              }}
              onClick={() => {
                info(data1);
              }}
            >
              Trạng thái
            </Button>
          </>
        );
      },
    },
  ];

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [apartment, setApartment] = useState("");
  const [type, setType] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModal, setModal] = useState(false);
  const [infoBillCode, setInfoBillCode] = useState({});
  const [listBillType, setListBillType] = useState([]);
  const [listSearchCustomer, setListSearchCustomer] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState("");

  const info = (data1) => {
    Modal.info({
      title: "Cập nhật trạng thái",
      icon: undefined,
      closable: true,
      content: (
        <div className="flex flex-col">
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 0)}
          >
            Ẩn
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 1)}
          >
            Hiện
          </Button>
        </div>
      ),
      okButtonProps: { style: { display: "none" } },
    });
  };

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateStatusBillingCode(id, status);
      if (data) {
        getListBillCode();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addBillCode() {
    try {
      const data = await APIService.addBillCode(
        infoBillCode.name,
        infoBillCode.description,
        infoBillCode.apartment_code,
        infoBillCode.billing_type_id,
        infoBillCode.phone,
        infoBillCode.billing_code
      );
      if (data) {
        setInfoBillCode({});
        getListBillCode();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateBillCode() {
    try {
      const data = await APIService.updateBillCode(
        infoBillCode.id,
        infoBillCode.name,
        infoBillCode.description,
        infoBillCode.apartment_code,
        infoBillCode.billing_type_id,
        infoBillCode.phone,
        infoBillCode.billing_code
      );
      if (data) {
        setInfoBillCode({});
        getListBillCode();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getBillType() {
    try {
      const data = await APIService.getBillType();
      if (data) {
        setListBillType(data.records);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function searchCustomer(search, setSelect = false) {
    try {
      const data = await APIService.searchCustomer(search);
      if (data) {
        setListSearchCustomer(data.records);
        if (setSelect) {
          setSelectCustomer(
            data.records.length > 0
              ? data.records[0].phone + "&" + data.records[0].apartment_code
              : ""
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListBillCode() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getListBillCode(
        segment,
        search,
        apartment,
        type
      );
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getListBillCode();
  }, [currentPage]);

  useEffect(() => {
    getBillType();
  }, []);

  useEffect(() => {
    if (selectCustomer && selectCustomer.length) {
      const phone = selectCustomer.slice(0, selectCustomer.indexOf("&"));
      const apartment_code = selectCustomer.slice(
        selectCustomer.indexOf("&") + 1,
        selectCustomer.length
      );
      setInfoBillCode({
        ...infoBillCode,
        apartment_code: apartment_code,
        phone: phone,
      });
    }
  }, [selectCustomer]);

  const handleOk = () => {
    if (infoBillCode.id) {
      updateBillCode();
    } else {
      addBillCode();
    }
    setModal(false);
  };

  const handleCancel = () => {
    setInfoBillCode({});
    setModal(false);
  };

  const handleSearch = (newValue) => {
    if (newValue) {
      searchCustomer(newValue);
    }
  };

  return (
    <div>
      <Modal
        title={infoBillCode.id ? "Cập nhật" : "Tạo mới"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModal}
        okText={infoBillCode.id ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <div>
          <p className="font-bold">Loại hóa đơn</p>
          <Select
            value={infoBillCode.billing_type_id}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value) => {
              setInfoBillCode({
                ...infoBillCode,
                billing_type_id: value,
              });
            }}
          >
            {listBillType.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </div>
        <div className="mt-4">
          <p className="font-bold">SĐT</p>
          <Select
            showSearch
            onSearch={handleSearch}
            value={selectCustomer}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value, option) => {
              setSelectCustomer(value);
            }}
          >
            {listSearchCustomer.map((item, index) => (
              <Option
                key={index}
                value={item.phone + "&" + item.apartment_code}
              >
                {item.phone ? item.phone : "-"}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mt-4">
          <p className="font-bold">Mã căn hộ</p>
          <Select
            showSearch
            onSearch={handleSearch}
            value={selectCustomer}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value, option) => {
              setSelectCustomer(value);
            }}
          >
            {listSearchCustomer.map((item, index) => (
              <Option
                key={index}
                value={item.phone + "&" + item.apartment_code}
              >
                {item.apartment_code}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mt-4">
          <p className="font-bold">Tên hóa đơn</p>
          <Input
            placeholder="Nhập Tên hóa đơn"
            style={{ marginTop: 5 }}
            value={infoBillCode.name}
            onChange={(e) => {
              setInfoBillCode({
                ...infoBillCode,
                name: e.target.value,
              });
            }}
          />
        </div>

        <div className="mt-4">
          <p className="font-bold">Mã hóa đơn</p>
          <Input
            placeholder="Nhập Mã căn hộ"
            style={{ marginTop: 5 }}
            value={
              infoBillCode.billing_code
                ? infoBillCode.billing_code
                : infoBillCode.bill_code
            }
            onChange={(e) => {
              setInfoBillCode({
                ...infoBillCode,
                billing_code: e.target.value,
              });
            }}
          />
        </div>

        <div className="mt-4">
          <p className="font-bold">Nội dung</p>
          <TextArea
            placeholder="Nhập nội dung"
            style={{ marginTop: 5 }}
            value={infoBillCode.description}
            onChange={(e) => {
              setInfoBillCode({
                ...infoBillCode,
                description: e.target.value,
              });
              // setContent(e.target.value);
            }}
          />
        </div>
      </Modal>

      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div>
            <p className="font-bold">Tìm kiếm</p>
            <Input
              placeholder="Nhập tìm kiếm"
              style={{ width: 200 }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className="ml-4">
            <p className="font-bold">Mã căn hộ</p>
            <Input
              placeholder="Nhập mã căn hộ"
              style={{ width: 200 }}
              value={apartment}
              onChange={(e) => {
                setApartment(e.target.value);
              }}
            />
          </div>
          <div className="ml-4">
            <p className="font-bold">Loại hóa đơn</p>
            <Select
              value={type}
              style={{ width: 200 }}
              onChange={(value) => setType(value)}
            >
              {[{ id: 0, name: "Tất cả" }, ...listBillType].map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
          <div className="ml-4 flex items-end">
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                setCurrentPage(1);
                getListBillCode();
              }}
              style={{ width: 100 }}
            >
              Lọc
            </Button>
          </div>
        </div>
        <div className="ml-4 flex items-end">
          <Button
            icon={<PlusCircleOutlined />}
            key="submit"
            type="primary"
            onClick={() => {
              setSelectCustomer("");
              setListSearchCustomer([]);
              setModal(true);
            }}
            style={{ fontWeight: "bold" }}
          >
            Tạo mới
          </Button>
        </div>
      </div>

      <Table
      size="small"
        bordered
        columns={columns}
        dataSource={data.records}
        pagination={{ position: ["none", "none"] }}
        scroll={{ x: 1400 }}
      />
      <Pagination
        style={{ marginTop: 20, textAlign: "center" }}
        current={currentPage}
        onChange={(page) => {
          setCurrentPage(page);
        }}
        pageSize={10}
        total={data.total}
      />
    </div>
  );
};

export default ListBillCode;
