import React, { useEffect } from "react";
import NewsForm from "./NewsForm";
import NewsListAdmin from "./NewsListAdmin";
import styles from '../../News.module.css';
import useLocalStorage from '../hooks/useLocalStorage'; // Import the custom hook

const AdminNewsPage = () => {
  const [newsFormData, setNewsFormData] = useLocalStorage('newsFormData', {
    title: '',
    content: ''
  });
  const [newsList, setNewsList] = useLocalStorage('newsList', []);

  // Function to handle form submission
  const handleFormSubmit = (formData) => {
    setNewsList([...newsList, formData]);
    setNewsFormData({ title: '', content: '' }); // Reset form data
  };

  // Function to handle form data change
  const handleFormDataChange = (newFormData) => {
    setNewsFormData(newFormData);
  };

  return (
    <div className={styles.adminNewsPage}>
      <NewsForm
        formData={newsFormData}
        onFormDataChange={handleFormDataChange}
        onFormSubmit={handleFormSubmit}
      />
      <NewsListAdmin newsList={newsList} />
    </div>
  );
};

export default AdminNewsPage;