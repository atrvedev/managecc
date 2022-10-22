import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  message,
  Upload,
  Image,
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

const ListNews = () => {
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
        <p className="line-clamp-1">{content}</p>
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
              getDetailNews(id);
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
  const [pdfNoti, setPdfNoti] = useState("");
  const [customer, setCustomer] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [idNotiChoose, setIdNotiChoose] = useState(0);
  const [url_image, setURL] = useState("");

  async function getNews() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getNews(segment, search);
      if (data) {
        setData(data);
        setURL(data.records[0].image_url);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getDetailNews(id) {
    try {
      const data = await APIService.getDetailNews(id);
      if (data) {
        setIdNotiChoose(id);
        setValue(data.record.type);
        setImage(data.record.thumbnail);
        setCustomer(data.record.customer);
        setTitle(data.record.title);
        setValueStatus(data.record.status);
        setContent(data.record.content);
        setPdfNoti(data.record.pdf_file)
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createNews() {
    try {
      const data = await APIService.createNews(
        value,
        customer,
        title,
        content,
        imageNoti,
        pdfNoti
      );
      if (data) {
        cleanState();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateNews() {
    try {
      const data = await APIService.updateNews(
        idNotiChoose,
        value,
        customer,
        title,
        content,
        imageNoti,
        valueStatus,
        pdfNoti
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
      updateNews();
    } else {
      createNews();
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
    getNews();
  };

  const handleCancel = () => {
    cleanState();
  };

  const onChangeStatus = (e) => {
    console.log("radio checked", e.target.value);
    setValueStatus(e.target.value);
  };

  useEffect(() => {
    getNews();
  }, [currentPage]);

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
        { file: fmData.get("image"), type: "news" },
        config
      );
      onSuccess(res.data);
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  return (
    <div>
      <Modal
        title={(idNotiChoose ? "Cập nhật" : "Tạo mới") + " Tin tức"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModalVisible}
        okText={idNotiChoose ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <div>
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
        <div className="mt-4">
        <MyUpload
          type="news"
          label="Hình"
          value={imageNoti}
          url={url_image}
          onChange={(value) => setImage(value)}
        />
       </div>
        <MyUpload
          type="pdf"
          label="PDF"
          value={pdfNoti}
          // url={url_image}
          onChange={(value) => setPdfNoti(value)}
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
                getNews();
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

export default ListNews;
