import { useMediaQuery } from '@material-ui/core';
import React from 'react';

export const NotificationsIcon = () => {

    const matches = useMediaQuery(theme => theme.breakpoints.down('sm'));
    
    return (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width={matches ? 30 : 40} height={matches ? 30 : 40}
viewBox="0 0 100 100"
style={{fill:'#FFFFFF'}}>    <path d="M 50 14 C 47.933 14 46.135906 15.236797 45.378906 17.091797 C 34.149906 18.016797 24.924156 26.724031 23.535156 38.082031 L 20.107422 66.066406 C 17.221422 66.499406 15 68.995 15 72 C 15 75.309 17.691 78 21 78 L 41.058594 78 C 41.557594 82.493 45.375 86 50 86 C 54.625 86 58.442406 82.493 58.941406 78 L 79 78 C 82.309 78 85 75.309 85 72 C 85 68.995 82.779531 66.499406 79.894531 66.066406 L 76.466797 38.082031 C 75.076797 26.724031 65.852047 18.016797 54.623047 17.091797 C 53.865047 15.236797 52.067 14 50 14 z M 50 15 C 51.484 15 52.786516 15.803062 53.478516 17.039062 C 53.199516 17.029062 52.924531 17 52.644531 17 L 47.355469 17 C 47.074469 17 46.801437 17.029062 46.523438 17.039062 C 47.214437 15.803062 48.516 15 50 15 z M 47.355469 19 L 52.644531 19 C 63.744531 19 73.130469 27.309172 74.480469 38.326172 L 78.007812 67.121094 C 78.068813 67.623094 78.495 68 79 68 C 81.206 68 83 69.794 83 72 C 83 74.206 81.206 76 79 76 L 21 76 C 18.794 76 17 74.206 17 72 C 17 69.794 18.794 68 21 68 L 64.5 68 C 64.776 68 65 67.776 65 67.5 C 65 67.224 64.776 67 64.5 67 L 22.007812 67 L 25.517578 38.326172 C 26.867578 27.309172 36.256469 19 47.355469 19 z M 67.5 67 C 67.224 67 67 67.224 67 67.5 C 67 67.776 67.224 68 67.5 68 L 71.5 68 C 71.776 68 72 67.776 72 67.5 C 72 67.224 71.776 67 71.5 67 L 67.5 67 z M 73.5 67 C 73.224 67 73 67.224 73 67.5 C 73 67.776 73.224 68 73.5 68 L 75.5 68 C 75.776 68 76 67.776 76 67.5 C 76 67.224 75.776 67 75.5 67 L 73.5 67 z M 42.068359 78 L 57.929688 78 C 57.435687 81.94 54.072 85 50 85 C 45.928 85 42.563359 81.94 42.068359 78 z"></path></svg>
    )
}