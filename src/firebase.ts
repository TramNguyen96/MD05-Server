import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// thay config thành config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyAndetqmt474VMsWg9ZB5QLWjymvfCHWaA",
  authDomain: "md05-nestjs.firebaseapp.com",
  projectId: "md05-nestjs",
  storageBucket: "md05-nestjs.appspot.com",
  messagingSenderId: "1080583278013",
  appId: "1:1080583278013:web:f99c904775caf43ae5d6d4",
  measurementId: "G-BJ9LGVM87E"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToStorage(file: any, folderName: any, bufferData: any = undefined) {
    // nếu file là null thì không làm gì hết
    if (!file) {
        return false
    }

    let fileRef;
    let metadata;
    if (!bufferData) {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + file.name);
    } else {
        // tên file trên file base
        fileRef = ref(storage, `${folderName}/` + (file as any).filename);
        metadata = {
            contentType: (file as any).mimetype,
        };
    }
    let url;
    if (bufferData) {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, bufferData, metadata).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    } else {
        // upload file lên fire storage
        url = await uploadBytes(fileRef, file).then(async res => {
            // khi up thành công thì tìm URL
            return await getDownloadURL(res.ref)
                .then(url => url)
                .catch(er => false)
        })
    }


    return url
}