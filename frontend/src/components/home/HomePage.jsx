import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { homeService } from "../../services/api/homeService";

const ServiceCard = ({ title, description, link, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 text-center">
    <h3 className="text-xl font-semibold text-blue-950 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link
      to={link}
      className="inline-block px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors duration-200"
    >
      了解更多
    </Link>
  </div>
);

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await homeService.getServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            link={service.path}
            icon={service.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
