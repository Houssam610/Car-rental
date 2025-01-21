package loc.Car_Rental_Spring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import loc.Car_Rental_Spring.dto.BookACarDto;
import loc.Car_Rental_Spring.enums.BookACarStatus;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.validation.constraints.NotNull;

@Entity
@Data
public class BookACar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Instant fromDate;

    @NotNull
    private Instant toDate;

    @NotNull
    private Long days;

    @NotNull
    private BigDecimal price;

    @NotNull
    private BookACarStatus bookACarStatus;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "car_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Car car;



    public BookACarDto getBookACarDto() {
        BookACarDto bookACarDto = new BookACarDto();
        bookACarDto.setId(this.id);

        // Validation et formatage des dates
        if (this.fromDate != null && this.toDate != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
            bookACarDto.setFromDate(formatter.format(this.fromDate));
            bookACarDto.setToDate(formatter.format(this.toDate));
        } else {
            bookACarDto.setFromDate(null);
            bookACarDto.setToDate(null);
        }

        bookACarDto.setDays(this.days);
        bookACarDto.setPrice(this.price);
        bookACarDto.setEmail(user.getEmail());
        bookACarDto.setName(user.getName());
        bookACarDto.setBookACarStatus(this.bookACarStatus);
        bookACarDto.setCarId(this.car != null ? this.car.getId() : null);
        bookACarDto.setUserId(this.user != null ? this.user.getId() : null);
        return bookACarDto;
    }
}