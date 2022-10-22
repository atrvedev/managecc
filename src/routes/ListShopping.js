import React, { useState, useEffect } from "react";
import {
  Image,
  Button,
  Table,
  Modal,
  Input,
  Select,
  Pagination,
} from "antd";
import { dateFormat, priceFormat } from "../utils";
import APIService from "../service/APIService";

const { Option } = Select;

const ListShopping = () => {
  const columns = [
    {
      title: "STT",
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
      width: 160,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Tên",
      dataIndex: "representative_name",
      width: 280,
      render: (name, data1, index) => (
        <p className="line-clamp-2 text-black">{name}</p>
      ),
    },
    {
      title: "SĐT",
      dataIndex: "representative_mobile",
      width: 120,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "create_date",
      width: 150,
      render: (stringTime) => {
        let mili = new Date(stringTime).getTime();
        return <p>{dateFormat(mili)}</p>;
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "name",
      width: 100,
      render: (content, data1) => {
        var image = JSON.parse(data1.images);
        return  <Image src={data1.image_url + image[0]} height={30} />;
      },
    },
    {
      title: "Mua/Bán",
      dataIndex: "name",
      width: 200,
      render: (content, data1, index) => (
        <p className="line-clamp-2">{content}</p>
      ),
    },
    {
      title: "Tiện ích/Dịch vụ",
      dataIndex: "market",
      width: 200,
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
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (status) => {
        let status_string = "";
        switch (status) {
          case 0:
            status_string = "Chờ duyệt";
            break;
          case 1:
            status_string = "Đang bán";
            break;
          case 2:
            status_string = "Đã bán";
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
  const [selectCate, setSelectCate] = useState(0);
  const [listBranch, setListBranch] = useState([]);
  const [selectBranch, setSelectBranch] = useState(0);
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
            onClick={() => updateStatus(data1.id, 0)}
          >
            Chờ duyệt
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 1)}
          >
            Đang bán
          </Button>
          <Button
            className="mt-4"
            type="primary"
            onClick={() => updateStatus(data1.id, 2)}
          >
            Đã bán
          </Button>
        </div>
      ),
      okButtonProps: { style: { display: "none" } },
    });
  };

  async function updateStatus(id, status) {
    try {
      const data = await APIService.updateStatusMarket(id, status);
      if (data) {
        getListMarket();
        Modal.destroyAll();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListBranch() {
    try {
      const data = await APIService.getListBranch();
      if (data) {
        const all = { name: "Tất cả", id: 0 };
        setListBranch([all, ...data.records]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getListCate() {
    try {
      const data = await APIService.getListCateMarket();
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

  async function getListMarket() {
    const segment = (currentPage - 1) * 10;
    try {
      const data = await APIService.getListMarket(
        segment,
        selectBranch,
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

  const handleChangeBranch = (value) => {
    setSelectBranch(value);
  };
  const handleChangeCate = (value) => {
    setSelectCate(value);
  };

  const handleChange = (value) => {
    setBlockChoose(value);
  };

  useEffect(() => {
    getListMarket();
  }, [currentPage]);

  useEffect(() => {
    getAllBlock();
    getListBranch();
    getListCate();
  }, []);

  return (
    <div>
      <div className="flex flex-row mb-6 justify-between">
        <div className="flex flex-row">
          <div>
            <p className="font-bold">Tiện ích/Dịch vụ</p>
            <Select
              defaultValue={selectBranch}
              style={{ width: 200 }}
              onChange={handleChangeBranch}
            >
              {listBranch.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </div>

          <div className="ml-4">
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
          </div>
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
                getListMarket();
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

export default ListShopping;
