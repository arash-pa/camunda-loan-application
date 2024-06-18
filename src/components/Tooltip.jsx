import InfoIcon from '@mui/icons-material/Info';
import React from 'react';
import './Tooltip.css'

const Tooltip = ({ title, instructions }) => {
    return (
        <div class="label-and-tooltip">
            <p style={{fontWeight:"500"}}>{title}</p>
            <section class="tooltip" data-tooltip={instructions} data-multiplier="2"><InfoIcon fontSize='20px' color='primary' /></section>
        </div>
    )
}

export default Tooltip