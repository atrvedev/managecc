import React, { useState, useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Table,
  Modal,
  Input,
  Select,
  Form,
  DatePicker,
  InputNumber,
  Space,
  Pagination,
} from "antd";
import moment from "moment";
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

const ListBill = () => {
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
      title: "Mã thanh toán",
      dataIndex: "bill_code",
      width: 220,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Tên hóa đơn",
      dataIndex: "name",
      width: 280,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      width: 130,
      render: (name, data1, index) => (
        <p className="line-clamp-2 text-black">{name}</p>
      ),
    },
    {
      title: "Căn hộ",
      dataIndex: "apartment_code",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Loại hóa đơn",
      dataIndex: "billing_type",
      width: 130,
    },
    {
      title: "Tiền",
      dataIndex: "total_money",
      width: 130,
      render: (stringTime) => {
        return <p>{priceFormat(stringTime)}</p>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "create_date",
      width: 160,
      render: (create_date, data1, index) => (
        <p className="line-clamp-2 text-black">{dateFormat(create_date)}</p>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (status) => {
        let status_string = "";
        switch (status) {
          case 1:
            status_string = "Mới";
            break;
          case 2:
            status_string = "Đợi thanh toán";
            break;
          case 3:
            status_string = "Đã thanh toán";
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
                searchCustomer(data1.phone, true);
                setInfoBill(data1);
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
  const [apartment, setApartment] = useState("");
  const [type, setType] = useState(0);
  const [status, setStatus] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModal, setModal] = useState(false);
  const [infoBill, setInfoBill] = useState({
    from_date: new Date(),
    to_date: new Date(),
  });
  const [form] = Form.useForm();
  const [listBillType, setListBillType] = useState([]);
  const [listSearchCustomer, setListSearchCustomer] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState("");

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
            Đợi thanh toán
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 3)}
          >
            Đã thanh toán
          </Button>
        </div>
      ),
      okButtonProps: { style: { display: "none" } },
    });
  };

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateStatus(id, status);
      if (data) {
        getListBill();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getBillType() {
    try {
      const data = await APIService.getBillType();
      if (data) {
        setListBillType(data.records);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function searchCustomer(search, setSelect = false) {
    try {
      const data = await APIService.searchCustomer(search);
      if (data) {
        setListSearchCustomer(data.records);
        if (setSelect) {
          setSelectCustomer(
            data.records.length > 0
              ? data.records[0].phone + "&" + data.records[0].apartment_code
              : ""
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListBill() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getListBill(
        segment,
        search,
        apartment,
        type,
        status
      );
      if (data) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addBill() {
    try {
      const data = await APIService.addBill(
        infoBill.name,
        infoBill.description,
        infoBill.apartment_code,
        infoBill.total_money,
        infoBill.billing_type_id,
        infoBill.phone,
        infoBill.from_date,
        infoBill.to_date,
        form.getFieldValue().billDetails
      );
      if (data) {
        setInfoBill({
          from_date: new Date(),
          to_date: new Date(),
        });
        getListBill();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateBill() {
    try {
      const data = await APIService.updateBill(
        infoBill.id,
        infoBill.name,
        infoBill.description,
        infoBill.apartment_code,
        infoBill.total_money,
        infoBill.billing_type_id,
        infoBill.phone,
        infoBill.from_date,
        infoBill.to_date,
        form.getFieldValue().billDetails
      );
      if (data) {
        setInfoBill({
          from_date: new Date(),
          to_date: new Date(),
        });
        getListBill();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getListBill();
  }, [currentPage]);

  useEffect(() => {
    getBillType();
  }, []);

  useEffect(() => {
    if (selectCustomer && selectCustomer.length) {
      const phone = selectCustomer.slice(0, selectCustomer.indexOf("&"));
      const apartment_code = selectCustomer.slice(
        selectCustomer.indexOf("&") + 1,
        selectCustomer.length
      );
      setInfoBill({
        ...infoBill,
        apartment_code: apartment_code,
        phone: phone,
      });
    }
  }, [selectCustomer]);

  const handleOk = () => {

    if (infoBill.id) {
      updateBill();
    } else {
      addBill();
    }
    setModal(false);
  };

  const handleCancel = () => {
    setInfoBill({
      from_date: new Date(),
      to_date: new Date(),
    });
    setModal(false);
  };

  const handleSearch = (newValue) => {
    if (newValue) {
      searchCustomer(newValue);
    }
  };

  return (
    <div>
      <Modal
        title={infoBill.id ? "Cập nhật" : "Tạo mới"}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModal}
        okText={infoBill.id ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy bỏ"
      >
        <div>
          <p className="font-bold">Loại hóa đơn</p>
          <Select
            value={infoBill.billing_type_id}
            style={{ width: "100%", marginTop: 5 }}
            onChange={(value) => {
              setInfoBill({
                ...infoBill,
                billing_type_id: value,
              });
            }}
          >
            {listBillType.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </div>
        <div className="flex flex-row mt-4">
          <div className="w-full mr-2">
            <p className="font-bold">Tên hóa đơn</p>
            <Input
              placeholder="Nhập Tên hóa đơn"
              style={{ marginTop: 5 }}
              value={infoBill.name}
              onChange={(e) => {
                setInfoBill({
                  ...infoBill,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <div className="w-full ml-2">
            <p className="font-bold">Số tiền</p>
            <InputNumber
              placeholder="Nhập số tiền"
              style={{ width: "100%", marginTop: 5 }}
              value={infoBill.total_money}
              onChange={(e) => {
                setInfoBill({
                  ...infoBill,
                  total_money: e,
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-row mt-4">
          <div className="w-full mr-2">
            <p className="font-bold">Số điện thoại</p>
            <Select
              showSearch
              onSearch={handleSearch}
              value={selectCustomer}
              style={{ width: "100%", marginTop: 5 }}
              onChange={(value, option) => {
                setSelectCustomer(value);
              }}
            >
              {listSearchCustomer.map((item, index) => (
                <Option
                  key={index}
                  value={item.phone + "&" + item.apartment_code}
                >
                  {item.phone ? item.phone : "-"}
                </Option>
              ))}
            </Select>
          </div>
          <div className="w-full ml-2">
            <p className="font-bold">Mã căn hộ</p>
            <Select
              showSearch
              onSearch={handleSearch}
              value={selectCustomer}
              style={{ width: "100%", marginTop: 5 }}
              onChange={(value, option) => {
                setSelectCustomer(value);
              }}
            >
              {listSearchCustomer.map((item, index) => (
                <Option
                  key={index}
                  value={item.phone + "&" + item.apartment_code}
                >
                  {item.apartment_code}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex flex-row mt-4">
          <div className="w-full mr-2">
            <p className="font-bold">Từ</p>
            <DatePicker
              value={moment(infoBill.from_date, "YYYY-MM-DD")}
              format={"DD-MM-YYYY"}
              style={{ width: "100%", marginTop: 5 }}
              onChange={(value, valueString) => {
                setInfoBill({
                  ...infoBill,
                  from_date: valueString,
                });
              }}
            />
          </div>
          <div className="w-full ml-2">
            <p className="font-bold">Đến</p>
            <DatePicker
              value={moment(infoBill.to_date, "YYYY-MM-DD")}
              format={"DD-MM-YYYY"}
              style={{ width: "100%", marginTop: 5 }}
              onChange={(value, valueString) => {
                setInfoBill({
                  ...infoBill,
                  to_date: valueString,
                });
              }}
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="font-bold">Nội dung</p>
          <TextArea
            placeholder="Nhập nội dung"
            style={{ marginTop: 5 }}
            value={infoBill.description}
            onChange={(e) => {
              setInfoBill({
                ...infoBill,
                description: e.target.value,
              });
              // setContent(e.target.value);
            }}
          />
        </div>
        <Form
          style={{ marginTop: 30 }}
          name="dynamic_form_nest_item"
          form={form}
          onFinish={(value) => {
            console.log(value);
          }}
          autoComplete
        >
          <Form.List name="billDetails">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField },index) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 2 }}
                    align="baseline"
                  >
                    <div>
                      <p className="pb-2 font-bold">Hóa đơn con {index +1}</p>
                      <div className="flex flex-row">
                        <Form.Item
                          {...restField}
                          style={{ width: 250, marginRight: 10 }}
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng không để trống",
                            },
                          ]}
                        >
                          <Input placeholder="Tên hóa đơn con" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "total_money"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng không để trống",
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder="Tổng tiền"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </div>
                      <div className="flex flex-row">
                        <Form.Item
                          {...restField}
                          style={{ width: 250, marginRight: 10 }}
                          name={[name, "description"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng không để trống",
                            },
                          ]}
                        >
                          <Input placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "expired_month"]}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng không để trống",
                            },
                          ]}
                        >
                          <Input placeholder="Tháng hết hạn" />
                        </Form.Item>
                      </div>
                    </div>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm Hóa đơn con
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
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
          <div className="ml-4">
            <p className="font-bold">Mã căn hộ</p>
            <Input
              placeholder="Nhập mã căn hộ"
              style={{ width: 200 }}
              value={apartment}
              onChange={(e) => {
                setApartment(e.target.value);
              }}
            />
          </div>
          <div className="ml-4">
            <p className="font-bold">Loại hóa đơn</p>
            <Select
              value={type}
              style={{ width: 200 }}
              onChange={(value) => setType(value)}
            >
              {[{ id: 0, name: "Tất cả" }, ...listBillType].map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
          <div className="ml-4">
            <p className="font-bold">Trạng thái</p>
            <Select
              value={status}
              style={{ width: 200 }}
              onChange={(value) => setStatus(value)}
            >
              {[
                { id: 0, name: "Tất cả" },
                { id: 1, name: "Mới" },
                { id: 2, name: "Đợi thanh toán" },
                { id: 3, name: "Đã thanh toán" },
              ].map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>
          <div className="ml-4 flex items-end">
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                setCurrentPage(1);
                getListBill();
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
            onClick={() => {
              setSelectCustomer("");
              setListSearchCustomer([]);
              setModal(true);
            }}
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

export default ListBill;
