import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { app } from "./firebase"

export const uploadImageToFirebase = async (uri: any) => {
    try {
        const storage = getStorage(app)
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onload = function () {
              resolve(xhr.response)
            }
            xhr.onerror = function (e) {
              console.log(e)
              reject(new TypeError("Network request failed"))
            }
            xhr.responseType = "blob"
            xhr.open("GET", uri, true)
            xhr.send(null)
        })
        const storageRef = ref(storage, 'images/' + Date.now())
        const uploadTask = uploadBytesResumable(storageRef, blob, { contentType: 'image/*' })
        uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        })
        await uploadTask
        const URL = await getDownloadURL(uploadTask.snapshot.ref)
        return URL
    } catch (error) {
        console.error(error)
    }
}