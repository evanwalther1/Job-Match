import React, { useState } from "react";
import styles from "/src/css.styles/JobPostForm.module.css";
import classNames from "classnames";
import { auth, storage } from "../firebase";
import { addJob, Job, saveLocation, updateJob } from "../FirebaseServices";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

interface Props {
  onClose: () => void;
  job: Job | null;
}
const JobEditForm: React.FC<Props> = ({ onClose, job }) => {
  const navigate = useNavigate();
  //New Job States
  const [newJobTitle, setNewJobTitle] = useState(job?.title);
  const [newJobDate, setNewJobDate] = useState(job?.date);
  const [newJobLocation, setNewJobLocation] = useState(job?.location);
  const [newJobDescription, setNewJobDescription] = useState(job?.description);
  const [newPaymentAmount, setNewPaymentAmount] = useState(job?.pay);
  const [cashAccept, setCashAccept] = useState(job?.cash);
  const [venmoAccept, setVenmoAccept] = useState(job?.venmo);
  const [cashAppAccept, setCashAppAccept] = useState(job?.cashApp);
  const [newImages, setImages] = useState<File[]>([]);
  const [newLat, setLat] = useState(job?.lat);
  const [newLng, setLng] = useState(job?.lng);

  const onSaveJob = async () => {
    console.log("Current User UID:", auth?.currentUser?.uid);
    try {
      if (!job?.id) {
        console.error("Job ID is missing!");
        return;
      }
      await updateJob(job.id, {
        title: newJobTitle,
        description: newJobDescription,
        date: newJobDate,
        location: newJobLocation,
        pay: newPaymentAmount,
        cash: cashAccept,
        venmo: venmoAccept,
        cashApp: cashAppAccept,
      });
      if (newLat && newLng) {
        saveLocation(job.id, newLat, newLng);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async (jobID: string) => {
    if (newImages.length != 0) {
      try {
        for (let i = 0; i < newImages.length; i++) {
          const imagesFolderRef = ref(storage, `${jobID}/${newImages[i].name}`);
          await uploadBytes(imagesFolderRef, newImages[i]);
        }
        setImages([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setLat(event.latLng.lat());
      setLng(event.latLng.lng());
    }
  };

  return (
    <div
      className={classNames(
        styles.formContainer,
        "bg-white shadow-xl rounded-lg p-6 w-full max-w-md mx-auto"
      )}
    >
      <div className={styles.inputGroup}>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel Edit
        </button>
      </div>
      <div className={styles.formBox}>
        <div className={styles.inputGroup}>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Job Title
          </label>
          <input
            id="title"
            placeholder="Building a Fence"
            value={newJobTitle}
            onChange={(e) => setNewJobTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className={styles.inputGroup}>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location
          </label>
          <input
            id="location"
            placeholder="City, Town, or Neighborhood"
            value={newJobLocation}
            onChange={(e) => setNewJobLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            zoom={6}
            center={{ lat: newLat ?? 42, lng: newLng ?? -88 }}
            onClick={handleMapClick}
          >
            <MarkerF
              position={{ lat: newLat ?? 42, lng: newLng ?? -88 }}
            ></MarkerF>
          </GoogleMap>
        </div>
        <div className={styles.inputGroup}>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Job Description
          </label>
          <div className={styles.description}>
            <textarea
              id="description"
              placeholder="Assemble a fence using a posthole digger and the wood that I painted..."
              value={newJobDescription}
              onChange={(e) => setNewJobDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Pay Amount in $
          </label>
          <input
            id="amount"
            type="number"
            onChange={(e) => setNewPaymentAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className={styles.inputGroup}>
          <label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image
          </label>
          <input
            id="images"
            type="file"
            multiple
            onChange={(e) =>
              setImages(e.target.files ? Array.from(e.target.files) : [])
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className={styles.inputGroup}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Options
          </label>
          <div className={classNames(styles.paymentGroup, "flex space-x-4")}>
            <label htmlFor="cash" className="inline-flex items-center">
              <input
                type="checkbox"
                id="cash"
                value="Cash"
                checked={cashAccept}
                onChange={(e) => setCashAccept(e.target.checked)}
                className="mr-2"
              />
              Cash
            </label>
            <label htmlFor="venmo" className="inline-flex items-center">
              <input
                type="checkbox"
                id="venmo"
                value="Venmo"
                checked={venmoAccept}
                onChange={(e) => setVenmoAccept(e.target.checked)}
                className="mr-2"
              />
              Venmo
            </label>
            <label htmlFor="cashapp" className="inline-flex items-center">
              <input
                type="checkbox"
                id="cashapp"
                value="CashApp"
                checked={cashAppAccept}
                onChange={(e) => setCashAppAccept(e.target.checked)}
                className="mr-2"
              />
              CashApp
            </label>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date Completed by
          </label>
          <input
            id="date"
            type="date"
            value={
              newJobDate instanceof Date
                ? newJobDate.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => setNewJobDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.postButton}>
            <button
              onClick={() => {
                onSaveJob();
                onClose();
              }}
            >
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobEditForm;
