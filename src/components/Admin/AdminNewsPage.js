import React from "react";
import NewsForm from "./NewsForm";
import NewsListAdmin from "./NewsListAdmin";
import styles from '../../News.module.css';

const AdminNewsPage = () => {
  return (
    <div className={styles.adminNewsPage}>
      <NewsForm />
      <NewsListAdmin />
    </div>
  );
};

export default AdminNewsPage;