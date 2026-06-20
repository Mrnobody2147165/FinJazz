import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export const uploadProfileImage = async (uid, file) => {
  const fileExtension = file.name.split('.').pop();
  const storageRef = ref(storage, `profileImages/${uid}/profile.${fileExtension}`);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};

export const uploadCompanyLogo = async (uid, file) => {
  const fileExtension = file.name.split('.').pop();
  const storageRef = ref(storage, `companyLogos/${uid}/logo.${fileExtension}`);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};

export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
