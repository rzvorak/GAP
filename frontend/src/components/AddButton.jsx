import React, {useState} from 'react'
import { FaPlus } from "react-icons/fa6";

import '../styles/AddButton.css'

const AddButton = () => {
    const [isHovered, setIsHovered] = useState(false);

    const containerStyle = {
        width: '3rem',
        height: '3rem',
        borderRadius: '15px',
        border: '3px solid #22c55e',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0.2rem',
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0px)',
    }

    return (
        <div style={containerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
            <FaPlus size="1.5rem" className="FaPlus"/>
        </div>
    )
}

export default AddButton