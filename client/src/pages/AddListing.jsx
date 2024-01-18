import { useEffect, useState } from 'react'
import './styles/addListing.style.css'
import axios from 'axios';
import { useNavigate } from 'react-router';

const AddListing = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        bedroom: 0,
        bath: 0,
        price: '',
        status: 'select',
        image: ''
    });
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setShowErrors(true);
            const timer = setTimeout(() => {
                setErrors({});
                setShowErrors(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errors])

    const handleFile = (e) => {
        setFile(e.target.files[0]);
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpload = () => {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('bedroom', formData.bedroom);
        formDataToSend.append('bath', formData.bath);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('image', file);

        axios.post('http://localhost:8000/listings/add', formDataToSend)
        .then((res) => {
            if (res.status === 200) {
                console.log("Upload success")
            } else {
                console.log("Upload failed")
            }
            window.alert('Listing added successfully');
            navigate('/');
        })
        .catch((err) => {
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.log(err);
            }
        })
    }

  return (
    <div className="add-listing">
        <h2>New Listing</h2>
        <form className="form">
            <div className="error" hidden={!showErrors}>
                {showErrors && (
                    <ul>
                        {Object.values(errors).map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
            </div>
            <label>Name</label>
            <input
                type="text"
                name='name'
                value={formData.name}
                onChange={handleChange}
            />
            <label>Location</label>
            <input
                type="text"
                name='location'
                value={formData.location}
                onChange={handleChange}
            />
            <div className="cols3">
                <label>Price</label>
                <input
                    type="number"
                    name='price'
                    value={formData.price}
                    onChange={handleChange}
                />
                <label>Bedroom</label>
                <input
                    type="number"
                    name='bedroom'
                    value={formData.bedroom}
                    onChange={handleChange}
                />
                <label>Bath</label>
                <input
                    type="number"
                    name='bath'
                    value={formData.bath}
                    onChange={handleChange}
                />
            </div>
            <div className="cols2">
                <label>Status</label>
                <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="select" disabled>Select Status</option>
                    <option value="Rent">Rent</option>
                    <option value="Sale">Sale</option>
                </select>
                <label>Image</label>
                <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleFile}
                />
            </div>
            <button type='button' onClick={handleUpload}>Add</button>
        </form>
    </div>
  )
}
export default AddListing