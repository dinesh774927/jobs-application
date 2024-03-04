import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-bg">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="para-home">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs">
        <button className="home-button" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)

export default Home
