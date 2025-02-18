import React, {useState} from 'react'

const ClassButton = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  const containerStyle = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '15px',
    border: '3px solid #22c55e',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0.2rem',
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    transform: isHovered ? 'translateY(-3px)' :'translateY(0px)',
    backgroundColor: isSelected ? "#22c55e" : "#f4f4f5"
  }

  const numStyle = {
    transition: "all 0.1s ease-in-out",
    color: isSelected ? 'white' : '#22c55e',
    fontSize: "20px",
    userSelect: "none"
  }

  
  return (
    <div style={containerStyle}
    onMouseEnter = {() => setIsHovered(true)}
    onMouseLeave = {() => setIsHovered(false)}
    onClick={() => {
      setIsSelected(!isSelected);
      props.handleClassSelect(props.class)
      }}>
        <p style={numStyle}>{props.class}</p>
    </div>
  )
}

export default ClassButton