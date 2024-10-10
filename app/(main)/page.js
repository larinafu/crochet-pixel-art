"use client";
import Image from "next/image";
import { lato } from "@/utils/fonts";
import { useContext, useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import imageCompression from "browser-image-compression";
import { motion } from "framer-motion";
import { PixelsContext, PixelsProvider } from "@/utils/contexts/pixelsContext";

import TextButton from "@/components/general/buttons/textButton/textButton";

import styles from "./page.module.css";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();
  const pixelsContext = useContext(PixelsContext);
  console.log(pixelsContext.pixels);
  const setCurImg = pixelsContext.setCurImg;
  const inputRef = useRef(null);
  const [imageInfo, setImageInfo] = useState([null, ""]);
  const handleFileUpload = async (e) => {
    const imageFile = inputRef.current.files[0];
    if (imageFile) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(imageFile, options);
        setImageInfo([URL.createObjectURL(compressedFile), e.target.value]);
        // setCurImg(compressedFile);
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = function () {
          window.sessionStorage.setItem("curImg", reader.result);
        };
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <main className={styles.main}>
      <ToastContainer
        position="top-right"
        autoClose="3000"
        className={lato.className}
      />
      <motion.header
        initial={{ opacity: 0, y: "50%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className={styles.heading}>
          Knitting and Crochet Pixel Art Generator Tool
        </h1>
        <h2 className={styles.heading}>
          Pixelate any image for your next yarn creation.
        </h2>
      </motion.header>
      <form
        className={styles.imgUploadForm}
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/pixel-art");
        }}
      >
        <label className={styles.label} htmlFor="image_uploads">
          upload image
        </label>

        <input
          ref={inputRef}
          type="file"
          id="image_uploads"
          name="image_uploads"
          accept="image/jpg, image/jpeg, image/png, image/heic"
          onChange={(e) => {
            handleFileUpload(e);
          }}
        />
        <div className={`detailContainer ${styles.imgUploadContainer}`}>
          {imageInfo?.[0] && (
            <img
              className={styles.uploadedImg}
              src={imageInfo[0]}
              alt="uploaded image"
            />
          )}
        </div>

        {imageInfo[0] && (
          <motion.div
            initial={{ opacity: 0, y: "50%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <TextButton className={styles.uploadBtn}>Generate grid!</TextButton>
          </motion.div>
        )}
      </form>
    </main>
  );
}
