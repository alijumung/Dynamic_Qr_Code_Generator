import QrAdd from "./qr_add.jsx";
import QrEdit from "./qr_edit.jsx";
import QrTable from "./qr_table.jsx";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient.js";

function Qr() {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedQR, setSelectedQR] = useState(null);

    const navigate = useNavigate();

    const handleEdit = (QrId) => {
        setSelectedQR(QrId);
        setIsEditing(true);
    }

    const handleCancelEdit = () => {
        setSelectedQR(null);
        setIsEditing(false);
    }


    return (
        <>
            {isEditing ? (
               <QrEdit QrId={selectedQR} onCancel={handleCancelEdit}/>
            ) : (
                <QrAdd/>
            )}
           <QrTable onEdit={handleEdit}/>

        </>
    )
}
export default Qr