// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5Eh4Xac45j-pf3Zmm48CP4GhzMSWLuPA",
  authDomain: "iotfarm-cd758.firebaseapp.com",
  projectId: "iotfarm-cd758",
  storageBucket: "iotfarm-cd758.firebasestorage.app",
  messagingSenderId: "310426902116",
  appId: "1:310426902116:web:81880a6e46c503c84d4971",
  measurementId: "G-KFV3ERNFE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Hàm upload file lên Firebase Storage và trả về URL
export async function uploadImageToFirebase(file, path = "avatars") {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const fileRef = ref(storage, `${path}/${Date.now()}_${safeName}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export { storage };