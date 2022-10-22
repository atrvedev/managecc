import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  InputNumber,
  Upload,
  Popover,
  Tag,
  Pagination,
} from "antd";
import { dateFormat, priceFormat } from "../utils";
import APIService from "../service/APIService";
import {
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { ExcelToJson } from "../utils/ExcelUtil";

const { TextArea } = Input;
const { Option } = Select;
const mapTypeBill = new Map();

const arrKey = [
  "name",
  "phone",
  "apartment_code",
  "bill_code",
  "description",
  "total_money",
  "billing_type_id",
];

const ListBillImportExcel = () => {
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
      title: "Tên hóa đơn",
      dataIndex: "name",
      width: 240,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      width: 120,
    },
    {
      title: "Căn hộ",
      dataIndex: "apartment_code",
      width: 90,
    },

    {
      title: "Mã hóa đơn",
      dataIndex: "bill_code",
      width: 220,
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      width: 240,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "total_money",
      width: 150,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{priceFormat(content)}</p>
      ),
    },
    {
      title: "Loại hóa đơn",
      dataIndex: "billing_type_id",
      width: 150,
      render: (content, data1, index) => {
        return <p className="line-clamp-2">{mapTypeBill.get(content)}</p>;
      },
    },
    {
      title: "Tên tập tin",
      dataIndex: "file_name",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "create_date",
      width: 150,
      render: (create_date, data1, index) => (
        <p className="line-clamp-2 text-black">{dateFormat(create_date)}</p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      fixed: "right",
      width: 160,
      render: (status, data1) => {
        let status_string;
        switch (status) {
          case 1:
            status_string = (
              <Tag
                icon={<ExclamationCircleOutlined />}
                color="warning"
                key={status}
              >
                Chờ chạy
              </Tag>
            );
            break;
          case 2:
            status_string = (
              <Tag color="processing" icon={<SyncOutlined spin />} key={status}>
                Đang chạy
              </Tag>
            );
            break;
          case 3:
            status_string = (
              <Tag color="success" icon={<CheckCircleOutlined />} key={status}>
                Thành công
              </Tag>
            );
            break;
          case 4:
            status_string = (
              <>
                <Tag color="error" icon={<CloseCircleOutlined />} key={status}>
                  Thất bại
                </Tag>
                <Popover content={data1.note} title="Ghi chú">
                  <Button
                    type="text"
                    style={{ width: 30, height: 30 }}
                    icon={
                      <InfoCircleOutlined
                        style={{ padding: 0, fontSize: 16 }}
                      />
                    }
                  ></Button>
                </Popover>
              </>
            );
            break;
          case 5:
            status_string = (
              <Tag icon={<MinusCircleOutlined />} color="error" key={status}>
                Hủy
              </Tag>
            );
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
      fixed: "right",
      dataIndex: "id",
      width: 140,
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

  const columnsImport = () => {
    const title = [
      {
        title: "STT",
        dataIndex: "Stt",
        width: 70,
        dataIndex: "id",
        render: (data, data1, index) => <p>{index + 1}</p>,
      },
      {
        title: "Tên hóa đơn",
        dataIndex: "name",
        width: 240,
        render: (content, data1, index) => (
          <p className="line-clamp-2">{content}</p>
        ),
      },
      {
        title: "SĐT",
        dataIndex: "phone",
        width: 120,
      },
      {
        title: "Căn hộ",
        dataIndex: "apartment_code",
        width: 90,
      },

      {
        title: "Mã hóa đơn",
        dataIndex: "bill_code",
        width: 120,
      },
      {
        title: "Nội dung",
        dataIndex: "description",
        width: 240,
        render: (content, data1, index) => (
          <p className="line-clamp-2">{content}</p>
        ),
      },
      {
        title: "Số tiền",
        dataIndex: "total_money",
        width: 130,
        render: (content, data1, index) => (
          <p className="line-clamp-2">{priceFormat(content)}</p>
        ),
      },
      {
        title: "Loại hóa đơn",
        dataIndex: "billing_type_id",
        width: 150,
        render: (content, data1, index) => {
          return <p className="line-clamp-2">{mapTypeBill.get(content)}</p>;
        },
      },
    ];
    dataImport.data &&
      Object.keys(dataImport.data[0]).forEach(function (key, index) {
        if (!arrKey.includes(key)) {
          const billChild = {
            title: key,
            dataIndex: key,
            width: 150,
            render: (content, data1, index) => {
              return <p className="line-clamp-2">{priceFormat(content)}</p>;
            },
          };
          title.push(billChild);
        }
      });

    return title;
  };

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImport, setModalImport] = useState(false);
  const [dataImport, setDataImport] = useState({});

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
            Chờ chạy
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 2)}
          >
            Đang chạy
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 3)}
          >
            Thành công
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 4)}
          >
            Thất bại
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
      const data = await APIService.updateStatusBillingImport(id, status);
      if (data) {
        getAllBillingImport();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllBillingImport() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getAllBillingImport(segment, search);
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getBillType() {
    try {
      const data = await APIService.getBillType();
      if (data) {
        data.records.forEach((element) => {
          mapTypeBill.set(element.id, element.name);
        });
        getAllBillingImport();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function importBilling() {
    try {
      const data = await APIService.importBilling(dataImport);
      if (data) {
        getAllBillingImport();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllBillingImport();
  }, [currentPage]);

  useEffect(() => {
    getBillType();
  }, []);

  const uploadFile = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    onSuccess();
  };

  const handleCancel = () => {
    setModalImport(false);
  };

  const handleOk = () => {
    const dataFormated = dataImport.data.map((item) => {
      var billDetails = [];
      Object.keys(item).forEach(function (key, index) {
        if (!arrKey.includes(key)) {
          const billChild = {
            name: key,
            description: key,
            total_money: item[key],
            expired_month: key,
          };
          delete item[key];
          billDetails.push(billChild);
        }
      });
      item.billDetails = billDetails;
      return item;
    });
    setDataImport({ ...dataImport, data: dataFormated });
    importBilling();
    setModalImport(false);
  };

  return (
    <div>
      <Modal
        title={dataImport.name}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={modalImport}
        okText={"Tạo thanh toán"}
        width={1250}
        cancelText="Hủy bỏ"
      >
        <Table
          // bordered
          columns={columnsImport()}
          dataSource={dataImport.data}
          pagination={{ position: ["none", "none"], pageSize: 1000 }}
          scroll={{ y: 400 }}
        />
      </Modal>
      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div>
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
          <div className="ml-4 flex items-end">
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                setCurrentPage(1);
                getAllBillingImport();
              }}
              style={{ width: 100 }}
            >
              Lọc
            </Button>
          </div>
        </div>
        <div className="ml-4 flex items-end">
          <Upload
            name="file"
            customRequest={uploadFile}
            showUploadList={false}
            onChange={async (info) => {
              if (info.file.status === "done") {
                const data = await ExcelToJson(
                  info.file.originFileObj,
                  1,
                  arrKey
                );

                const jsonImport = {
                  name: info.file.originFileObj.name,
                  data: data,
                };

                console.log(jsonImport);
                setDataImport(jsonImport);
                setModalImport(true);
              }
            }}
          >
            <Button
              key="submit"
              type="primary"
              icon={<UploadOutlined style={{ padding: 0, fontSize: 18 }} />}
            >
              Import Excel
            </Button>
          </Upload>
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

export default ListBillImportExcel;
