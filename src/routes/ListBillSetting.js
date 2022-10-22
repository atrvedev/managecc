import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  InputNumber,
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

const ListBillSetting = () => {
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
      title: "Loại",
      dataIndex: "billing_type",
      width: 280,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Số lần thanh toán",
      dataIndex: "billing_frequence",
      width: 180,
      render: (name, data1, index) => (
        <p className="line-clamp-2 text-black">{name}</p>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "billing_money",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{priceFormat(content)}</p>
      ),
    },

    {
      title: "Ngày hàng tháng",
      dataIndex: "frequence_value",
      width: 150,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Loại thiết lập",
      dataIndex: "setting_type",
      width: 130,
      render: (status) => {
        let status_string = "";
        switch (status) {
          case 1:
            status_string = "API";
            break;
          case 2:
            status_string = "Auto";
            break;
          default:
            status_string = status;
            break;
        }
        return <p>{status_string}</p>;
      },
    },

    {
      title: "Ngày tạo",
      dataIndex: "create_date",
      width: 150,
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
                setInfoBillSetting(data1);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isModal, setModal] = useState(false);
  const [infoBillSetting, setInfoBillSetting] = useState({});
  const [listBillType, setListBillType] = useState([]);

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

  async function addBillSetting() {
    try {
      const data = await APIService.addBillSetting(
        infoBillSetting.description,
        infoBillSetting.total_money,
        infoBillSetting.billing_type_id,
        infoBillSetting.billing_frequence_id,
        infoBillSetting.frequence_value,
        infoBillSetting.setting_type
      );
      if (data) {
        setInfoBillSetting({});
        getListBillSetting();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateBillSetting() {
    try {
      const data = await APIService.updateBillSetting(
        infoBillSetting.id,
        infoBillSetting.description,
        infoBillSetting.total_money,
        infoBillSetting.billing_type_id,
        infoBillSetting.billing_frequence_id,
        infoBillSetting.frequence_value,
        infoBillSetting.setting_type
      );
      if (data) {
        setInfoBillSetting({});
        getListBillSetting();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateStatusBillingSetting(id, status);
      if (data) {
        getListBillSetting();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListBillSetting() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getListBillSetting(segment, search);
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getListBillSetting();
  }, [currentPage]);

  useEffect(() => {
    getBillType();
  }, []);

  const handleOk = () => {
    if (infoBillSetting.id) {
      updateBillSetting();
    } else {
      addBillSetting();
    }
    setModal(false);
  };

  const handleCancel = () => {
    setInfoBillSetting({});
    setModal(false);
  };

  return (
    <div>
      <Modal
        title={infoBillSetting.id ? "Cập nhật" : "Tạo mới"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModal}
        okText={infoBillSetting.id ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <div className="flex flex-row">
          <div className="w-full mr-2">
            <p className="font-bold">Loại hóa đơn</p>
            <Select
              value={infoBillSetting.billing_type_id}
              style={{ width: "100%", marginTop: 5 }}
              onChange={(value) => {
                setInfoBillSetting({
                  ...infoBillSetting,
                  billing_type_id: value,
                });
              }}
            >
              {listBillType.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
          <div className="w-full ml-2">
            <p className="font-bold">Số lần thanh toán</p>
            <Select
              value={infoBillSetting.billing_frequence_id}
              style={{ width: "100%", marginTop: 5 }}
              onChange={(value) => {
                setInfoBillSetting({
                  ...infoBillSetting,
                  billing_frequence_id: value,
                });
              }}
            >
              {[{ id: 1, name: "Hàng tháng" }].map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex flex-row mt-4">
          <div className="w-full mr-2">
            <p className="font-bold">Số tiền</p>
            <InputNumber
              placeholder="Nhập số tiền"
              style={{ width: "100%", marginTop: 5 }}
              value={
                infoBillSetting.total_money
                  ? infoBillSetting.total_money
                  : infoBillSetting.billing_money
              }
              onChange={(e) => {
                setInfoBillSetting({
                  ...infoBillSetting,
                  total_money: e,
                });
              }}
            />
          </div>
          <div className="w-full ml-2">
            <p className="font-bold">Ngày tạo hóa đơn</p>
            <InputNumber
              placeholder="Nhập Ngày tạo hóa đơn"
              style={{ width: "100%", marginTop: 5 }}
              value={infoBillSetting.frequence_value}
              onChange={(e) => {
                setInfoBillSetting({
                  ...infoBillSetting,
                  frequence_value: e,
                });
              }}
            />
          </div>
        </div>
        <Radio.Group
          style={{ marginTop: 20 }}
          onChange={(e) => {
            setInfoBillSetting({
              ...infoBillSetting,
              setting_type: e.target.value,
            });
          }}
          value={infoBillSetting.setting_type}
        >
          <Space direction="horizontal">
            <Radio value={1}>API</Radio>
            <Radio value={2}>Tự động</Radio>
          </Space>
        </Radio.Group>

        <div className="mt-4">
          <p className="font-bold">Nội dung</p>
          <TextArea
            placeholder="Nhập nội dung"
            style={{ marginTop: 5 }}
            value={infoBillSetting.description}
            onChange={(e) => {
              setInfoBillSetting({
                ...infoBillSetting,
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
          <div className="ml-4 flex items-end">
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                setCurrentPage(1);
                getListBillSetting();
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
            onClick={() => setModal(true)}
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

export default ListBillSetting;
