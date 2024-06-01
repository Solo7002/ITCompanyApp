import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../hooks/useAuth";
import axios from "axios";
import keys from "../../../config/keys";

const FileUpload = (props) => {
    const {token} = useAuth();

    const handleUpload = async (event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        axios.post(`${keys.ServerConnection}/Files/upload/${props.folder}`, formData, {headers: {
            Authorization:`Bearer ${token}`
        }})
        .then(res => {
            console.log('File uploaded successfully: ', res.data);
            if (props.setFile){
                props.setFile(res.data.folderFile);
            }
        })
        .catch(err => {
            console.log("Upload faild, err: ", err)
        });
    };

    return (
        <div>
            <input id={props.id?props.id:""} type="file" onChange={handleUpload} required={true}/>
        </div>
    );
}

export default FileUpload;
