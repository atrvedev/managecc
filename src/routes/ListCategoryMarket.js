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
import { dateFormat } from "../utils";
import APIService from "../service/APIService";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const ListCategoryMarket = () => {
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
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Ngành",
      dataIndex: "market_name",
      width: 220,
    },
    {
      title: "Thời gian",
      dataIndex: "create_date",
      width: 160,
      render: (stringTime) => {
        let mili = new Date(stringTime).getTime();
        return <p>{dateFormat(mili)}</p>;
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
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
            break;
        }
        return <p>{status_string}</p>;
      },
    },
    {
      title: "Thao tác",
      fixed: 'right',
      dataIndex: ["id"],
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
                setInfoCate(data1);
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
  const [infoCate, setInfoCate] = useState({});
  const [listBranch, setListBranch] = useState([]);

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
      const data = await APIService.updateStatusDanhmuc(id, status);
      if (data) {
        getAllCate();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addCateMarket() {
    try {
      const data = await APIService.addCateMarket(
        infoCate.name,
        infoCate.market_id
      );
      if (data) {
        setInfoCate({});
        getAllCate();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateCateMarket() {
    try {
      const data = await APIService.updateCateMarket(
        infoCate.id,
        infoCate.name,
        infoCate.market_id
      );
      if (data) {
        setInfoCate({});
        getAllCate();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllCate() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getAllCate(segment, search);
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListBranch() {
    try {
      const data = await APIService.getListBranch();
      if (data) {
        setListBranch(data.records);
      }
    } catch (error) {
      console.error(error);
    }
  }

  

  useEffect(() => {
    getAllCate();
  }, [currentPage]);

  useEffect(() => {
    getListBranch();
  }, []);

  const handleOk = () => {
    if (infoCate.id) {
      updateCateMarket();
    } else {
      addCateMarket();
    }
    setModal(false);
  };

  const handleCancel = () => {
    setInfoCate({});
    setModal(false);
  };

  return (
    <div>
      <Modal
        title={infoCate.id ? "Cập nhật" : "Tạo mới"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModal}
        okText={infoCate.id ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <div>
          <p className="font-bold">Ngành</p>
          <Select
            value={infoCate.market_id}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value) => {
              setInfoCate({
                ...infoCate,
                market_id: value,
              });
            }}
          >
            {listBranch.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </div>
        <div className="mt-4">
          <p className="font-bold">Tên</p>
          <Input
            placeholder="Nhập tên"
            style={{ marginTop: 5 }}
            value={infoCate.name}
            onChange={(e) => {
              setInfoCate({
                ...infoCate,
                name: e.target.value,
              });
            }}
          />
        </div>
      </Modal>
      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div>
            <p className="font-bold">Tên</p>
            <Input
              placeholder="Nhập tên"
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
                getAllCate();
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

export default ListCategoryMarket;
