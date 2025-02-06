import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import axiosInstance from "../api/api";
import { NavItems } from '../main/Main';
import NavPage from '../NavPage';

const GameDetailPage = () => {
    const { id } = useParams();
    const [details, setDetails] = useState();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('Authorization');
                if (!token) {
                    console.log('Authorization token is missing.');
                    navigate('/redirect')
                }

                const response = await axiosInstance.get(`/games/${id}`);
                setDetails(response.data)
            } catch (err) {
                setError("Failed to fetch game detail: " + err.message);
            }
        };
        fetchDetails();
    }, []);

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <NavPage />
            <div>Game Id: {id}</div>
        </div>
    )
}

export default GameDetailPage;