import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadSchedule, clearUploadError } from "../../redux/modules/adminSlice";

const UploadSchedule = () => {
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState(null);
  const dispatch = useDispatch();
  
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

  const renderErrorTable = (error) => {
    if (Array.isArray(error)) {
      return (
        <div>
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
        </div>
      );
    }

    return <p className="upload-error-message">{typeof error === 'string' ? error : JSON.stringify(error)}</p>;
  };

  return (
    <div className="main upload-container">
      <div className="description">
        <h2>Schedule Uploader Instructions</h2>
        <ul>
          <li>Select a file to upload by clicking the "Choose File" button.</li>
          <li>Ensure the file is in the correct format ('.xlsx', '.xls').</li>
          <li>Click the "Upload" button to start the upload process.</li>
          <li>Wait for the upload to complete. You will see a progress bar indicating the upload status.</li>
          <li>If there are any errors, they will be displayed in a table below the form.</li>
          <li>Once the upload is complete, a success message will be displayed & the schedules will be shared with the employees over email.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="form1">
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