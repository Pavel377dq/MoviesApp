import './TopBar.css';

function TopBar({ pageApp, changePageApp }) {
  const onKeyDown = (e, itemName) => {
    if (e.keyCode === 13) {
      changePageApp(itemName);
    }
  };

  return (
    <ul className="top-bar">
      <li>
        <button
          type="button"
          className={`top-bar__button${pageApp === 'Search' ? ' top-bar__button--active' : ''}`}
          onClick={() => changePageApp('Search')}
          onKeyDown={(e) => onKeyDown(e, 'Search')}
        >
          Search
        </button>
      </li>
      <li>
        <button
          type="button"
          className={`top-bar__button${pageApp === 'Rated' ? ' top-bar__button--active' : ''}`}
          onClick={() => changePageApp('Rated')}
          onKeyDown={(e) => onKeyDown(e, 'Rated')}
        >
          Rated
        </button>
      </li>
    </ul>
  );
}

export default TopBar;