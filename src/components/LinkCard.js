import Image from 'next/image';
import PropTypes from 'prop-types';

function LinkCard({ link, category, onEdit, onDelete, isAdmin }) {
  return (
    <div className="background-light800_dark400 rounded-lg p-4 hover:shadow-light200 dark:hover:shadow-dark-100 transition-shadow">
      <div className="flex-between mb-2">
        <h3 className="paragraph-semibold text-dark100_light900 truncate">{link.title}</h3>
        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button type="button" className="text-dark400_light700 hover:text-primary-500" onClick={() => onEdit(link)}>
                <Image src="/icons/edit.svg" alt="Edit" width={16} height={16} />
              </button>
            )}
            {onDelete && (
              <button type="button" className="text-dark400_light700 hover:text-red-500" onClick={() => onDelete(link.id)}>
                <Image src="/icons/trash.svg" alt="Delete" width={16} height={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="body-medium text-dark300_light700 mb-2 truncate">{link.description}</p>

      <a href={link.url} target="_blank" rel="noopener noreferrer" className="body-medium text-primary-500 hover:underline truncate block">
        {link.url}
      </a>

      {category && (
        <div className="mt-2">
          <span className="inline-block bg-light-700 dark:bg-dark-400 text-dark400_light700 body-medium px-2 py-1 rounded-full">{category.name}</span>
        </div>
      )}

      {isAdmin && link.createdBy && (
        <div className="mt-2">
          <p className="small-medium text-dark400_light700">Added by: {link.createdBy}</p>
        </div>
      )}
    </div>
  );
}

LinkCard.propTypes = {
  link: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string,
    categoryId: PropTypes.string,
    createdBy: PropTypes.string,
  }).isRequired,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isAdmin: PropTypes.bool,
};

LinkCard.defaultProps = {
  category: null,
  onEdit: null,
  onDelete: null,
  isAdmin: false,
};

export default LinkCard;
