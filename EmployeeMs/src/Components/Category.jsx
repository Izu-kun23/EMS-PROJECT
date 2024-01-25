import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/category')
            .then(result => {
                if (result.data.Status) {
                    setCategory(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => {
                console.error(err);
                alert('An error occurred while fetching categories.');
            });
    }, []);

    const handleDelete = (categoryId) => {
        // Handle category deletion here
        console.log('Deleting category with ID:', categoryId);
    };

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Category List</h3>
            </div>
            <Link to="/dashboard/add_category" className='btn btn-danger my-3'>Add Category</Link>
            <div className='mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            category.map(c => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>
                                        <button className='btn btn-primary me-2'>Edit</button>
                                        <button className='btn btn-danger' onClick={() => handleDelete(c.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Category;
