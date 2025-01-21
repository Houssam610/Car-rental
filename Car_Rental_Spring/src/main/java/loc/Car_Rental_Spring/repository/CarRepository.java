package loc.Car_Rental_Spring.repository;

import loc.Car_Rental_Spring.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    @Query(value = "SELECT * FROM cars c WHERE " +
            "(:brand IS NULL OR c.brand LIKE %:brand%) AND " +
            "(:type IS NULL OR c.type LIKE %:type%) AND " +
            "(:transmission IS NULL OR c.transmission LIKE %:transmission%) AND " +
            "(:color IS NULL OR c.color LIKE %:color%)", nativeQuery = true)
    List<Car> searchCars(@Param("brand") String brand,
                         @Param("type") String type,
                         @Param("transmission") String transmission,
                         @Param("color") String color);
}