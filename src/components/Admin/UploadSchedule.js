import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadSchedule, clearUploadError } from "../../redux/modules/admin";

const UploadSchedule = () => {
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState(null);
  const dispatch = useDispatch();
  
  // Access Redux state
  const uploadProgress = useSelector((state) => state.admin.uploadProgress);
  const loading = useSelector((state) => state.admin.loading.upload);
  const message = useSelector((state) => state.admin.schedules.message); 
  const error = useSelector((state) => state.admin.error); 

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearUploadError());
      }
    };
  }, [dispatch, error, message, uploadProgress]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await dispatch(uploadSchedule(formData));
    } catch (err) {
      setLocalError("An error occurred during the upload. Please try again.");
    }
  };

  // Function to render error messages in a table
  const renderErrorTable = (error) => {
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
      {(error || localError) && (
        <>
          {localError && <p className="upload-error-message">{localError}</p>}
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