import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  Image,
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
import MyUpload from "../components/MyUpload";

const { TextArea } = Input;

const ListNotification = () => {
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
      dataIndex: "title",
      width: 280,
      render: (title, data1, index) => (
        <p className="line-clamp-2 text-black">{title}</p>
      ),
    },

    {
      title: "Nội dung",
      dataIndex: "content",
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      width: 100,
      render: (image, data1, index) => (
        <Image height={30} src={data1.image_url + image} />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
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
      title: "Đối tượng",
      dataIndex: "to",
      width: 120,
      render: (to) => {
        let status_string = "";
        switch (to) {
          case "ALL":
            status_string = "Tất cả";
            break;
          default:
            status_string = to;
            break;
        }
        return <p>{status_string}</p>;
      },
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
      title: "Thao tác",
      fixed: "right",
      dataIndex: "id",
      width: 130,
      render: (id, data1) => {
        return (
          <Button
            style={{
              backgroundColor: "#2fcc61",
              alignItems: "center",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={() => {
              getDetailNoti(id);
              setModalVisible(true);
            }}
          >
            Cập nhật
          </Button>
        );
      },
    },
  ];

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(0);
  const [valueStatus, setValueStatus] = useState(0);
  const [imageNoti, setImage] = useState("");
  const [customer, setCustomer] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [idNotiChoose, setIdNotiChoose] = useState(0);
  const [url_image, setURL] = useState("");

  async function getNotification() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getNotification(segment, search);
      if (data) {
        setData(data);
        setURL(data.records[0].image_url);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getDetailNoti(id) {
    try {
      const data = await APIService.getDetailNoti(id);
      if (data) {
        setIdNotiChoose(id);
        setValue(data.record.type);
        setURL(data.record.image_url);
        setImage(data.record.thumbnail);
        setCustomer(data.record.customer);
        setTitle(data.record.title);
        setValueStatus(data.record.status);
        setContent(data.record.content);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createNoti() {
    try {
      const data = await APIService.createNoti(
        value,
        customer,
        title,
        content,
        imageNoti
      );
      if (data) {
        cleanState();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateNoti() {
    try {
      const data = await APIService.updateNoti(
        idNotiChoose,
        value,
        customer,
        title,
        content,
        imageNoti,
        valueStatus
      );
      if (data) {
        cleanState();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleOk = () => {
    if (idNotiChoose) {
      updateNoti();
    } else {
      createNoti();
    }
  };

  const cleanState = () => {
    setModalVisible(false);
    setValue(0);
    setIdNotiChoose(0);
    setImage("");
    setCustomer("");
    setTitle("");
    setContent("");
    getNotification();
  };

  const handleCancel = () => {
    cleanState();
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const onChangeStatus = (e) => {
    console.log("radio checked", e.target.value);
    setValueStatus(e.target.value);
  };

  useEffect(() => {
    getNotification();
  }, [currentPage]);

  return (
    <div>
      <Modal
        title={(idNotiChoose ? "Cập nhật" : "Tạo mới") + " Thông báo"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModalVisible}
        okText={idNotiChoose ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <Radio.Group onChange={onChange} value={value}>
          <Space direction="vertical">
            <Radio value={1}>
              Căn hộ
              {value === 1 ? (
                <Input
                  style={{ width: 200, marginLeft: 40 }}
                  value={customer}
                  onChange={(e) => {
                    setCustomer(e.target.value);
                  }}
                />
              ) : null}
            </Radio>
            <Radio value={0}>Tất cả</Radio>
          </Space>
        </Radio.Group>
        <div className="mt-4">
          <p className="font-bold">Tiêu đề</p>
          <Input
            placeholder="Nhập tiêu đề"
            style={{ marginTop: 5 }}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="mt-4">
          <p className="font-bold">Nội dung</p>
          <TextArea
            placeholder="Nhập nội dung"
            style={{ marginTop: 5 }}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
        <MyUpload
          type="notification"
          label="Hình"
          value={imageNoti}
          url={url_image}
          onChange={(value) => setImage(value)}
        />

        {idNotiChoose ? (
          <div className="mt-4">
            <p className="font-bold">Trạng thái</p>
            <Radio.Group
              style={{ marginTop: 5 }}
              onChange={onChangeStatus}
              value={valueStatus}
            >
              <Radio value={0}>Ẩn</Radio>
              <Radio value={1}>Hiện</Radio>
            </Radio.Group>
          </div>
        ) : null}
      </Modal>
      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div className="">
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
                getNotification();
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
            onClick={() => setModalVisible(true)}
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

export default ListNotification;
