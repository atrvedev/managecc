import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  message,
  Image,
  Space,
  Radio,
  Pagination,
} from "antd";
import moment from "moment";
import { dateFormat } from "../utils";
import APIService from "../service/APIService";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const ListMember = () => {
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
      title: "Khu",
      dataIndex: "block",
      width: 140,
    },
    {
      title: "Căn hộ",
      dataIndex: "apartment_code",
      width: 140,
    },
    {
      title: "Tên",
      dataIndex: "fullname",
      width: 240,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      width: 160,
    },
    {
      title: "Nhân khẩu / Tạm trú",
      dataIndex: "phone",
      width: 180,
      dataIndex: "customer_type",
      render: (customer_status) => {
        let status_string = "";
        switch (customer_status) {
          case 1:
            status_string = "Nhân khẩu";
            break;
          case 2:
            status_string = "Tạm trú";
            break;
          default:
            break;
        }
        return <p>{status_string}</p>;
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      width: 150,
      render: (stringTime) => {
        let mili = new Date(moment(stringTime, "YYYY-MM-DD")).getTime();
        return <p>{dateFormat(mili)}</p>;
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      width: 120,
      render: (gender) => {
        let gender_string = "";
        switch (gender) {
          case 0:
            gender_string = "Nữ";
            break;
          case 1:
            gender_string = "Nam";
            break;
          case 2:
            gender_string = "Khác";
            break;
          default:
            break;
        }
        return <p>{gender_string}</p>;
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 200,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Số CMND",
      dataIndex: "identity_number",
      width: 140,
    },
    {
      title: "Hình CMND",
      dataIndex: "id",
      width: 160,
      render: (id, data1, index) => (
        <>
          <Image className="mr-2" height={30} src={data1.image_url + data1.front_identity_card} />
          <Image className="ml-2" height={30} src={data1.image_url + data1.back_identity_card} />
        </>
      ),
    },
    {
      title: "Tạm trú từ ngày",
      dataIndex: "from_date",
      width: 140,
      render: (stringTime) => {
        let mili = new Date(moment(stringTime, "YYYY-MM-DD")).getTime();
        return <p>{mili ? dateFormat(mili) : "-"}</p>;
      },
    },
    {
      title: "Tạm trú đến ngày",
      dataIndex: "to_date",
      width: 150,
      render: (stringTime) => {
        let mili = new Date(moment(stringTime, "YYYY-MM-DD")).getTime();
        return <p>{mili ? dateFormat(mili) : "-"}</p>;
      },
    },
    {
      title: "Mối quan hệ",
      dataIndex: "family_relationship",
      width: 160,
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
      dataIndex: "customer_status",
      width: 150,
      render: (customer_status) => {
        let status_string = "";
        switch (customer_status) {
          case 0:
            status_string = "Mới";
            break;
          case 1:
            status_string = "Đã duyệt";
            break;
            case 9:
            status_string = "Xóa";
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
      width: 130,
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
  const [blockChoose, setBlockChoose] = useState(0);
  const [listBlock, setListBlock] = useState([]);
  const [apartment, setApartment] = useState("");

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
            Mới
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 1)}
          >
            Đã duyệt
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 9)}
          >
            Xóa
          </Button>
        </div>
      ),
      okButtonProps: { style: { display: "none" } },
    });
  };

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateCustomer(id, status);
      if (data) {
        getListMember();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (value) => {
    setBlockChoose(value);
  };

  async function getListMember() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getListMember(segment, search, blockChoose, apartment);
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllBlock() {
    try {
      const data = await APIService.getAllBlock();
      if (data) {
        const all = { name: "Tất cả", id: 0 };
        setListBlock([all, ...data.records]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getListMember();
  }, [currentPage]);

  useEffect(() => {
    getAllBlock();
  }, []);

  return (
    <div>
      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div>
            <p className="font-bold">Khu</p>
            <Select
              defaultValue={blockChoose}
              style={{ width: 200 }}
              onChange={handleChange}
            >
              {listBlock.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
          <div className="ml-4">
            <p className="font-bold">Căn hộ</p>
            <Input
              placeholder="Nhập căn hộ"
              style={{ width: 200 }}
              value={apartment}
              onChange={(e) => {
                setApartment(e.target.value);
              }}
            />
          </div>
          <div className="ml-4">
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
                getListMember();
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
        style={{width: "100%"}}
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

export default ListMember;
