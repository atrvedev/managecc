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

const ListAgent = () => {
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
      title: "Tên liên lạc",
      dataIndex: "name",
      width: 280,
      render: (name, data1, index) => (
        <p className="line-clamp-2 text-black">{name}</p>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 160,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
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
      title: "Hình ảnh",
      dataIndex: "image",
      width: 100,
      render: (image, data1) => (
        <Image src={data1.image_url + image} height={30} />
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Chi phí",
      dataIndex: "cost",
      width: 160,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
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
      fixed: 'right',
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
                setInfoAgent(data1);
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
  const [infoAgent, setInfoAgent] = useState({});
  const [isModal, setModal] = useState(false);

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
        { file: fmData.get("image"), type: "agent" },
        config
      );
      onSuccess(res.data);
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateStatusAgent(id, status);
      if (data) {
        getAllAgent();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  async function getAllAgent() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getAllAgent(segment, search);
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addAgent() {
    try {
      const data = await APIService.addAgent(
        infoAgent.name,
        infoAgent.description,
        infoAgent.address,
        infoAgent.phone,
        infoAgent.time,
        infoAgent.image,
      );
      if (data) {
        setInfoAgent({});
        getAllAgent();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateAgent() {
    try {
      const data = await APIService.updateAgent(
        infoAgent.id,
        infoAgent.name,
        infoAgent.description,
        infoAgent.address,
        infoAgent.phone,
        infoAgent.time,
        infoAgent.image,
        infoAgent.icon
      );
      if (data) {
        setInfoAgent({});
        getAllAgent();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllAgent();
  }, [currentPage]);


  const handleOk = () => {
    if (infoAgent.id) {
      updateAgent();
    } else {
      addAgent();
    }
    setModal(false);
  };

  const handleCancel = () => {
    setInfoAgent({});
    setModal(false);
  };


  return (
    <div>
      <Modal
        title={infoAgent.id ? "Cập nhật" : "Tạo mới"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModal}
        okText={infoAgent.id ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <div>
          <p className="font-bold">Tên</p>
          <Input
            placeholder="Nhập tên"
            style={{ marginTop: 5 }}
            value={infoAgent.name}
            onChange={(e) => {
              setInfoAgent({
                ...infoAgent,
                name: e.target.value,
              });
            }}
          />
        </div>
        <div className="mt-4">
          <p className="font-bold">Địa chỉ</p>
          <Input
            placeholder="Nhập địa chỉ"
            style={{ marginTop: 5 }}
            value={infoAgent.address}
            onChange={(e) => {
              setInfoAgent({
                ...infoAgent,
                address: e.target.value,
              });
            }}
          />
        </div>
        <div className="mt-4">
          <p className="font-bold">SĐT</p>
          <Input
            placeholder="Nhập SĐT"
            style={{ marginTop: 5 }}
            value={infoAgent.phone}
            onChange={(e) => {
              setInfoAgent({
                ...infoAgent,
                phone: e.target.value,
              });
            }}
          />
        </div>
        <div className="mt-4">
          <p className="font-bold">Thời gian</p>
          <Input
            placeholder="Nhập thời gian"
            style={{ marginTop: 5 }}
            value={infoAgent.time}
            onChange={(e) => {
              setInfoAgent({
                ...infoAgent,
                time: e.target.value,
              });
            }}
          />
        </div>
 

        <div className="mt-4">
          <p className="font-bold">Nội dung</p>
          <TextArea
            placeholder="Nhập nội dung"
            style={{ marginTop: 5 }}
            value={infoAgent.description}
            onChange={(e) => {
              setInfoAgent({
                ...infoAgent,
                description: e.target.value,
              });
            }}
          />
        </div>


        <div className="mt-4">
          <p className="font-bold">Hình</p>
          <div className="flex flex-row items-center w-full mt-1 ">
            <div className="w-full h-[36px] border mr-4 flex items-center justify-between">
              {infoAgent.image && infoAgent.image.length ? (
                <>
                  <p className="flex ml-2">{infoAgent.image}</p>
                  <Button
                    type="text"
                    onClick={() => {
                      setInfoAgent({
                        ...infoAgent,
                        image: "",
                      });
                    }}
                    style={{ width: 40, height: 40 }}
                    icon={
                      <DeleteOutlined
                        style={{
                          padding: 0,
                          marginTop: 3,
                          fontSize: 18,
                          borderWidth: 0,
                        }}
                      />
                    }
                  ></Button>
                </>
              ) : null}
            </div>
            <div style={{ width: 36, height: 36 }}>
              <Upload
                customRequest={uploadImage}
                name="file"
                showUploadList={false}
                onChange={(info) => {
                  if (info.file.status === "done") {
                   
                    setInfoAgent({
                      ...infoAgent,
                      image: info.file.response.data.image_data,
                    });
                  } else if (info.file.status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                  }
                }}
              >
                <Button
                  key="submit"
                  type="primary"
                  style={{ width: 36, height: 36 }}
                  icon={<UploadOutlined style={{ padding: 0, fontSize: 18 }} />}
                ></Button>
              </Upload>
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div className="">
            <p className="font-bold">Tìm kiếm</p>
            <Input
              placeholder="Nhập"
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
                getAllAgent();
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
            style={{ fontWeight: "bold" }}
            onClick={() => setModal(true)}
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

export default ListAgent;
