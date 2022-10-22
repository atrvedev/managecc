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
  Image,
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

const ListRegisUse = () => {
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
      width: 100,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Căn hộ",
      dataIndex: "apartment",
      width: 100,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Mã đăng ký",
      dataIndex: "service_order_code",
      width: 130,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Tên",
      dataIndex: "fullname",
      width: 280,
      render: (name, data1, index) => (
        <p className="line-clamp-2 text-black">{name}</p>
      ),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "SĐT liên hệ",
      dataIndex: "contact_phone",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      width: 100,
      render: (image, data1) => {
        return <Image src={data1.image_url + image} height={30} />;
      },
    },
    {
      title: "Tiện ích/Dịch vụ",
      dataIndex: "service_name",
      width: 150,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "cate",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "create_date",
      width: 160,
      render: (stringTime) => {
        let mili = new Date(stringTime).getTime();
        return <p>{dateFormat(mili)}</p>;
      },
    },
    {
      title: "Ngày sử dụng",
      dataIndex: "agent_product_use_time",
      width: 160,
      render: (stringTime) => {
        let mili = new Date(stringTime).getTime();
        return <p>{dateFormat(mili)}</p>;
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{priceFormat(content)}</p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status) => {
        let status_string = "";
        switch (status) {
          case 1:
            status_string = "Mới";
            break;
          case 2:
            status_string = "Đã xác nhận";
            break;
          case 3:
            status_string = "Đang xử lý";
            break;
          case 4:
            status_string = "Hoàn thành";
            break;
          case 5:
            status_string = "Hủy";
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
      fixed: 'right',
      dataIndex: "id",
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
  const [selectService, setSelectService] = useState(0);
  const [selectCate, setSelectCate] = useState(0);
  const [listService, setListService] = useState([]);
  const [listCate, setListCate] = useState([]);
  const [listBlock, setListBlock] = useState([]);
  const [blockChoose, setBlockChoose] = useState(0);
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
            onClick={() => updateStatus(data1.id, 1)}
          >
            Mới
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 2)}
          >
            Đã xác nhận
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 3)}
          >
            Đang xử lý
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 4)}
          >
            Hoàn thành
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 5)}
          >
            Hủy
          </Button>
        </div>
      ),
      okButtonProps: { style: { display: "none" } },
    });
  };

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateStatusRegisUse(id, status);
      if (data) {
        getListRegisUse();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListService() {
    try {
      const data = await APIService.getListService();
      if (data) {
        const all = { name: "Tất cả", id: 0 };
        setListService([all, ...data.records]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListCate() {
    try {
      const data = await APIService.getListCate();
      if (data) {
        const all = { name: "Tất cả", id: 0 };
        setListCate([all, ...data.records]);
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

  async function getListRegisUse() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getListRegisUse(
        segment,
        selectService,
        selectCate,
        search,
        blockChoose,
        apartment
      );
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleChangeService = (value) => {
    setSelectService(value);
  };
  const handleChangeCate = (value) => {
    setSelectCate(value);
  };

  const handleChange = (value) => {
    setBlockChoose(value);
  };

  useEffect(() => {
    getListRegisUse();
  }, [currentPage]);

  useEffect(() => {
    getAllBlock();
    getListService();
    getListCate();
  }, []);

  return (
    <div>
      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div className="ml-4">
            <p className="font-bold">Tiện ích/Dịch vụ</p>
            <Select
              defaultValue={selectService}
              style={{ width: 200 }}
              onChange={handleChangeService}
            >
              {listService.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>

          {/* <div className="ml-4">
            <p className="font-bold">Danh mục</p>
            <Select
              defaultValue={selectCate}
              style={{ width: 200 }}
              onChange={handleChangeCate}
            >
              {listCate.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div> */}
          <div className="ml-4">
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
            <p className="font-bold">Tìm kiếm</p>
            <Input
              placeholder="Tìm kiếm"
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
                getListRegisUse();
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

export default ListRegisUse;
