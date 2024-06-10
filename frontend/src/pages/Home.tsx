import { FC, useState, ChangeEvent } from "react";
import { useRecoilValue } from "recoil";
import { emailAtom, usernameAtom } from "../store";
import useAuth from "../hooks/useAuth";
import fetchData, { Method } from "../helpers/fetchData";
// import axios, { AxiosResponse } from "axios";

interface HomeProps { }

export const Home: FC<HomeProps> = () => {
  useAuth();

  const email = useRecoilValue(emailAtom);
  const username = useRecoilValue(usernameAtom);

  const [selectedImage, setSelectedImage] = useState<string>("");

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFileToBase(file);
      console.log(file);
    }
  };

  const setFileToBase = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async() => {
      setSelectedImage(reader.result as string);
    }
  }

  const handleSubmit = async () => {
    if (selectedImage) {
      const response = await fetchData({
        method: Method.POST,
        url: "/user/upload",
        body: { image : selectedImage },
        credentials: true
      });

      console.log("Upload response:", response);
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