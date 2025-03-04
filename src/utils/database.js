import { equalTo, get, orderByChild, push, query, ref, remove, set, update } from 'firebase/database';
import { database } from './client';

// User Links CRUD Operations
export const createUserLink = async (userId, linkData) => {
  const newLinkRef = push(ref(database, `userLinks/${userId}/links`));
  const linkId = newLinkRef.key;

  await set(newLinkRef, {
    ...linkData,
    id: linkId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return { id: linkId, ...linkData };
};

export const getUserLinks = async (userId) => {
  const userLinksRef = ref(database, `userLinks/${userId}/links`);
  const snapshot = await get(userLinksRef);

  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));
  }

  return [];
};

export const getUserLinkById = async (userId, linkId) => {
  const linkRef = ref(database, `userLinks/${userId}/links/${linkId}`);
  const snapshot = await get(linkRef);

  if (snapshot.exists()) {
    return { id: linkId, ...snapshot.val() };
  }

  return null;
};

export const updateUserLink = async (userId, linkId, linkData) => {
  const linkRef = ref(database, `userLinks/${userId}/links/${linkId}`);

  await update(linkRef, {
    ...linkData,
    updatedAt: Date.now(),
  });

  return { id: linkId, ...linkData };
};

export const deleteUserLink = async (userId, linkId) => {
  const linkRef = ref(database, `userLinks/${userId}/links/${linkId}`);
  await remove(linkRef);
  return true;
};

// User Categories CRUD Operations
export const createUserCategory = async (userId, categoryData) => {
  const newCategoryRef = push(ref(database, `userLinks/${userId}/categories`));
  const categoryId = newCategoryRef.key;

  await set(newCategoryRef, {
    ...categoryData,
    id: categoryId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return { id: categoryId, ...categoryData };
};

export const getUserCategories = async (userId) => {
  const userCategoriesRef = ref(database, `userLinks/${userId}/categories`);
  const snapshot = await get(userCategoriesRef);

  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));
  }

  return [];
};

export const updateUserCategory = async (userId, categoryId, categoryData) => {
  const categoryRef = ref(database, `userLinks/${userId}/categories/${categoryId}`);

  await update(categoryRef, {
    ...categoryData,
    updatedAt: Date.now(),
  });

  return { id: categoryId, ...categoryData };
};

export const deleteUserCategory = async (userId, categoryId) => {
  const categoryRef = ref(database, `userLinks/${userId}/categories/${categoryId}`);
  await remove(categoryRef);
  return true;
};

// Public Links CRUD Operations (Admin only)
export const createPublicLink = async (linkData) => {
  const newLinkRef = push(ref(database, 'publicLinks'));
  const linkId = newLinkRef.key;

  await set(newLinkRef, {
    ...linkData,
    id: linkId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return { id: linkId, ...linkData };
};

export const getPublicLinks = async () => {
  const publicLinksRef = ref(database, 'publicLinks');
  const snapshot = await get(publicLinksRef);

  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));
  }

  return [];
};

export const getPublicLinksByCategory = async (categoryId) => {
  const publicLinksRef = ref(database, 'publicLinks');
  const categoryQuery = query(publicLinksRef, orderByChild('categoryId'), equalTo(categoryId));
  const snapshot = await get(categoryQuery);

  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));
  }

  return [];
};

export const updatePublicLink = async (linkId, linkData) => {
  const linkRef = ref(database, `publicLinks/${linkId}`);

  await update(linkRef, {
    ...linkData,
    updatedAt: Date.now(),
  });

  return { id: linkId, ...linkData };
};

export const deletePublicLink = async (linkId) => {
  const linkRef = ref(database, `publicLinks/${linkId}`);
  await remove(linkRef);
  return true;
};

// Public Categories CRUD Operations (Admin only)
export const createPublicCategory = async (categoryData) => {
  const newCategoryRef = push(ref(database, 'publicCategories'));
  const categoryId = newCategoryRef.key;

  await set(newCategoryRef, {
    ...categoryData,
    id: categoryId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return { id: categoryId, ...categoryData };
};

export const getPublicCategories = async () => {
  const publicCategoriesRef = ref(database, 'publicCategories');
  const snapshot = await get(publicCategoriesRef);

  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));
  }

  return [];
};

export const updatePublicCategory = async (categoryId, categoryData) => {
  const categoryRef = ref(database, `publicCategories/${categoryId}`);

  await update(categoryRef, {
    ...categoryData,
    updatedAt: Date.now(),
  });

  return { id: categoryId, ...categoryData };
};

export const deletePublicCategory = async (categoryId) => {
  const categoryRef = ref(database, `publicCategories/${categoryId}`);
  await remove(categoryRef);
  return true;
};

// User Management
export const createUserProfile = async (userId, userData) => {
  const userRef = ref(database, `users/${userId}`);

  await set(userRef, {
    ...userData,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    isAdmin: false, // Default to non-admin
  });

  return { id: userId, ...userData };
};

export const getUserProfile = async (userId) => {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return { id: userId, ...snapshot.val() };
  }

  return null;
};

export const updateUserProfile = async (userId, userData) => {
  const userRef = ref(database, `users/${userId}`);

  await update(userRef, {
    ...userData,
    lastLogin: Date.now(),
  });

  return { id: userId, ...userData };
};

export const checkIfAdmin = async (userId) => {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);

  if (snapshot.exists() && snapshot.val().isAdmin) {
    return true;
  }

  return false;
};
