import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import APIService from "../service/APIService";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";


const BQLInfo = () => {
    const [editorState, setEditorState] = useState();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    async function getInfo() {
        try {
            const data = await APIService.getInfoBQL();
            if (data) {
                setName(data.record.name)
                setPhone(data.record.phone)
                const blocksFromHtml = htmlToDraft(data.record.data);
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                const _editorState = EditorState.createWithContent(contentState);
                setEditorState(_editorState)
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateInfo() {
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        try {
            const data = await APIService.updateInfoBQL(html, name, phone);
            if (data) {
                getInfo()

            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <div className='flex flex-col max-w-[650px]'>
            <div className="ml-4 flex flex-row items-center mb-3">
                <p className="font-bold mr-5">Tên</p>
                <Input
                    placeholder="Nhập tên"
                    style={{ width: 200 }}
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />
            </div>
            <div className="ml-4 flex flex-row items-center mb-3">
                <p className="font-bold mr-4">SĐT</p>
                <Input
                    placeholder="Nhập sdt"
                    style={{ width: 200 }}
                    value={phone}
                    onChange={(e) => {
                        setPhone(e.target.value)
                    }}
                />
            </div>
            <div className="mb-6 p-4 bg-white ">
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(html) => {
                        setEditorState(html);
                        console.log(html);
                    }}
                />
            </div>
            <Button
                style={{
                    alignSelf:'end',
                    backgroundColor: "#2fcc61",
                    alignItems: "center",
                    color: "white",
                    fontWeight: "bold",
                    width: 120
                }}

                onClick={() => {
                    updateInfo()

                }}
            >
                Cập nhật
            </Button>
        </div>
    );
};

export default BQLInfo;
