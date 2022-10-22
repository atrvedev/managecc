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
const { TextArea } = Input;


const ListCategoryService = () => {
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
      title: "Đại lý",
      dataIndex: "agent_name",
      width: 140,
    },
    {
      title: "Tiện ích/Dịch vụ",
      dataIndex: "service_name",
      width: 140,
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
  const [listAgent, setListAgent] = useState([]);

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
      const data = await APIService.updateStatusDanhmucService(id, status);
      if (data) {
        getAllCateService();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addCateService() {
    try {
      const data = await APIService.addCateService(
        infoCate.name,
        infoCate.description,
        infoCate.service_id,
        infoCate.agent_id
      );
      if (data) {
        setInfoCate({});
        getAllCateService();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateCateService() {
    try {
      const data = await APIService.updateCateService(
        infoCate.id,
        infoCate.name,
        infoCate.description,
        infoCate.service_id,
        infoCate.agent_id
      );
      if (data) {
        setInfoCate({});
        getAllCateService();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllCateService() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getAllCateService(segment, search);
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListService() {
    try {
      const data = await APIService.getListService();
      if (data) {
        setListBranch(data.records);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListAgent() {
    try {
      const data = await APIService.getListAgent();
      if (data) {
        setListAgent(data.records);
      }
    } catch (error) {
      console.error(error);
    }
  }


  

  useEffect(() => {
    getAllCateService();
  }, [currentPage]);

  useEffect(() => {
    getListService();
    getListAgent()
  }, []);

  const handleOk = () => {
    if (infoCate.id) {
      updateCateService();
    } else {
      addCateService();
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
          <p className="font-bold">Đại lý</p>
          <Select
            value={infoCate.agent_id}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value) => {
              setInfoCate({
                ...infoCate,
                agent_id: value,
              });
            }}
          >
            {listAgent.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </div>
        <div className="mt-4">
          <p className="font-bold">Tiện ích/Dịch vụ</p>
          <Select
            value={infoCate.service_id}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value) => {
              setInfoCate({
                ...infoCate,
                service_id: value,
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
        <div className="mt-4">
          <p className="font-bold">Nội dung</p>
          <TextArea
            placeholder="Nhập nội dung"
            style={{ marginTop: 5 }}
            value={infoCate.description}
            onChange={(e) => {
              setInfoCate({
                ...infoCate,
                description: e.target.value,
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
                getAllCateService();
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

export default ListCategoryService;
