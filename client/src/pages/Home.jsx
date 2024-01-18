import './styles/home.style.css'
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/listings/')
    .then(res => {
      setLoading(false);
      setListings(res.data);
    })
    .catch(err => {
      setLoading(false);
      console.log(err);
    })
  }, []);

  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this listing?');

    if (confirm) {
      axios.delete(`http://localhost:8000/listings/delete/${id}`)
      .then(res => {
        console.log(res.data);
        setListings(listings.filter(listing => listing.id !== id));
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

  return (
    <div className="home">
        <h1>All Listings</h1>
        <div className="listingsTable">
          <table className="table">
              <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  loading && (
                    <tr>
                      <td colSpan="4" className="loading">Loading...</td>
                    </tr>
                  )
                }
                {listings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="no-data">No listings found</td>
                  </tr>
                )}
                {
                  listings.length > 0 && listings.map(listing => (
                    <tr key={listing.id}>
                      <td>{listing.id}</td>
                      <td>{listing.name}</td>
                      <td>{listing.location}</td>
                      <td>{listing.status}</td>
                      <td className='btns'>
                        <Link to={`/view/${listing.id}`}>
                          <button type="button" className='btn'>View</button>
                        </Link>
                        <Link to={`/update/${listing.id}`}>
                          <button type="button" className='btn'>Update</button>
                        </Link>
                        <button onClick={() => handleDelete(listing.id)} className='btn-delete'>Delete</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
          </table>
        </div>
    </div>
  )
}
export default Home