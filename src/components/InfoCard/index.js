import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import copy from 'clipboard-copy';
import { getLocalStorage } from '../../utils';
import shareIcon from '../../images/shareIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import './style.css';

const InfoCard = ({ recipe, setRecipes, index }) => {
  const [shared, setShared] = useState(false);
  const {
    alcoholicOrNot,
    area,
    category,
    id,
    image,
    name,
    type,
    doneDate,
    tags,
  } = recipe;
  const history = useHistory();
  const { pathname } = useLocation();

  const handleShare = () => {
    copy(`http://localhost:3000/${type}s/${id}`);
    setShared(true);
  };

  const handleFavorite = () => {
    const favorites = getLocalStorage('favoriteRecipes');
    const filteredFavorites = favorites.filter(({ id: idStorage }) => id !== idStorage);
    localStorage.setItem('favoriteRecipes', JSON.stringify(filteredFavorites));
    setRecipes(filteredFavorites);
  };

  const renderFavoritePage = () => (
    <div className="w-100">
      <button
        type="button"
        onClick={ handleFavorite }
        className="info-card-favorite"
      >
        <img
          src={ blackHeartIcon }
          alt="Share"
          data-testid={ `${index}-horizontal-favorite-btn` }
        />
      </button>
    </div>
  );

  const renderDonePage = () => (
    <div>
      <p className="date" data-testid={ `${index}-horizontal-done-date` }>
        Feita em:
        { doneDate }
      </p>
      <div className="card-tags-div">
        {
          tags.filter((e, i) => i <= 1)
            .map((tag) => (
              <div
                key={ `tag - ${tag}` }
                className="info-card-tag"
                data-testid={ `${index}-${tag}-horizontal-tag` }
              >
                { tag }
              </div>
            ))
        }
      </div>
    </div>
  );

  return (
    <div className="info-card" id="info-card">
      <img
        src={ image }
        alt={ `${name}` }
        onClick={ () => history.push(`/${type}s/${id}`) }
        aria-hidden="true"
        data-testid={ `${index}-horizontal-image` }
      />
      <div className="info-card-info w-100">
        <button
          className="share-btn-info-card"
          type="button"
          onClick={ handleShare }
        >
          <img
            src={ shareIcon }
            alt="Share"
            data-testid={ `${index}-horizontal-share-btn` }
          />
        </button>
        <p className="info-area-category" data-testid={ `${index}-horizontal-top-text` }>
          {
            type === 'bebida'
              ? alcoholicOrNot
              : `${area} - ${category}`
          }
        </p>
        <p
          className="info-card-name"
          data-testid={ `${index}-horizontal-name` }
          onClick={ () => history.push(`/${type}s/${id}`) }
          aria-hidden="true"
        >
          { name }
        </p>
        {
          pathname.includes('favoritas')
            ? renderFavoritePage() : renderDonePage()
        }
      </div>
      { shared && <p className="info-card-copy">Link copiado!</p> }
    </div>
  );
};

InfoCard.propTypes = {
  recipe: PropTypes.shape({
    alcoholicOrNot: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    doneDate: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setRecipes: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default InfoCard;
