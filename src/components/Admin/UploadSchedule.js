import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadSchedule, clearUploadError } from "../../redux/modules/admin";

const UploadSchedule = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  
  // Access Redux state
  const uploadProgress = useSelector((state) => state.admin.uploadProgress);
  const loading = useSelector((state) => state.admin.loading.upload);
  const message = useSelector((state) => state.admin.schedules.message); 
  const error = useSelector((state) => state.admin.error); 

  useEffect(() => {
    console.log("Component mounted or updated");
    console.log("Current error state:", error);
    console.log("Current message state:", message);
    console.log("Current uploadProgress state:", uploadProgress);

    return () => {
      console.log("Component unmounted");
      if (error) {
        dispatch(clearUploadError());
      }
    };
  }, [dispatch, error, message, uploadProgress]);

  const handleFileChange = (event) => {
    console.log("File selected:", event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    console.log("Submitting file:", file);
    const formData = new FormData();
    formData.append("file", file);

    dispatch(uploadSchedule(formData));
  };

  // Function to render error messages in a table
  const renderErrorTable = (error) => {
    console.log("Rendering error table with error:", error);

    if (Array.isArray(error)) {
      return (
        <table className="error-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {error.map((errorMsg, index) => {
              const [username, errorText] = errorMsg.split(", ");
              return (
                <tr key={index}>
                  <td>{username}</td>
                  <td>{errorText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    return <p className="upload-error-message">{typeof error === 'string' ? error : JSON.stringify(error)}</p>;
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-input">
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className="file-label"
          />
        </label>
        <button
          className="btn btn-primary upload-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && <p className="upload-message">{message}</p>}
      {error && (
        <>
          {console.log("Error state before rendering table:", error)}
          {renderErrorTable(error)}
        </>
      )}

      {uploadProgress > 0 && (
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${uploadProgress}%` }}
            aria-valuenow={uploadProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {uploadProgress}%
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSchedule;
