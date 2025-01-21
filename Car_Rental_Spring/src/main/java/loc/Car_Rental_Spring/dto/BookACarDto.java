package loc.Car_Rental_Spring.dto;

import loc.Car_Rental_Spring.enums.BookACarStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class BookACarDto {
    private Long id;
    private String fromDate; // Doit être au format ISO 8601 (ex: "2025-01-16T19:36:35.372Z")
    private String toDate;   // Doit être au format ISO 8601 (ex: "2025-01-21T19:36:37.882Z")
    private Long days;
    private BigDecimal price;
    private BookACarStatus bookACarStatus;
    private Long carId;
    private Long userId;
    private String username;
    private String email;
    private String name;
}