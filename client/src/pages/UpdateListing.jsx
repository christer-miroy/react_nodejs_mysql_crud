import { useNavigate, useParams } from 'react-router';
import './styles/updateListing.style.css'
import { useEffect, useState } from 'react';
import axios from 'axios';


const UpdateListing = () => {
  const {id} = useParams();
  const defaultImage = 'default-image-url';
  const [listing, setListing] = useState({
    name: '',
    location: '',
    bedroom: 0,
    bath: 0,
    price: 0,
    status: 'select',
    image: defaultImage
  })
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getListing();
  }, []);

  const getListing = () => {
    axios.get(`http://localhost:8000/listings/${id}`)
    .then(res => {
      console.log(res.data)
      setListing(res.data[0])
    })
    .catch(err => {
      console.log(err)
    })
  }

  const handleFile = (e) => {
    setFile(e.target.files[0]);
}

  const handleSubmit = () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', listing.name);
    formDataToSend.append('location', listing.location);
    formDataToSend.append('bedroom', listing.bedroom);
    formDataToSend.append('bath', listing.bath);
    formDataToSend.append('price', listing.price);
    formDataToSend.append('status', listing.status);
    formDataToSend.append('image', file);

    axios.put(`http://localhost:8000/listings/update/${id}`, formDataToSend)
    .then(res => {
      console.log(res.data)
      window.alert('Listing updated successfully')
      navigate('/')
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="add-listing">
        <h2>Update Listing</h2>
        <form className="form">
            <input
                type="text"
                name='name'
                placeholder="Name"
                value={listing.name}
                onChange={(e) => setListing({...listing, name: e.target.value})}
            />
            <input
                type="text"
                name='location'
                placeholder="Location"
                value={listing.location}
                onChange={(e) => setListing({...listing, location: e.target.value})}
            />
            <input
                type="number"
                name='price'
                placeholder="Price"
                value={listing.price}
                onChange={(e) => setListing({...listing, price: e.target.value})}
            />
            <input
                type="number"
                name='bedroom'
                placeholder="Bedroom"
                value={listing.bedroom}
                onChange={(e) => setListing({...listing, bedroom: e.target.value})}
            />
            <input
                type="number"
                name='bath'
                placeholder="Bathroom"
                value={listing.bath}
                onChange={(e) => setListing({...listing, bath: e.target.value})}
            />
            <select
                name="status"
                id="status"
                onChange={(e) => setListing({...listing, status: e.target.value})}
                value={listing.status}
            >
                <option value="select" disabled>Select Status</option>
                <option value="Rent">Rent</option>
                <option value="Sale">Sale</option>
            </select>
            <input
                type="file"
                name="image"
                id="image"
                accept='image/*'
                onChange={handleFile}
            />
            <button type='button' onClick={handleSubmit}>Update</button>
        </form>
    </div>
  )
}
export default UpdateListing