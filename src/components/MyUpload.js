import React, { useState } from "react";
import { Container, Col, Row } from "reactstrap";
import {
    Button,
    Image,
    Upload,
    message,

  } from "antd";
import {
    PlusCircleOutlined,
    DeleteOutlined,
    UploadOutlined,
  } from "@ant-design/icons";
import axios from "axios";

const MyUpload = (props) => {
    const [visible, setVisible] = useState(false);
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
            { file: fmData.get("image"), type: props.type, id: props.id ? props.id : 0  },
            config
          );
          debugger
          onSuccess(res.data);
        } catch (err) {
          console.log("Eroor: ", err);
          const error = new Error("Some error");
          onError({ err });
        }
      };

  return (
    <div className="">
      <p className="font-bold">{props.label}</p>
      <div className="flex flex-row items-center w-full mt-1 ">
        <div className="w-full h-[36px] border mr-4 flex items-center justify-between">
          {props.value &&
          props.value.length ? (
            <>
              <Button className="w-full" type="text" onClick={() => setVisible(true)}><p className="flex ml-2">{props.value}</p></Button>
              <Button
                type="text"
                onClick={() =>
                    props.onChange("")
                }
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
                props.onChange(info.file.response.data.image_data)
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
      <Image
        width={800}
        style={{ display: 'none' }}
        // src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        preview={{
          visible,
          src: props.url + props.value,
          onVisibleChange: value => {
            setVisible(value);
          },
        }}
      />
    </div>
  );
};

export default MyUpload;
