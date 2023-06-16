// ** React Imports
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

// ** api config
import axios from '../../../../../service/axios';

// ** --------------------------------------------------------------------------
function CValidatedMissionModal(props) {
    // ** Props
    const { visibility, closeModal, row, refresh, closeMainModal } = props;
    // ** router
    const navigate = useNavigate();
    // ** access token
    const accesToken = localStorage.getItem(
      "access_token"
    );
    // ** states
    const [spinning, setSpinning] = useState(false);
    // ** on submit
    const onSubmit = async () => {
        setSpinning(true);
        try {
            const res= await axios.put(`mission/status/set/${row?.id}`)