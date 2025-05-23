import React, { useRef, useState } from "react";
import styles from "/src/css.styles/JobPostForm.module.css";
import classNames from "classnames";
import { auth, storage } from "../firebase";
import { addJob, saveLocation } from "../FirebaseServices";
import { ref, uploadBytes } from "firebase/storage";
import { Circle, GoogleMap, MarkerF } from "@react-google-maps/api";
import { Timestamp } from "firebase/firestore";
interface Props {
  onClose: () => void;
}

const JobPostForm: React.FC<Props> = ({ onClose }) => {
  //New Job States
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDate, setNewJobDate] = useState<Timestamp | null>(null);
  const [newJobLocation, setNewJobLocation] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [newPaymentAmount, setNewPaymentAmount] = useState(Number);
  const [cashAccept, setCashAccept] = useState(false);
  const [venmoAccept, setVenmoAccept] = useState(false);
  const [cashAppAccept, setCashAppAccept] = useState(false);
  const [newImages, setImages] = useState<File[]>([]);
  const [newLat, setLat] = useState(42);
  const [newLng, setLng] = useState(-88);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onPostJob = async () => {
    console.log("Current User UID:", auth?.currentUser?.uid);
    try {
      const jobID = await addJob({
        title: newJobTitle,
        description: newJobDescription,
        date: newJobDate,
        location: newJobLocation,
        pay: newPaymentAmount,
        cash: cashAccept,
        venmo: venmoAccept,
        cashApp: cashAppAccept,
        employerID: auth?.currentUser?.uid,
        completed: false,
        workersFound: false,
      });
      saveLocation(jobID, newLat, newLng);
      setNewJobTitle("");
      setNewJobDate(null);
      setNewJobLocation("");
      setNewJobDescription("");
      setNewPaymentAmount(0);
      setLat(42);
      setLng(-88);
      setCashAccept(false);
      setVenmoAccept(false);
      setCashAppAccept(false);
      uploadFile(jobID);
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

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
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
      <div className={styles.formBox}>
        {/* X Button in the top-right corner */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close Form"
        >
          X
        </button>
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
            center={{ lat: newLat, lng: newLng }}
            onClick={handleMapClick}
            onLoad={onMapLoad}
          >
            <MarkerF position={{ lat: newLat, lng: newLng }}></MarkerF>
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
            // value={newJobDate}
            // onChange={(e) => setNewJobDate(e.target.value)}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value + "T00:00:00");
              setNewJobDate(Timestamp.fromDate(selectedDate));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.postButton}>
            <button
              onClick={() => {
                onPostJob();
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

export default JobPostForm;
