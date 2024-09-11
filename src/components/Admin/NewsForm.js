import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createNews, updateNews } from "../../redux/modules/newsSlice";
import styles from '../../News.module.css';

const NewsForm = ({ existingNews }) => {
  const [title, setTitle] = useState(existingNews ? existingNews.title : "");
  const [description, setDescription] = useState(
    existingNews ? existingNews.description : ""
  );
  const [image, setImage] = useState(existingNews ? existingNews.image : "");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newsData = { title, description, image };
    if (existingNews) {
      dispatch(updateNews(existingNews._id, newsData));
    } else {
      dispatch(createNews(newsData));
    }
    setIsModalOpen(false); // Close the modal after submission
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <button  onClick={() => setIsModalOpen(true)} >
        {existingNews ? "Edit News" : "Create News"}
      </button>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <form onSubmit={handleSubmit} className={styles.newsFormAdmin}>
              <h2>{existingNews ? "Edit News" : "Create News"}</h2>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's the title?"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's on your mind?"
                />
                <label className={styles.imageUpload}>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  <i className="fas fa-camera"></i>
                </label>
              </div>
              <button type="submit" className={styles.btnSubmit}>
                {existingNews ? "Update" : "Create"}
              </button>
              <button type="button" className={styles.btnClose} onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsForm;