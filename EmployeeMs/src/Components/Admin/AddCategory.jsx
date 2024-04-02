import React, { useState } from 'react';
import './style.css'; // Ensure this is the correct path to your CSS file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddCategory = () => {
  const [category, setCategory] = useState('');
  const navigate = useNavigate()


  const handleInputChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    axios.post('http://localhost:3000/auth/add_category', { category })
      .then(result => {
        if(result.data.Status){
            navigate('/dashboard/category')
        } else {
            alert(result.data.Error)
        }
        // Handle success
      })
      .catch(err => {
        console.error(err);
        // Handle error
      });

    // Reset the category after submission
    setCategory('');
  };

  const handleReset = () => {
    setCategory('');
  };

  return (
    <div className="add-category-container h-75">
      <div className="form-container">
        <h3>Add Category</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">* Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={category}
              onChange={handleInputChange}
              placeholder="Enter category" // Placeholder text for the input
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="form-btn">Submit</button>
            <button type="button" className="form-btn" onClick={handleReset}>Reset</button>
            <button type="button" className="form-btn">Fill form</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
