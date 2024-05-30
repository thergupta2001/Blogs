import { FC, useState, ChangeEvent } from "react";
import { useRecoilValue } from "recoil";
import { emailAtom, usernameAtom } from "../store";
import useAuth from "../hooks/useAuth";
import axios, { AxiosResponse } from "axios";

interface HomeProps {}

export const Home: FC<HomeProps> = () => {
  useAuth();

  const email = useRecoilValue(emailAtom);
  const username = useRecoilValue(usernameAtom);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const imageFile = event.target.files[0];
      setSelectedImage(imageFile);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      console.error("No image selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", import.meta.env.PRESET_NAME as string);
      formData.append("cloud_name", import.meta.env.CLOUD_NAME as string);

      const response: AxiosResponse = await axios.post(import.meta.env.CLOUDINARY as string, formData);

      console.log(response);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      <div>
        Home {username} {email}
      </div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSubmit}>Upload</button>
    </>
  );
};