import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  DatePicker,
  Image,
  message,
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
import MyUpload from "../components/MyUpload";

const { Option } = Select;

const gentle = [
  { value: 0, name: "Nữ" },
  { value: 1, name: "Nam" },
  { value: 2, name: "Khác" },
];

const ListCustomer = () => {
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
      title: "CMND",
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
          default:
            break;
        }
        return <p>{status_string}</p>;
      },
    },
    {
      title: "Thao tác",
      fixed: "right",
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
                getDetailCustomer(id);
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
  const [blockChoose, setBlockChoose] = useState(0);
  const [listBlock, setListBlock] = useState([]);
  const [listBlockUpdate, setListBlockUpdate] = useState([]);
  const [apartment, setApartment] = useState("");
  const [infoUpdate, setInfoUpdate] = useState({});
  const [modalUpdate, setModalUpdate] = useState(false);

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
        </div>
      ),
      okButtonProps: { style: { display: "none" } },
    });
  };

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateCustomer(id, status);
      if (data) {
        getListCustomer();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (value) => {
    setBlockChoose(value);
  };

  async function getListCustomer() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getListCustomer(
        segment,
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

  async function updateCustomer() {
    try {
      const data = await APIService.updateCustomerUseApp(
        infoUpdate.id,
        infoUpdate.block_id,
        infoUpdate.apartment_code,
        infoUpdate.fullname,
        infoUpdate.address,
        infoUpdate.birthday,
        infoUpdate.identity_number,
        infoUpdate.front_identity_card,
        infoUpdate.back_identity_card,
        infoUpdate.gender
      );
      if (data) {
        setModalUpdate(false);
        getListCustomer();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getDetailCustomer(id) {
    try {
      const data = await APIService.getCustomerInfo(id);
      if (data) {
        setInfoUpdate(data.record);
        setModalUpdate(true);
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
        setListBlockUpdate(data.records);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    fmData.append("image", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        token: window.localStorage.getItem("token"),
      },
    };
    try {
      const res = await axios.post(
        "http://61.28.229.181:11111/image/uploadFile",
        { file: fmData.get("image"), type: "conversation" },
        config
      );
      onSuccess(res.data);
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  useEffect(() => {
    getListCustomer();
  }, [currentPage]);

  useEffect(() => {
    getAllBlock();
  }, []);

  const handleOk = () => {
    updateCustomer();
  };

  const handleCancel = () => {
    setModalUpdate(false);
  };

  return (
    <div>
      <Modal
        title={"Cập nhật"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={modalUpdate}
        okText={"Cập nhật"}
        cancelText="Hủy bỏ"
      >
        <div className="flex flex-row">
          <div className="w-full mr-2">
            <p className="font-bold">Khu</p>
            <Select
              value={infoUpdate.block_id}
              style={{ width: "100%", marginTop: 5 }}
              onChange={(value) => {
                setInfoUpdate({
                  ...infoUpdate,
                  block_id: value,
                });
              }}
            >
              {listBlockUpdate.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
          <div className="w-full ml-2">
            <p className="font-bold">Mã căn hộ</p>
            <Input
              placeholder="Nhập Mã căn hộ"
              style={{ marginTop: 5 }}
              value={infoUpdate.apartment_code}
              onChange={(e) => {
                setInfoUpdate({
                  ...infoUpdate,
                  apartment_code: e.target.value,
                });
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="font-bold">Họ và tên</p>
          <Input
            placeholder="Nhập Họ và tên"
            style={{ marginTop: 5 }}
            value={infoUpdate.fullname}
            onChange={(e) => {
              setInfoUpdate({
                ...infoUpdate,
                fullname: e.target.value,
              });
            }}
          />
        </div>

        <div className="mt-4">
          <p className="font-bold">Ngày/Tháng/Năm</p>
          <DatePicker
            value={moment(infoUpdate.birthday, "YYYY-MM-DD")}
            format={"DD-MM-YYYY"}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value, valueString) => {
              setInfoUpdate({
                ...infoUpdate,
                birthday: valueString,
              });
            }}
          />
        </div>

        <div className="mt-4">
          <p className="font-bold">Địa chỉ CMND</p>
          <Input
            placeholder="Nhập Địa chỉ CMND"
            style={{ marginTop: 5 }}
            value={infoUpdate.address}
            onChange={(e) => {
              setInfoUpdate({
                ...infoUpdate,
                address: e.target.value,
              });
            }}
          />
        </div>

        <div className="flex flex-row mt-4">
          <div className="w-full mr-2">
            <p className="font-bold">CMND</p>
            <Input
              placeholder="Nhập CMND"
              style={{ marginTop: 5 }}
              value={infoUpdate.identity_number}
              onChange={(e) => {
                setInfoUpdate({
                  ...infoUpdate,
                  identity_number: e.target.value,
                });
              }}
            />
          </div>
          <div className="w-full ml-2">
            <p className="font-bold">Giới tính</p>
            <Select
              value={infoUpdate.gender}
              style={{ width: "100%", marginTop: 5 }}
              onChange={(value) => {
                setInfoUpdate({
                  ...infoUpdate,
                  gender: value,
                });
              }}
            >
              {gentle.map((item) => (
                <Option value={item.value}>{item.name}</Option>
              ))}
            </Select>
          </div>
        </div>

        <MyUpload
          id={infoUpdate.account_id}
          type="customer"
          label="CMND - Mặt trước"
          value={infoUpdate.front_identity_card}
          url={infoUpdate.image_url}
          onChange={(value) =>
            setInfoUpdate({
              ...infoUpdate,
              front_identity_card: value,
            })
          }
        />
        <MyUpload
          type="customer"
          id={infoUpdate.account_id}
          label="CMND - Mặt sau"
          value={infoUpdate.back_identity_card}
          url={infoUpdate.image_url}
          onChange={(value) =>
            setInfoUpdate({
              ...infoUpdate,
              back_identity_card: value,
            })
          }
        />
      </Modal>
      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div>
            <p className="font-bold">Khu</p>
            <Select
              value={blockChoose}
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
                getListCustomer();
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

export default ListCustomer;
