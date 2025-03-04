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
import { createPublicCategory, createPublicLink, deletePublicCategory, deletePublicLink, getPublicCategories, getPublicLinks, updatePublicCategory, updatePublicLink } from '@/utils/database';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user, isAdmin, userLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const [publicLinks, setPublicLinks] = useState([]);
  const [publicCategories, setPublicCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
    const fetchPublicData = async () => {
      if (user && !userLoading) {
        if (!isAdmin) {
          // Redirect non-admin users
          router.push('/');
          return;
        }

        try {
          setIsLoading(true);
          const [links, categories] = await Promise.all([getPublicLinks(), getPublicCategories()]);

          setPublicLinks(links);
          setPublicCategories(categories);
        } catch (error) {
          console.error('Error fetching public data:', error);
          showError('Failed to load public data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPublicData();
  }, [user, userLoading, isAdmin, router, showError]);

  // Link CRUD operations
  const handleAddLink = async (linkData) => {
    try {
      // Add creator info to the link
      const linkWithCreator = {
        ...linkData,
        createdBy: user.displayName || user.email,
        createdById: user.uid,
      };

      const newLink = await createPublicLink(linkWithCreator);
      setPublicLinks((prevLinks) => [...prevLinks, newLink]);
      setIsAddLinkModalOpen(false);
      showSuccess('Public link added successfully!');
    } catch (error) {
      console.error('Error adding public link:', error);
      showError('Failed to add public link. Please try again.');
      throw error; // Re-throw to be caught by the form
    }
  };

  const handleEditLink = async (linkData) => {
    try {
      const updatedLink = await updatePublicLink(currentLink.id, linkData);
      setPublicLinks((prevLinks) => prevLinks.map((link) => (link.id === updatedLink.id ? updatedLink : link)));
      setIsEditLinkModalOpen(false);
      setCurrentLink(null);
      showSuccess('Public link updated successfully!');
    } catch (error) {
      console.error('Error updating public link:', error);
      showError('Failed to update public link. Please try again.');
      throw error; // Re-throw to be caught by the form
    }
  };

  const handleDeleteLink = async () => {
    if (!linkToDelete) return;

    try {
      setIsDeleting(true);
      await deletePublicLink(linkToDelete);
      setPublicLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkToDelete));
      showSuccess('Public link deleted successfully!');
    } catch (error) {
      console.error('Error deleting public link:', error);
      showError('Failed to delete public link. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteLinkDialogOpen(false);
      setLinkToDelete(null);
    }
  };

  // Category CRUD operations
  const handleAddCategory = async (categoryData) => {
    try {
      const newCategory = await createPublicCategory(categoryData);
      setPublicCategories((prevCategories) => [...prevCategories, newCategory]);
      setIsAddCategoryModalOpen(false);
      showSuccess('Public category added successfully!');
    } catch (error) {
      console.error('Error adding public category:', error);
      showError('Failed to add public category. Please try again.');
      throw error; // Re-throw to be caught by the form
    }
  };

  const handleEditCategory = async (categoryData) => {
    try {
      const updatedCategory = await updatePublicCategory(currentCategory.id, categoryData);
      setPublicCategories((prevCategories) => prevCategories.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)));
      setIsEditCategoryModalOpen(false);
      setCurrentCategory(null);
      showSuccess('Public category updated successfully!');
    } catch (error) {
      console.error('Error updating public category:', error);
      showError('Failed to update public category. Please try again.');
      throw error; // Re-throw to be caught by the form
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);

      // Check if category has links
      const categoryLinks = publicLinks.filter((link) => link.categoryId === categoryToDelete);
      if (categoryLinks.length > 0) {
        showError('Cannot delete category that contains links. Please remove the links first or reassign them to another category.');
        return;
      }

      await deletePublicCategory(categoryToDelete);
      setPublicCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryToDelete));
      showSuccess('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting public category:', error);
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

  // Redirect non-admin users (additional check)
  if (!isAdmin) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8">
        {/* Admin Header */}
        <section className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {user?.photoURL && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <Image src={user.photoURL} alt={user.displayName || 'Admin'} fill className="object-cover" />
              </div>
            )}
            <div className="flex flex-col text-center md:text-left">
              <h1 className="h2-bold text-dark100_light900">Admin Dashboard</h1>
              <p className="paragraph-regular text-dark300_light700 mt-2">Manage public resources for all DevLinks Hub users</p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
            <h2 className="h3-bold text-dark100_light900">Public Links</h2>
            <p className="h2-bold text-primary-500 mt-2">{publicLinks.length}</p>
          </div>
          <div className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
            <h2 className="h3-bold text-dark100_light900">Public Categories</h2>
            <p className="h2-bold text-primary-500 mt-2">{publicCategories.length}</p>
          </div>
          <div className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
            <h2 className="h3-bold text-dark100_light900">Last Updated</h2>
            <p className="paragraph-medium text-dark300_light700 mt-2">{publicLinks.length > 0 ? new Date(Math.max(...publicLinks.map((link) => link.updatedAt))).toLocaleDateString() : 'No links yet'}</p>
          </div>
        </section>

        {/* Public Links Section */}
        <section className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
          <div className="flex-between mb-6">
            <h2 className="h3-bold text-dark100_light900">Public Links</h2>
            <button type="button" onClick={() => setIsAddLinkModalOpen(true)} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors">
              <Image src="/icons/plus.svg" alt="Add icon" width={20} height={20} />
              Add Public Link
            </button>
          </div>

          {publicLinks.length === 0 ? (
            <div className="flex-center flex-col py-8">
              <Image src="/icons/empty.svg" alt="No links" width={120} height={120} className="opacity-50" />
              <p className="paragraph-medium text-dark300_light700 mt-4">No public links have been added yet</p>
              <button type="button" onClick={() => setIsAddLinkModalOpen(true)} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors mt-4">
                <Image src="/icons/plus.svg" alt="Add icon" width={20} height={20} />
                Add First Public Link
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicLinks.map((link) => (
                <LinkCard key={link.id} link={link} category={publicCategories.find((cat) => cat.id === link.categoryId)} onEdit={openEditLinkModal} onDelete={openDeleteLinkDialog} isAdmin />
              ))}
            </div>
          )}
        </section>

        {/* Public Categories Section */}
        <section className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
          <div className="flex-between mb-6">
            <h2 className="h3-bold text-dark100_light900">Public Categories</h2>
            <button type="button" onClick={() => setIsAddCategoryModalOpen(true)} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors">
              <Image src="/icons/plus.svg" alt="Add icon" width={20} height={20} />
              Add Public Category
            </button>
          </div>

          {publicCategories.length === 0 ? (
            <div className="flex-center flex-col py-8">
              <Image src="/icons/empty.svg" alt="No categories" width={120} height={120} className="opacity-50" />
              <p className="paragraph-medium text-dark300_light700 mt-4">No public categories have been created yet</p>
              <button type="button" onClick={() => setIsAddCategoryModalOpen(true)} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors mt-4">
                <Image src="/icons/plus.svg" alt="Add icon" width={20} height={20} />
                Create First Public Category
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {publicCategories.map((category) => (
                <CategoryCard key={category.id} category={category} linkCount={publicLinks.filter((link) => link.categoryId === category.id).length} onEdit={openEditCategoryModal} onDelete={openDeleteCategoryDialog} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Link Modals */}
      <Modal isOpen={isAddLinkModalOpen} onClose={() => setIsAddLinkModalOpen(false)} title="Add Public Link">
        <AddLinkForm categories={publicCategories} onSubmit={handleAddLink} onCancel={() => setIsAddLinkModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isEditLinkModalOpen}
        onClose={() => {
          setIsEditLinkModalOpen(false);
          setCurrentLink(null);
        }}
        title="Edit Public Link"
      >
        <AddLinkForm
          initialData={currentLink}
          categories={publicCategories}
          onSubmit={handleEditLink}
          onCancel={() => {
            setIsEditLinkModalOpen(false);
            setCurrentLink(null);
          }}
        />
      </Modal>

      {/* Category Modals */}
      <Modal isOpen={isAddCategoryModalOpen} onClose={() => setIsAddCategoryModalOpen(false)} title="Add Public Category">
        <AddCategoryForm onSubmit={handleAddCategory} onCancel={() => setIsAddCategoryModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isEditCategoryModalOpen}
        onClose={() => {
          setIsEditCategoryModalOpen(false);
          setCurrentCategory(null);
        }}
        title="Edit Public Category"
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
        title="Delete Public Link"
        message="Are you sure you want to delete this public link? This action cannot be undone."
        isLoading={isDeleting}
      />

      <ConfirmDialog
        isOpen={isDeleteCategoryDialogOpen}
        onClose={() => {
          setIsDeleteCategoryDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteCategory}
        title="Delete Public Category"
        message="Are you sure you want to delete this public category? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
