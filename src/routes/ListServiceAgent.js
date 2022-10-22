import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  message,
  Upload,
  InputNumber,
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

const ListServiceAgent = () => {
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
      width: 280,
      render: (name, data1, index) => (
        <p className="line-clamp-2 text-black">{name}</p>
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
      title: "Tiện ích/Dịch vụ",
      dataIndex: "service",
      width: 160,
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
      title: "Giá",
      dataIndex: "price",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{priceFormat(content)}</p>
      ),
    },
    {
      title: "Tên đại lý",
      dataIndex: "agent",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "SĐT",
      dataIndex: "agent_phone",
      width: 120,
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
                setInfoService(data1);
                getListCateWithId(data1.agent_id, false);
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
  const [selectService, setSelectService] = useState(0);
  const [selectCate, setSelectCate] = useState(0);
  const [listService, setListService] = useState([]);
  const [listCate, setListCate] = useState([]);
  const [infoService, setInfoService] = useState({});
  const [isModal, setModal] = useState(false);
  const [listServiceAction, setListServiceAction] = useState([]);
  const [listCateAction, setListCateAction] = useState([]);
  
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
      const data = await APIService.updateStatusServiceAgent(id, status);
      if (data) {
        getListServiceAgent();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addServiceProduct() {
    try {
      const data = await APIService.addServiceProduct(
        infoService.name,
        infoService.description,
        infoService.cate_id,
        infoService.time,
        infoService.price,
        infoService.image
      );
      if (data) {
        setInfoService({});
        getListServiceAgent();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateServiceProduct() {
    try {
      const data = await APIService.updateServiceProduct(
        infoService.id,
        infoService.name,
        infoService.description,
        infoService.cate_id,
        infoService.time,
        infoService.price,
        infoService.image
      );
      if (data) {
        setInfoService({});
        getListServiceAgent();
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



  async function getListCateWithId(id, actionsetstate) {
    try {
      const data = await APIService.getListCate(id);
      if (data) {
        setListCateAction(data.records);
        if (actionsetstate) {
          setInfoService({
            ...infoService,
            agent_id: id,
            cate_id: data.records[0] ? data.records[0].id : undefined,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListServiceAgent() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getListServiceAgent(
        segment,
        selectService,
        selectCate,
        search
      );
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
        { file: fmData.get("image"), type: "agent_product" },
        config
      );
      onSuccess(res.data);
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const handleChangeService = (value) => {
    setSelectService(value);
  };
  const handleChangeCate = (value) => {
    setSelectCate(value);
  };

  useEffect(() => {
    getListServiceAgent();
  }, [currentPage]);

  useEffect(() => {
    getListService();
    getListCate();
    getListAgent()
  }, []);

  const handleOk = () => {
    if (infoService.id) {
      updateServiceProduct();
    } else {
      addServiceProduct();
    }
    setModal(false);
  };

  const handleCancel = () => {
    setInfoService({});
    setModal(false);
  };

  return (
    <div>
      <Modal
        title={infoService.id ? "Cập nhật" : "Tạo mới"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModal}
        okText={infoService.id ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <div>
          <p className="font-bold">Chọn đại lý</p>
          <Select
            value={infoService.agent_id}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value) => {
              getListCateWithId(value, true);
            }}
          >
            {listAgent.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </div>

        <div className="mt-4">
          <p className="font-bold">Danh mục</p>
          <Select
            value={infoService.cate_id}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value) => {
              setInfoService({
                ...infoService,
                cate_id: value,
              });
            }}
          >
            {listCateAction.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </div>
        <div className="mt-4">
          <p className="font-bold">Tên</p>
          <Input
            placeholder="Nhập tên"
            style={{ marginTop: 5 }}
            value={infoService.name}
            onChange={(e) => {
              setInfoService({
                ...infoService,
                name: e.target.value,
              });
            }}
          />
        </div>
        <div className="mt-4">
          <p className="font-bold">Thời gian</p>
          <Input
            placeholder="Nhập thời gian"
            style={{ marginTop: 5 }}
            value={infoService.time}
            onChange={(e) => {
              setInfoService({
                ...infoService,
                time: e.target.value,
              });
            }}
          />
        </div>

        <div className="mt-4">
          <p className="font-bold">Giá tiền</p>
          <InputNumber
            placeholder="Nhập giá tiền"
            style={{ width: "100%", marginTop: 5 }}
            value={infoService.price}
            onChange={(e) => {
              setInfoService({
                ...infoService,
                price: e,
              });
            }}
          />
        </div>
        <div className="mt-4">
          <p className="font-bold">Nội dung</p>
          <TextArea
            placeholder="Nhập nội dung"
            style={{ marginTop: 5 }}
            value={infoService.description}
            onChange={(e) => {
              setInfoService({
                ...infoService,
                description: e.target.value,
              });
            }}
          />
        </div>
        <div className="mt-4">
          <p className="font-bold">Hình</p>
          <div className="flex flex-row items-center w-full mt-1 ">
            <div className="w-full h-[36px] border mr-4 flex items-center justify-between">
              {infoService.image && infoService.image.length ? (
                <>
                  <p className="flex ml-2">{infoService.image}</p>
                  <Button
                    type="text"
                    onClick={() => {
                      setInfoService({
                        ...infoService,
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
                    setInfoService({
                      ...infoService,
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
              placeholder="Nhập tìm kiếm"
              style={{ width: 200 }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
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
          <div className="ml-4 flex items-end">
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                setCurrentPage(1);
                getListServiceAgent();
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
            onClick={() => {
              setModal(true);
            }}
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

export default ListServiceAgent;
