import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function AddCategoryForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      // Form submission was successful
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors((prev) => ({
        ...prev,
        form: 'An error occurred. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="background-light900_dark200 rounded-lg shadow-light100_dark100 p-6 w-full max-w-2xl mx-auto">
      <h2 className="h3-bold text-dark100_light900 mb-6">{initialData ? 'Edit Category' : 'Add New Category'}</h2>

      <form onSubmit={handleSubmit}>
        {errors.form && <div className="bg-red-100 dark:bg-red-900/20 text-red-500 p-3 rounded-lg mb-4">{errors.form}</div>}

        <div className="flex flex-col gap-4">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="paragraph-medium text-dark300_light700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter category name" className={`paragraph-regular background-light800_dark400 text-dark100_light900 p-3 rounded-lg border ${errors.name ? 'border-red-500' : 'light-border'}`} />
            {errors.name && <p className="body-regular text-red-500">{errors.name}</p>}
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="paragraph-medium text-dark300_light700">
              Description
            </label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter a brief description" rows={3} className="paragraph-regular background-light800_dark400 text-dark100_light900 p-3 rounded-lg light-border resize-none" />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onCancel} className="flex items-center gap-2 background-light800_dark300 text-dark300_light700 paragraph-medium px-4 py-2 rounded-lg transition-colors hover:text-primary-500">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-light-900 border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Image src="/icons/save.svg" alt="Save" width={20} height={20} />
                  {initialData ? 'Update Category' : 'Add Category'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

AddCategoryForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

AddCategoryForm.defaultProps = {
  initialData: null,
};

export default AddCategoryForm;
