import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../style/SubCategories.css"; // New CSS file

function SubCategories() {
  const { subcategory, id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const subCategoryData = await axios.get(
          `http://localhost:5001/api/categories/subcategory/${id}`
        );
        setCategory(subCategoryData.data);
        console.log("subCategoryData: ", subCategoryData.data);
      } catch (error) {
        console.error(
          "Error fetching Subcategories",
          error.response?.data || error.message || error
        );
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="subcategories-page-wrapper">
      {/* Breadcrumb */}
      <div className="subcategories-breadcrumb">
        <Link to="/" className="breadcrumb-item">
          Home
        </Link>
        <span className="breadcrumb-divider">›</span>
        <Link to="/categories" className="breadcrumb-item">
          Categories
        </Link>
        <span className="breadcrumb-divider">›</span>
        <span className="breadcrumb-active">{subcategory}</span>
      </div>

      {/* Main Content */}
      <main className="subcategories-main">
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : (
          <>
            <section className="subcategories-hero">
              <h1>{category.name}</h1>
              <p>Explore all subcategories in {category.name.toLowerCase()}</p>
            </section>
            <section className="subcategories-grid-container">
              {category.type.map((sub) => (
                <Link
                  key={sub._id || sub.name} // Use _id if available, fallback to name
                  to={`/products/${category.name}/${sub.name}`}
                  className="subcategory-card-wrapper"
                >
                  <div className="subcategory-card">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="subcategory-image"
                    />
                    <h3 className="subcategory-name">{sub.name}</h3>
                  </div>
                </Link>
              ))}
            </section>
            <Link to="/" className="back-to-home-link">
              Back to Home
            </Link>
          </>
        )}
      </main>
    </div>
  );
}

export default SubCategories;
