'use client';

import AddCategoryForm from '@/components/AddCategoryForm';
import AddLinkForm from '@/components/AddLinkForm';
import CategoryCard from '@/components/CategoryCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import LinkCard from '@/components/LinkCard';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { useAuth } from '@/utils/context/authContext';
import { useToast } from '@/utils/context/toastContext';
import { createUserCategory, createUserLink, deleteUserCategory, deleteUserLink, getUserCategories, getUserLinks, updateUserCategory, updateUserLink } from '@/utils/database';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function UserDashboard() {
  const { user, userLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Link modal states
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isEditLinkModalOpen, setIsEditLinkModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);

  // Category modal states
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Delete confirmation dialog states
  const [isDeleteLinkDialogOpen, setIsDeleteLinkDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && !userLoading) {
        try {
          setIsLoading(true);
          const [userLinks, userCategories] = await Promise.all([getUserLinks(user.uid), getUserCategories(user.uid)]);

          setLinks(userLinks);
          setCategories(userCategories);
        } catch (error) {
          console.error('Error fetching user data:', error);
          showError('Failed to load your data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, userLoading, showError]);

  // Link CRUD operations
  const handleAddLink = async (linkData) => {
    try {
      const newLink = await createUserLink(user.uid, linkData);
      setLinks((prevLinks) => [...prevLinks, newLink]);
      setIsAddLinkModalOpen(false);
      showSuccess('Link added successfully!');
    } catch (error) {
      console.error('Error adding link:', error);
      showError('Failed to add link. Please try again.');
      throw error; // Re-throw to be caught by the form
    }
  };

  const handleEditLink = async (linkData) => {
    try {
      const updatedLink = await updateUserLink(user.uid, currentLink.id, linkData);
      setLinks((prevLinks) => prevLinks.map((link) => (link.id === updatedLink.id ? updatedLink : link)));
      setIsEditLinkModalOpen(false);
      setCurrentLink(null);
      showSuccess('Link updated successfully!');
    } catch (error) {
      console.error('Error updating link:', error);
      showError('Failed to update link. Please try again.');
      throw error; // Re-throw to be caught by the form
    }
  };

  const handleDeleteLink = async () => {
    if (!linkToDelete) return;

    try {
      setIsDeleting(true);
      await deleteUserLink(user.uid, linkToDelete);
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkToDelete));
      showSuccess('Link deleted successfully!');
    } catch (error) {
      console.error('Error deleting link:', error);
      showError('Failed to delete link. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteLinkDialogOpen(false);
      setLinkToDelete(null);
    }
  };

  // Category CRUD operations
  const handleAddCategory = async (categoryData) => {
    try {
      const newCategory = await createUserCategory(user.uid, categoryData);
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setIsAddCategoryModalOpen(false);
      showSuccess('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      showError('Failed to add category. Please try again.');
      throw error; // Re-throw to be caught by the form
    }
  };

  const handleEditCategory = async (categoryData) => {
    try {
      const updatedCategory = await updateUserCategory(user.uid, currentCategory.id, categoryData);
      setCategories((prevCategories) => prevCategories.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)));
      setIsEditCategoryModalOpen(false);
      setCurrentCategory(null);
      showSuccess('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      showError('Failed to update category. Please try again.');
      throw error; // Re-throw to be caught by the form
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);

      // Check if category has links
      const categoryLinks = links.filter((link) => link.categoryId === categoryToDelete);
      if (categoryLinks.length > 0) {
        showError('Cannot delete category that contains links. Please remove the links first or reassign them to another category.');
        return;
      }

      await deleteUserCategory(user.uid, categoryToDelete);
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryToDelete));
      showSuccess('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('Failed to delete category. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteCategoryDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Modal open handlers
  const openEditLinkModal = (link) => {
    setCurrentLink(link);
    setIsEditLinkModalOpen(true);
  };

  const openDeleteLinkDialog = (linkId) => {
    setLinkToDelete(linkId);
    setIsDeleteLinkDialogOpen(true);
  };

  const openEditCategoryModal = (category) => {
    setCurrentCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  const openDeleteCategoryDialog = (categoryId) => {
    setCategoryToDelete(categoryId);
    setIsDeleteCategoryDialogOpen(true);
  };

  if (userLoading || isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8">
        {/* User Profile Section */}
        <section className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {user?.photoURL && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" />
              </div>
            )}
            <div className="flex flex-col text-center md:text-left">
              <h1 className="h2-bold text-dark100_light900">My Dashboard</h1>
              <p className="paragraph-regular text-dark300_light700 mt-2">Manage your personal collection of developer resources</p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
            <h2 className="h3-bold text-dark100_light900">My Links</h2>
            <p className="h2-bold text-primary-500 mt-2">{links.length}</p>
          </div>
          <div className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
            <h2 className="h3-bold text-dark100_light900">Categories</h2>
            <p className="h2-bold text-primary-500 mt-2">{categories.length}</p>
          </div>
          <div className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
            <h2 className="h3-bold text-dark100_light900">Last Updated</h2>
            <p className="paragraph-medium text-dark300_light700 mt-2">{links.length > 0 ? new Date(Math.max(...links.map((link) => link.updatedAt))).toLocaleDateString() : 'No links yet'}</p>
          </div>
        </section>

        {/* My Links Section */}
        <section className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
          <div className="flex-between mb-6">
            <h2 className="h3-bold text-dark100_light900">My Links</h2>
            <button type="button" onClick={() => setIsAddLinkModalOpen(true)} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors">
              <Image src="/icons/plus.svg" alt="Add icon" width={20} height={20} />
              Add New Link
            </button>
          </div>

          {links.length === 0 ? (
            <div className="flex-center flex-col py-8">
              <Image src="/icons/empty.svg" alt="No links" width={120} height={120} className="opacity-50" />
              <p className="paragraph-medium text-dark300_light700 mt-4">You haven&apos;t added any links yet</p>
              <button type="button" onClick={() => setIsAddLinkModalOpen(true)} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors mt-4">
                <Image src="/icons/plus.svg" alt="Add icon" width={20} height={20} />
                Add Your First Link
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {links.map((link) => (
                <LinkCard key={link.id} link={link} category={categories.find((cat) => cat.id === link.categoryId)} onEdit={openEditLinkModal} onDelete={openDeleteLinkDialog} />
              ))}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
          <div className="flex-between mb-6">
            <h2 className="h3-bold text-dark100_light900">My Categories</h2>
            <button type="button" onClick={() => setIsAddCategoryModalOpen(true)} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors">
              <Image src="/icons/plus.svg" alt="Add icon" width={20} height={20} />
              Add Category
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="flex-center flex-col py-8">
              <Image src="/icons/empty.svg" alt="No categories" width={120} height={120} className="opacity-50" />
              <p className="paragraph-medium text-dark300_light700 mt-4">You haven&apos;t created any categories yet</p>
              <button type="button" onClick={() => setIsAddCategoryModalOpen(true)} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors mt-4">
                <Image src="/icons/plus.svg" alt="Add icon" width={20} height={20} />
                Create Your First Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} linkCount={links.filter((link) => link.categoryId === category.id).length} onEdit={openEditCategoryModal} onDelete={openDeleteCategoryDialog} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Link Modals */}
      <Modal isOpen={isAddLinkModalOpen} onClose={() => setIsAddLinkModalOpen(false)} title="Add New Link">
        <AddLinkForm categories={categories} onSubmit={handleAddLink} onCancel={() => setIsAddLinkModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isEditLinkModalOpen}
        onClose={() => {
          setIsEditLinkModalOpen(false);
          setCurrentLink(null);
        }}
        title="Edit Link"
      >
        <AddLinkForm
          initialData={currentLink}
          categories={categories}
          onSubmit={handleEditLink}
          onCancel={() => {
            setIsEditLinkModalOpen(false);
            setCurrentLink(null);
          }}
        />
      </Modal>

      {/* Category Modals */}
      <Modal isOpen={isAddCategoryModalOpen} onClose={() => setIsAddCategoryModalOpen(false)} title="Add New Category">
        <AddCategoryForm onSubmit={handleAddCategory} onCancel={() => setIsAddCategoryModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isEditCategoryModalOpen}
        onClose={() => {
          setIsEditCategoryModalOpen(false);
          setCurrentCategory(null);
        }}
        title="Edit Category"
      >
        <AddCategoryForm
          initialData={currentCategory}
          onSubmit={handleEditCategory}
          onCancel={() => {
            setIsEditCategoryModalOpen(false);
            setCurrentCategory(null);
          }}
        />
      </Modal>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isDeleteLinkDialogOpen}
        onClose={() => {
          setIsDeleteLinkDialogOpen(false);
          setLinkToDelete(null);
        }}
        onConfirm={handleDeleteLink}
        title="Delete Link"
        message="Are you sure you want to delete this link? This action cannot be undone."
        isLoading={isDeleting}
      />

      <ConfirmDialog
        isOpen={isDeleteCategoryDialogOpen}
        onClose={() => {
          setIsDeleteCategoryDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
