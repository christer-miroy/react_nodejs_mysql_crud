  import { useParams } from 'react-router'
  import './styles/viewListing.style.css'
  import { useState } from 'react';
  import { useEffect } from 'react';
  import axios from 'axios';

  const ViewListing = () => {
    const {id} = useParams();
    const [listing, setListing] = useState({
      id: "",
      name: "",
      location: "",
      bedroom: 0,
      bath: 0,
      price: 0,
      status: "",
      image: "",
    });

    useEffect(() => {
      getListing();
    }, [])

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

    return (
      <div className='details'>
          <h1>Listing Details</h1>
          <div className="listingDetail">
              <div className="detailImg">
                <img src={`http://localhost:8000/images/${listing.image}`} alt={listing.name} />
              </div>
              <div className="listingTxt">
                  <strong><p>{listing.name}</p></strong>
                  <strong><p>{listing.location}</p></strong>
                  <p>Bedrooms: {listing.bedroom}</p>
                  <p>Bathrooms: {listing.bath}</p>
                  <p>Price: ${Number(listing.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {listing.status === "Rent" ? "/ month" : ""}</p>
                  <p>Status: {listing.status}</p>
              </div>
          </div>
      </div>
    )
  }
  export default ViewListing