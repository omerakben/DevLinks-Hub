import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function AddLinkForm({ initialData, categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        url: initialData.url || '',
        description: initialData.description || '',
        categoryId: initialData.categoryId || '',
      });
    } else if (categories.length > 0) {
      // Set default category if adding new link
      setFormData((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [initialData, categories]);

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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      // Use a function that returns a boolean instead of relying on try/catch
      const isValidUrl = (urlString) => {
        try {
          return Boolean(new URL(urlString));
        } catch (e) {
          return false;
        }
      };

      if (!isValidUrl(formData.url)) {
        newErrors.url = 'Please enter a valid URL (include http:// or https://)';
      }
    }

    if (categories.length > 0 && !formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
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
      <h2 className="h3-bold text-dark100_light900 mb-6">{initialData ? 'Edit Link' : 'Add New Link'}</h2>

      <form onSubmit={handleSubmit}>
        {errors.form && <div className="bg-red-100 dark:bg-red-900/20 text-red-500 p-3 rounded-lg mb-4">{errors.form}</div>}

        <div className="flex flex-col gap-4">
          {/* Title Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="paragraph-medium text-dark300_light700">
              Title <span className="text-red-500">*</span>
            </label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter link title" className={`paragraph-regular background-light800_dark400 text-dark100_light900 p-3 rounded-lg border ${errors.title ? 'border-red-500' : 'light-border'}`} />
            {errors.title && <p className="body-regular text-red-500">{errors.title}</p>}
          </div>

          {/* URL Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="url" className="paragraph-medium text-dark300_light700">
              URL <span className="text-red-500">*</span>
            </label>
            <input type="url" id="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://example.com" className={`paragraph-regular background-light800_dark400 text-dark100_light900 p-3 rounded-lg border ${errors.url ? 'border-red-500' : 'light-border'}`} />
            {errors.url && <p className="body-regular text-red-500">{errors.url}</p>}
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="paragraph-medium text-dark300_light700">
              Description
            </label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter a brief description" rows={3} className="paragraph-regular background-light800_dark400 text-dark100_light900 p-3 rounded-lg light-border resize-none" />
          </div>

          {/* Category Field */}
          {categories.length > 0 && (
            <div className="flex flex-col gap-2">
              <label htmlFor="categoryId" className="paragraph-medium text-dark300_light700">
                Category <span className="text-red-500">*</span>
              </label>
              <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} className={`paragraph-regular background-light800_dark400 text-dark100_light900 p-3 rounded-lg border ${errors.categoryId ? 'border-red-500' : 'light-border'}`}>
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="body-regular text-red-500">{errors.categoryId}</p>}
            </div>
          )}

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
                  {initialData ? 'Update Link' : 'Add Link'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

AddLinkForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
    description: PropTypes.string,
    categoryId: PropTypes.string,
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

AddLinkForm.defaultProps = {
  initialData: null,
  categories: [],
};

export default AddLinkForm;
