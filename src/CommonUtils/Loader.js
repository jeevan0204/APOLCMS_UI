
import Spinner from 'react-bootstrap/Spinner';
import { useSelector } from 'react-redux';


const Loader = () => {
  const loadingSpinner = useSelector((state) => state.reducers.loadingSpinnerReducer.showLoadingSpinner);
  return (
    <div>
      {loadingSpinner &&
        <div className="fp-container">
          <Spinner animation="border" size="500" variant="info" className="fp-loader" />
        </div>

      }
    </div>
  )
}

export default Loader;