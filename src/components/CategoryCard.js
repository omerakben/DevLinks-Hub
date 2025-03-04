import Image from 'next/image';
import PropTypes from 'prop-types';

function CategoryCard({ category, linkCount, onEdit, onDelete }) {
  return (
    <div className="background-light800_dark400 rounded-lg p-4 hover:shadow-light200 dark:hover:shadow-dark-100 transition-shadow">
      <div className="flex-between mb-2">
        <h3 className="paragraph-semibold text-dark100_light900">{category.name}</h3>
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button type="button" className="text-dark400_light700 hover:text-primary-500" onClick={() => onEdit(category)}>
                <Image src="/icons/edit.svg" alt="Edit" width={16} height={16} />
              </button>
            )}
            {onDelete && (
              <button type="button" className="text-dark400_light700 hover:text-red-500" onClick={() => onDelete(category.id)}>
                <Image src="/icons/trash.svg" alt="Delete" width={16} height={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="body-medium text-dark300_light700">
        {linkCount} {linkCount === 1 ? 'link' : 'links'}
      </p>

      {category.description && <p className="body-medium text-dark300_light700 mt-2 truncate">{category.description}</p>}
    </div>
  );
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  linkCount: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

CategoryCard.defaultProps = {
  linkCount: 0,
  onEdit: null,
  onDelete: null,
};

export default CategoryCard;
