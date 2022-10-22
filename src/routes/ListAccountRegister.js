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

const { TextArea } = Input;

const ListAccountRegister = () => {
  const columns = [
    {
      title: "STT",
      dataIndex: "Stt",
      width: 60,
      dataIndex: "id",
      render: (data, data1, index) => (
        <p>{index + 1 + (currentPage - 1) * 10}</p>
      ),
    },
    {
      title: "SĐT",
      dataIndex: "login_name",
      width: 280,
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
        dataIndex: "account_status",
        width: 150,
        render: (account_status) => {
            let status_string = "";
            switch (account_status) {
                case 0:
                    status_string = "Khóa";
                    break;
                case 1:
                    status_string = "Mới";
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
      dataIndex: "id",
      width: 70,
      render: (id, data1) => {
        return (
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
        );
      },
    },
  ];

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  async function getListAccountRegister() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getListAccountRegister(segment, search);
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

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
         Khóa
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 1)}
          >
         Mới
          </Button>
        
        </div>
      ),
      okButtonProps: { style: { display: "none" } },
    });
  };

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateAccount(id, status);
      if (data) {
        getListAccountRegister()
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getListAccountRegister();
  }, [currentPage]);

  return (
    <div>
      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div className="">
            <p className="font-bold">SDT</p>
            <Input
              placeholder="Nhập sdt"
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
                setCurrentPage(1)
                getListAccountRegister()
              }}
              style={{ width: 100 }}
            >
              Lọc
            </Button>
          </div>
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

export default ListAccountRegister;
