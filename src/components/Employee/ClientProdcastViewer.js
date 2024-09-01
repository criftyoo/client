import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProdcasts, fetchProdcastById, commentOnProdcast } from '../../redux/modules/prodcasts';
import { useParams } from 'react-router-dom';

const ClientProdcastViewer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { prodcasts, prodcast, loading, error } = useSelector((state) => state.prodcasts);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchProdcastById(id));
    } else {
      dispatch(fetchAllProdcasts());
    }
  }, [dispatch, id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    dispatch(commentOnProdcast(id, comment));
    setComment('');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {id ? (
        prodcast && (
          <div>
            <h1>{prodcast.title}</h1>
            <p>{prodcast.description}</p>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
              <button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        )
      ) : (
        <div>
          <h1>Prodcasts</h1>
          <ul>
            {prodcasts.map((prodcast) => (
              <li key={prodcast._id}>
                <h2>{prodcast.title}</h2>
                <p>{prodcast.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientProdcastViewer;