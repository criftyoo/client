import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const useFetchData = (actionCreator, selector) => {
  const dispatch = useDispatch();
  const data = useSelector(selector);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(actionCreator());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, actionCreator]);

  return { data: Array.isArray(data) ? data : [], loading, error }; // Ensure data is an array
};

export default useFetchData;