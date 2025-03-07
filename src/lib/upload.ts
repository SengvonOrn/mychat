import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { resolvePath } from "react-router-dom";
// const upload = async (file: File) =>{
      
// const storage = getStorage();
// const storageRef = ref(storage, `images/${Date.now()+file.name}`);

// const uploadTask = uploadBytesResumable(storageRef, file);


// uploadTask.on('state_changed', 
//   (snapshot) => {
  
//     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log('Upload is ' + progress + '% done');
//     switch (snapshot.state) {
//       case 'paused':
//         console.log('Upload is paused');
//         break;
//       case 'running':
//         console.log('Upload is running');
//         break;
//     }
//   }, 
//   (error) => {

//   }, 
//   () => {
//     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//       resolvePath('File available at', downloadURL);
//     });
//   }
// );
// }
// export default upload;

// ===========> TypeScript

const upload = async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(error); 
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL); 
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    };
    
    export default upload;
    


