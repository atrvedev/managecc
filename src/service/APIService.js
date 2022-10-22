import { message } from "antd";
import axios from "axios";
import HistoryService from "./HistoryService";

const DOMAIN = "http://61.28.229.181:11111/";

class APIService {
  constructor() {
    if (!APIService.instance) {
      APIService.instance = this;
    }
    return APIService.instance;
  }

  get = async (func, params = {}) => {
    let url = DOMAIN + func;
    const headers = {
      token: window.localStorage.getItem("token"),
    };
    const response = await axios.get(url, { headers, params });
    return response.data;
  };

  post = async (func, params = {}, body = {}, headers = {}) => {
    message.loading({ content: "Loading...", key: "load", duration: 0 });
    const token = window.localStorage.getItem("token");
    if (token) {
      headers.token = token;
    }
    let url = DOMAIN + func;
    const response = await axios.post(url, body, {
      headers: headers,
      params,
    });
    return response.data;
  };

  put = async (func, params = {}) => {
    message.loading({ content: "Loading...", key: "load", duration: 0 });
    let url = DOMAIN + func;
    const response = await axios.put(url, params);
    return response.data;
  };

  execute = async (response, isShowProgress) => {
    try {
      if (response.code === 1) {
        if (response.data) {
          console.log(response.data);
          if (isShowProgress) {
            message.success({ content: "Thao tác thành công!", key: "load" });
          }
          return response.data;
        }
        return response;
      } else if (response.code === -1) {
        // let navigate = useNavigate();

        window.localStorage.setItem("token", "");
        window.localStorage.setItem("name", "");
        HistoryService.replace("/login");
      }
      message.error({ content: response.error, key: "load" });
      throw response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getDefaultParams = () => {
    let params = {};
    return params;
  };

  login = async (username, password, customer) => {
    try {
      let body = {};
      body.username = username;
      body.password = password;
      let headers = {};
      headers.customer = customer;
      const response = await this.post(
        "login/loginWithStaff",
        {},
        body,
        headers
      );
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getInfoBQL = async () => {
    try {
      const response = await this.get("bql/getInfo");
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateInfoBQL = async (dataHtml, name, phone) => {
    try {
      let body = {};
      body.data = dataHtml;
      body.name = name;
      body.phone = phone;
      const response = await this.post("bql/updateInfo", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getConversation = async (segment, block_id, apartment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.block_id = block_id;
      params.apartment = apartment;
      params.search = search;
      const response = await this.get("conversation/getAll", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getDetailConversation = async (id) => {
    try {
      let params = {};
      params.id = id;
      const response = await this.get("conversation/getDetail", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  replyChat = async (conversation_id, type_content, value_content) => {
    try {
      let body = {};
      body.conversation_id = conversation_id;
      body.type_content = type_content;
      body.value_content = value_content;
      const response = await this.post("conversation/reply", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getAllBlock = async () => {
    try {
      const response = await this.get("block/getAll");
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getComplain = async (segment, block_id, apartment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.block_id = block_id;
      params.apartment = apartment;
      params.search = search;
      const response = await this.get("complain/getAll", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getNotification = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      const response = await this.get("notification/getAll", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getDetailComplain = async (id) => {
    try {
      let params = {};
      params.id = id;
      const response = await this.get("complain/getDetail", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  replyComplain = async (conversation_id, type_content, value_content) => {
    try {
      let body = {};
      body.conversation_id = conversation_id;
      body.type_content = type_content;
      body.value_content = value_content;
      const response = await this.post("complain/reply", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusComplain = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("complain/updateStatus", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  createNoti = async (type, customer, title, content, image) => {
    try {
      let body = {};
      body.type = type;
      body.customer = customer;
      body.title = title;
      body.content = content;
      body.image = image;
      const response = await this.post("notification/create", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getDetailNoti = async (id) => {
    try {
      let params = {};
      params.id = id;
      const response = await this.get("notification/getOne", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateNoti = async (id, type, customer, title, content, image, status) => {
    try {
      let body = {};
      body.id = id;
      body.type = type;
      body.customer = customer;
      body.title = title;
      body.content = content;
      body.image = image;
      body.status = status;
      const response = await this.post("notification/update", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListAccountRegister = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      params.block_id = 0;
      params.apartment = "";
      const response = await this.get("account/getListAccountRegister", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListCustomer = async (segment, search, block_id, apartment) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      params.block_id = block_id;
      params.apartment = apartment;
      const response = await this.get("account/getListCustomer", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListMember = async (segment, search, block_id, apartment) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      params.block_id = block_id;
      params.apartment = apartment;
      const response = await this.get("account/getListMember", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateAccount = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("account/updateAccount", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateCustomer = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("account/updateCustomer", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getNews = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      const response = await this.get("news/getAll", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getDetailNews = async (id) => {
    try {
      let params = {};
      params.id = id;
      const response = await this.get("news/getOne", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  createNews = async (type, customer, title, content, image, pdf_file) => {
    try {
      let body = {};
      body.type = 0;
      body.customer = customer;
      body.title = title;
      body.content = content;
      body.image = image;
      body.pdf_file = pdf_file
      const response = await this.post("news/create", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateNews = async (id, type, customer, title, content, image, status, pdf_file) => {
    try {
      let body = {};
      body.id = id;
      body.type = 0;
      body.customer = customer;
      body.title = title;
      body.content = content;
      body.image = image;
      body.status = status;
      body.pdf_file = pdf_file;
      const response = await this.post("news/update", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListService = async (id) => {
    try {
      let params = {};

      const response = await this.get("service/getListService", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListCate = async (id) => {
    try {
      let params = {};
      params.agent_id = id;
      const response = await this.get("service/getListCate", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListServiceAgent = async (segment, service_id, cate, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.service_id = service_id;
      params.cate = cate;
      params.search = search;
      const response = await this.get("service/getAll", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListRegisUse = async (
    segment,
    service_id,
    cate,
    search,
    block_id,
    apartment
  ) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.service_id = service_id;
      params.cate = cate;
      params.search = search;
      params.block_id = block_id;
      params.apartment = apartment;
      const response = await this.get("service/getAllServiceOrder", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusRegisUse = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("service/updateStatus", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusServiceAgent = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post(
        "service/updateStatusServiceOfAgent",
        {},
        body
      );
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListBranch = async () => {
    try {
      let params = {};
      const response = await this.get("market/getListMarket", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListMarket = async (
    segment,
    market_id,
    cate,
    search,
    block_id,
    apartment
  ) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.market_id = market_id;
      params.cate = cate;
      params.search = search;
      params.block_id = block_id;
      params.apartment = apartment;
      const response = await this.get("market/getAll", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListCateMarket = async () => {
    try {
      let params = {};
      const response = await this.get("market/getListCate", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusMarket = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("market/updateStatus", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getCustomerInfo = async (id) => {
    try {
      let params = {};
      params.id = id;
      const response = await this.get("account/getCustomerInfo", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateCustomerUseApp = async (
    id,
    block_id,
    aparment,
    fullname,
    address,
    birthday,
    cmnd_number,
    cmnd_image_front_side,
    cmnd_image_back_side,
    gentle
  ) => {
    try {
      let body = {};
      body.id = id;
      body.block_id = block_id;
      body.apartment_code = aparment;
      body.fullname = fullname;
      body.address = address;
      body.birthday = birthday;
      body.identity_number = cmnd_number;
      body.front_identity_card = cmnd_image_front_side;
      body.back_identity_card = cmnd_image_back_side;
      body.gender = gentle;
      const response = await this.post(
        "account/updateCustomerUseApp",
        {},
        body
      );
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getAllBranch = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      const response = await this.get("market/getAllNganh", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  addBranchMarket = async (name, image) => {
    try {
      let body = {};
      body.name = name;
      body.image = image;
      const response = await this.post("market/addMarket", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateBranchMarket = async (id, name, image) => {
    try {
      let body = {};
      body.id = id;
      body.name = name;
      body.image = image;
      const response = await this.post("market/updateMarket", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getAllCate = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      const response = await this.get("market/getAllDanhMuc", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  addCateMarket = async (name, market_id) => {
    try {
      let body = {};
      body.name = name;
      body.market_id = market_id;
      const response = await this.post("market/addMarketCate", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateCateMarket = async (id, name, market_id) => {
    try {
      let body = {};
      body.id = id;
      body.name = name;
      body.market_id = market_id;
      const response = await this.post("market/updateMarketCate", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusNganh = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("market/updateStatusNganh", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusDanhmuc = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("market/updateStatusDanhMuc", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getAllBranchService = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      const response = await this.get("service/getAllNganh", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  addBranchService = async (
    name,
    type,
    description,
    time,
    cost,
    image,
    icon
  ) => {
    try {
      let body = {};
      body.name = name;
      body.image = image;
      body.description = description;
      body.time = time;
      body.cost = cost;
      body.type = type;
      body.icon = icon;
      const response = await this.post("service/addService", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateBranchService = async (
    id,
    name,
    type,
    description,
    time,
    cost,
    image,
    icon
  ) => {
    try {
      let body = {};
      body.id = id;
      body.name = name;
      body.type = type;
      body.image = image;
      body.description = description;
      body.time = time;
      body.cost = cost;
      body.icon = icon;
      const response = await this.post("service/updateService", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getAllCateService = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      const response = await this.get("service/getAllDanhMuc", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  addCateService = async (name, description, service_id, agent_id) => {
    try {
      let body = {};
      body.name = name;
      body.description = description;
      body.service_id = service_id;
      body.agent_id = agent_id;
      const response = await this.post("service/addServiceCate", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateCateService = async (id, name, description, service_id, agent_id) => {
    try {
      let body = {};
      body.id = id;
      body.name = name;
      body.description = description;
      body.service_id = service_id;
      body.agent_id = agent_id;
      const response = await this.post("service/updateServiceCate", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusDanhmucService = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("service/updateStatusDanhMuc", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusNganhService = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("service/updateStatusNganh", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListAgent = async () => {
    try {
      const response = await this.get("service/getListAgent");
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getAllAgent = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      const response = await this.get("service/getAllAgent", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  addAgent = async (name, description, address, phone, time, image) => {
    try {
      let body = {};
      body.name = name;
      body.image = image;
      body.address = address;
      body.phone = phone;
      body.description = description;
      body.time = time;
      const response = await this.post("service/addAgent", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateAgent = async (id, name, description, address, phone, time, image) => {
    try {
      let body = {};
      body.id = id;
      body.name = name;
      body.image = image;
      body.address = address;
      body.phone = phone;
      body.description = description;
      body.time = time;
      const response = await this.post("service/updateAgent", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusAgent = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("service/updateStatusAgent", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListBill = async (segment, search, apartment, type, status) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      params.apartment = apartment;
      params.type = type;
      params.status = status;
      const response = await this.get("billing/getAll", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListBillCode = async (segment, search, apartment, type) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      params.apartment = apartment;
      params.type = type;
      const response = await this.get("billing/getAllBillingCode", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getListBillSetting = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      const response = await this.get("billing/getAllBillingSetting", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  addServiceProduct = async (
    name,
    description,
    cate_id,
    time,
    price,
    image
  ) => {
    try {
      let body = {};
      body.name = name;
      body.image = image;
      body.description = description;
      body.time = time;
      body.cate_id = cate_id;
      body.price = price;
      const response = await this.post("service/addServiceProduct", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateServiceProduct = async (
    id,
    name,
    description,
    cate_id,
    time,
    price,
    image
  ) => {
    try {
      let body = {};
      body.id = id;
      body.name = name;
      body.image = image;
      body.description = description;
      body.time = time;
      body.cate_id = cate_id;
      body.price = price;
      const response = await this.post(
        "service/updateServiceProduct",
        {},
        body
      );
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getBillType = async () => {
    try {
      const response = await this.get("billing/getAllBillingType");
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  addBill = async (
    name,
    description,
    apartment_code,
    total_money,
    billing_type_id,
    phone,
    from_date,
    to_date,
    billDetails
  ) => {
    try {
      let body = {};
      body.name = name;
      body.description = description;
      body.total_money = total_money;
      body.apartment_code = apartment_code;
      body.billing_type_id = billing_type_id;
      body.phone = phone;
      body.from_date = from_date;
      body.to_date = to_date;
      body.billDetails = billDetails;
      const response = await this.post("billing/addBill", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateBill = async (
    id,
    name,
    description,
    apartment_code,
    total_money,
    billing_type_id,
    phone,
    from_date,
    to_date,
    billDetails
  ) => {
    try {
      let body = {};
      body.id = id;
      body.name = name;
      body.description = description;
      body.total_money = total_money;
      body.apartment_code = apartment_code;
      body.billing_type_id = billing_type_id;
      body.phone = phone;
      body.from_date = from_date;
      body.to_date = to_date;
      body.billDetails = billDetails
      const response = await this.post("billing/updateBill", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  addBillCode = async (
    name,
    description,
    apartment_code,
    billing_type_id,
    phone,
    billing_code
  ) => {
    try {
      let body = {};
      body.name = name;
      body.description = description;
      body.apartment_code = apartment_code;
      body.billing_type_id = billing_type_id;
      body.phone = phone;
      body.billing_code = billing_code;
      const response = await this.post("billing/addBillingCode", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateBillCode = async (
    id,
    name,
    description,
    apartment_code,
    billing_type_id,
    phone,
    billing_code
  ) => {
    try {
      let body = {};
      body.id = id;
      body.name = name;
      body.description = description;
      body.apartment_code = apartment_code;
      body.billing_type_id = billing_type_id;
      body.phone = phone;
      body.billing_code = billing_code;
      const response = await this.post("billing/updateBillingCode", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  addBillSetting = async (
    description,
    total_money,
    billing_type_id,
    billing_frequence_id,
    frequence_value,
    setting_type
  ) => {
    try {
      let body = {};
      body.description = description;
      body.total_money = total_money;
      body.billing_type_id = billing_type_id;
      body.billing_frequence_id = billing_frequence_id;
      body.frequence_value = frequence_value;
      body.setting_type = setting_type;
      const response = await this.post("billing/addBillingSetting", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateBillSetting = async (
    id,
    description,
    total_money,
    billing_type_id,
    billing_frequence_id,
    frequence_value,
    setting_type
  ) => {
    try {
      let body = {};
      body.id = id;
      body.description = description;
      body.total_money = total_money;
      body.billing_type_id = billing_type_id;
      body.billing_frequence_id = billing_frequence_id;
      body.frequence_value = frequence_value;
      body.setting_type = setting_type;
      const response = await this.post(
        "billing/updateBillingSetting",
        {},
        body
      );
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatus = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post("billing/updateStatus", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusBillingSetting = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post(
        "billing/updateStatusBillingSetting",
        {},
        body
      );
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusBillingCode = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post(
        "billing/updateStatusBillingCode",
        {},
        body
      );
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  getAllBillingImport = async (segment, search) => {
    try {
      let params = {};
      params.offset = 10;
      params.segment = segment;
      params.search = search;
      const response = await this.get("billing/getAllBillingImport", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  importBilling = async (body) => {
    try {
      const response = await this.post("billing/importBilling", {}, body);
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  updateStatusBillingImport = async (id, status) => {
    try {
      let body = {};
      body.id = id;
      body.status = status;
      const response = await this.post(
        "billing/updateStatusBillingImport",
        {},
        body
      );
      const data = await this.execute(response, true);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  searchCustomer = async (search) => {
    try {
      let params = {};
      params.offset = 5;
      params.segment = 0;
      params.search = search;
      const response = await this.get("account/searchCustomer", params);
      const data = await this.execute(response, false);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

}

const instance = new APIService();
Object.freeze(instance);
export default instance;
