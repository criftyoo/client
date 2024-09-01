import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllProdcasts,
  createProdcast,
  updateProdcast,
  deleteProdcast,
} from '../../redux/modules/prodcasts';

const AdminProdcastManager = () => {
  const dispatch = useDispatch();
  const { prodcasts, loading, error } = useSelector((state) => state.prodcasts);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingProdcast, setEditingProdcast] = useState(null);

  useEffect(() => {
    dispatch(fetchAllProdcasts());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProdcast) {
      dispatch(updateProdcast(editingProdcast._id, { title, description }));
    } else {
      dispatch(createProdcast({ title, description }));
    }
    setTitle('');
    setDescription('');
    setEditingProdcast(null);
  };

  const handleEdit = (prodcast) => {
    setEditingProdcast(prodcast);
    setTitle(prodcast.title);
    setDescription(prodcast.description);
  };

  const handleDelete = (id) => {
    dispatch(deleteProdcast(id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Manage Prodcasts</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {editingProdcast ? 'Update' : 'Create'}
        </button>
      </form>
      <ul>
        {prodcasts.map((prodcast) => (
          <li key={prodcast._id}>
            <h2>{prodcast.title}</h2>
            <p>{prodcast.description}</p>
            <button onClick={() => handleEdit(prodcast)}>Edit</button>
            <button onClick={() => handleDelete(prodcast._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProdcastManager;