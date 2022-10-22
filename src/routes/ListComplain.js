import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  message,
  Upload,
  Pagination,
} from "antd";
import { dateFormat } from "../utils";
import APIService from "../service/APIService";
import {
  DeleteOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";

const ListComplain = () => {
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
      dataIndex: "title",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      width: 160,
    },
    {
      title: "SĐT liên hệ",
      dataIndex: "contact_phone",
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
      dataIndex: "complain_status",
      width: 150,
      render: (conversation_status) => {
        let status_string = "";
        switch (conversation_status) {
          case 1:
            status_string = "Mới";
            break;
          case 2:
            status_string = "Đã xem";
            break;
          case 3:
            status_string = "Đã tiếp nhận";
            break;
          case 4:
            status_string = "Đang xử lý";
            break;
          case 5:
            status_string = "Hoàn thành";
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
      width: 220,
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
                getDetail(id);
                setChatChoose(data1);
              }}
            >
              Trả lời
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

  const { Option } = Select;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [detailChat, setDetailChat] = useState([]);
  const [chatChoose, setChatChoose] = useState({});
  const [content, setContent] = useState("");
  const [listBlock, setListBlock] = useState([]);
  const [blockChoose, setBlockChoose] = useState(0);
  const [apartment, setApartment] = useState("");
  const [search, setSearch] = useState("");
  const [imageChat, setImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const _header = {
    token: window.localStorage.getItem("token"),
  };

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
            onClick={() => updateStatus(data1.id, 3)}
          >
            Đã tiếp nhận
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 4)}
          >
            Đang xử lý
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 5)}
          >
            Hoàn tất
          </Button>
        </div>
      ),
      okButtonProps: { style: { display: "none" } },
    });
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleChange = (value) => {
    setBlockChoose(value);
  };

  const handleOk = () => {
    setLoading(true);
    reply();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  async function getComplain() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getComplain(
        segment,
        blockChoose,
        apartment,
        search
      );
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

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateStatusComplain(id, status);
      if (data) {
        getComplain();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function reply() {
    const type = imageChat.length == 0 ? 1 : 2;
    try {
      const data = await APIService.replyComplain(
        chatChoose.id,
        type,
        type == 1 ? content : imageChat
      );
      if (data) {
        getComplain();
        getDetail(chatChoose.id);
        setContent("");
        setImage("");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function getDetail(id) {
    try {
      const data = await APIService.getDetailComplain(id);
      if (data) {
        setDetailChat(data.records.reverse());
        showModal();
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
    getComplain();
  }, [currentPage]);

  useEffect(() => {
    getAllBlock();
  }, []);

  return (
    <div>
      <Modal
        visible={visible}
        title={chatChoose.title}
        onOk={handleOk}
        bodyStyle={{
          padding: 0,
          height: 440,
          backgroundColor: "#f0f2f5",
        }}
        onCancel={handleCancel}
        footer={null}
      >
        <div style={{ overflowX: "scroll", padding: 20, height: 400 }}>
          {detailChat.map((item) => {
            let mili = new Date(item.create_date).getTime();
            return (
              <div
                className={
                  "flex mb-5 " +
                  (item.account_type ? "justify-end" : "justify-start")
                }
              >
                <div className="bg-white p-3 max-w-[400px] rounded-md">
                  <p className="font-bold">{item.fullname}</p>

                  {item.type_content == 1 ? (
                    <div className="mt-1">
                      <p className="">{item.value_content}</p>
                    </div>
                  ) : (
                    <img
                      className="mt-2"
                      src={item.image_url + item.value_content}
                      width={150}
                    />
                  )}

                  <div className="mt-2">
                    <p className="font-light text-xs text-red-400">
                      {dateFormat(mili, undefined, true)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="flex flex-row"
          style={{ backgroundColor: "white", padding: 10, width: "100%" }}
        >
          <div style={{ width: 40, height: 40 }}>
            <Upload
              // action="http://61.28.229.181:11111/image/uploadFile"
              // headers={_header}
              customRequest={uploadImage}
              name="file"
              showUploadList={false}
              onChange={(info) => {
                if (info.file.status === "done") {
                  setImage(info.file.response.data.image_data);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
            >
              <Button
                key="submit"
                type="primary"
                style={{ width: 40, height: 40, borderRadius: 50 }}
                icon={<UploadOutlined style={{ padding: 0, fontSize: 18 }} />}
              ></Button>
            </Upload>
          </div>
          {imageChat.length == 0 ? (
            <Input
              size="small"
              style={{
                fontSize: 14,
                height: 35,
                width: 330,
                marginLeft: 15,
                marginRight: 15,
                height: 40,
              }}
              value={content}
              placeholder="Enter your Username"
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          ) : (
            <div className="w-[330px] h-[40px] mx-[15px] flex items-center justify-between">
              {imageChat}
              <Button
                type="text"
                onClick={() => setImage("")}
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
            </div>
          )}

          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
            style={{ width: 100, height: 40 }}
            icon={<SendOutlined />}
          >
            Send
          </Button>
        </div>
      </Modal>
      <div className="flex flex-row mb-6">
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
              getComplain();
            }}
            style={{ width: 100 }}
          >
            Lọc
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

export default ListComplain;
