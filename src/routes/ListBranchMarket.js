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
  Image,
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

const ListBranchMarket = () => {
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
      title: "Hình ảnh",
      dataIndex: "image",
      width: 100,
      render: (image, data1) => (
        <Image src={data1.image_url + image} height={30} />
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
                setInfoBranch(data1);
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
  const [infoBranch, setInfoBranch] = useState({});

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
      const data = await APIService.updateStatusNganh(id, status);
      if (data) {
        getAllBranch();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addBranchMarket() {
    try {
      const data = await APIService.addBranchMarket(
        infoBranch.name,
        infoBranch.image
      );
      if (data) {
        setInfoBranch({});
        getAllBranch();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateBranchMarket() {
    try {
      const data = await APIService.updateBranchMarket(
        infoBranch.id,
        infoBranch.name,
        infoBranch.image
      );
      if (data) {
        setInfoBranch({});
        getAllBranch();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllBranch() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getAllBranch(segment, search);
      if (data) {
        setData(data);
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
        { file: fmData.get("image"), type: "market" },
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
    getAllBranch();
  }, [currentPage]);

  const handleOk = () => {
    if (infoBranch.id) {
      updateBranchMarket();
    } else {
      addBranchMarket();
    }
    setModal(false);
  };

  const handleCancel = () => {
    setInfoBranch({});
    setModal(false);
  };

  return (
    <div>
      <Modal
        title={infoBranch.id ? "Cập nhật" : "Tạo mới"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModal}
        okText={infoBranch.id ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <div>
          <p className="font-bold">Tên</p>
          <Input
            placeholder="Nhập tên"
            style={{ marginTop: 5 }}
            value={infoBranch.name}
            onChange={(e) => {
              setInfoBranch({
                ...infoBranch,
                name: e.target.value,
              });
            }}
          />
        </div>

        <div className="mt-4">
          <p className="font-bold">Hình</p>
          <div className="flex flex-row items-center w-full mt-1 ">
            <div className="w-full h-[36px] border mr-4 flex items-center justify-between">
              {infoBranch.image && infoBranch.image.length ? (
                <>
                  <p className="flex ml-2">{infoBranch.image}</p>
                  <Button
                    type="text"
                    onClick={() => {
                      setInfoBranch({
                        ...infoBranch,
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
                    setInfoBranch({
                      ...infoBranch,
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
                getAllBranch();
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

export default ListBranchMarket;
